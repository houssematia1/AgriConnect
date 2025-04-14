import { Injectable, OnDestroy } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import { BehaviorSubject, Observable } from 'rxjs';
import * as SockJS from 'sockjs-client';
import { filter, first, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class WebsocketService implements OnDestroy {
  private stompClient: any;
  private isConnected = new BehaviorSubject<boolean>(false);
  private destinataireId = 1;

  // Sujets pour les notifications
  private specificNotifSubject = new BehaviorSubject<any>(null);
  private generalNotifSubject = new BehaviorSubject<any>(null);

  constructor() {
    this.initialize();
  }

  private initialize() {
    const socket = new SockJS('http://localhost:8082/ws');
    this.stompClient = Stomp.over(socket);
    this.stompClient.debug = () => {}; // Désactive les logs verbeux

    this.stompClient.connect({}, () => {
      this.isConnected.next(true);
      this.setupSubscriptions();
    });
  }

  private setupSubscriptions() {
    // Subscription spécifique
    this.stompClient.subscribe(
      `/topic/notifications/${this.destinataireId}`, 
      (message: any) => {
        this.specificNotifSubject.next(JSON.parse(message.body));
      }
    );

    // Subscription générale
    this.stompClient.subscribe(
      '/topic/notifications', 
      (message: any) => {
        this.generalNotifSubject.next(JSON.parse(message.body));
      }
    );
  }

  getSpecificNotifications(): Observable<any> {
    return this.isConnected.pipe(
      filter(connected => connected),
      first(),
      switchMap(() => this.specificNotifSubject.asObservable())
    );
  }

  getGeneralNotifications(): Observable<any> {
    return this.isConnected.pipe(
      filter(connected => connected),
      first(),
      switchMap(() => this.generalNotifSubject.asObservable())
    );
  }

  ngOnDestroy() {
    this.stompClient?.disconnect();
  }
}
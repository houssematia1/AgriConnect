import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebsocketService } from '../websocket.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: any[] = [];
  private subscriptions: Subscription[] = [];

  constructor(private websocketService: WebsocketService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.websocketService.getSpecificNotifications().subscribe(notification => {
        this.notifications.push({
          type: 'Personnelle',
          content: notification.message,
          timestamp: new Date()
        });
      })
    );

    this.subscriptions.push(
      this.websocketService.getGeneralNotifications().subscribe(notification => {
        this.notifications.push({
          type: 'Générale',
          content: notification.message,
          timestamp: new Date()
        });
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
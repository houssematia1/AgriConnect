import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Livraison, LivraisonService } from './LivraisonService';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-livraison',
  templateUrl: './livraison.component.html',
  styleUrls: ['./livraison.component.css'],
})
export class LivraisonComponent implements OnInit {
  currentOrderId: number | null = null;
  stream: MediaStream | null = null;
  isSidebarCollapsed = false;
  isCameraActive = false;
  isReasonInputActive = false;
  driverName: string = 'Driver';
  userId: number | null = null;

  @ViewChild('video') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvasElement!: ElementRef<HTMLCanvasElement>;
  @ViewChild('reasonInput') reasonInputElement!: ElementRef<HTMLTextAreaElement>;

  commandes: Livraison[] = [];

  constructor(
    private livraisonService: LivraisonService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('userId');
      this.userId = id ? +id : null; // Convert string to number
      this.loadOrders();
      this.getLoggedInUser();
    });
  }

  getLoggedInUser() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      this.driverName = user.prenom || 'Driver';
      this.userId = user.id || null; // Ensure userId is consistent
    }
  }

  loadOrders() {
    console.log('Loading commandes from API...');
    this.livraisonService.getAllLivraisons().subscribe({
      next: (data) => {
        console.log('Commandes loaded:', data);
        // Map the backend data to our component's format
        this.commandes = data.map(commande => ({
          ...commande,
          statusLivraison: commande.statut === 'PENDING' ? 'EN_COURS' : commande.statut,
          clientName: commande.clientNom
        }));
      },
      error: (error) => {
        console.error('Error loading commandes:', error);
        // Fallback to sample data if API fails
        this.commandes = [
          {
            id: 1,
            statut: 'PENDING',
            clientNom: 'Jean Dupont',
            photo: null,
            reason: null,
            address: '123 Rue de Paris',
            orderDate: new Date()
          },
          {
            id: 2,
            statut: 'PENDING',
            clientNom: 'Marie Martin',
            photo: null,
            reason: null,
            address: '456 Avenue des Champs-Élysées',
            orderDate: new Date()
          }
        ];
      }
    });
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userEmail');
    this.driverName = 'Driver';
    this.userId = null;
    this.router.navigate(['/login']);
  }

  showConfirm(orderId: number) {
    this.currentOrderId = orderId;
    this.resetModal();
    const modal = document.getElementById('confirmModal');
    if (modal) modal.style.display = 'flex';
  }

  resetModal() {
    this.isCameraActive = false;
    this.isReasonInputActive = false;
    if (this.reasonInputElement) this.reasonInputElement.nativeElement.value = '';
    this.stopCamera();
  }

  hideConfirm() {
    const modal = document.getElementById('confirmModal');
    if (modal) modal.style.display = 'none';
    this.stopCamera();
    this.currentOrderId = null;
    this.isCameraActive = false;
    this.isReasonInputActive = false;
  }

  async startCamera() {
    this.isCameraActive = true;
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (this.videoElement) this.videoElement.nativeElement.srcObject = this.stream;
    } catch (err) {
      alert('Unable to access camera: ' + (err as Error).message);
      this.resetModal();
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  capturePhoto() {
    if (this.videoElement && this.canvasElement && this.currentOrderId) {
      const video = this.videoElement.nativeElement;
      const canvas = this.canvasElement.nativeElement;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')!.drawImage(video, 0, 0);

      const photoData = canvas.toDataURL('image/png');
      const order = this.commandes.find(o => o.id === this.currentOrderId);
      if (order) {
        order.statut = 'LIVRE';
        order.photo = photoData;
        this.livraisonService.updateLivraison(order.id, order).subscribe(() => {
          this.loadOrders();
        });
      }
      this.stopCamera();
      this.hideConfirm();
    }
  }

  showReasonInput() {
    this.isReasonInputActive = true;
  }

  submitNonLivre() {
    if (this.reasonInputElement && this.currentOrderId) {
      const reason = this.reasonInputElement.nativeElement.value.trim();
      if (reason) {
        const order = this.commandes.find(o => o.id === this.currentOrderId);
        if (order) {
          order.statut = 'NON_LIVRE';
          order.reason = reason;
          this.livraisonService.updateLivraison(order.id, order).subscribe(() => {
            this.loadOrders();
          });
        }
        this.hideConfirm();
      } else {
        alert('Please provide a reason for non-delivery.');
      }
    }
  }
}

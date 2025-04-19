import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LivraisonService, Commande, Livraison } from './LivraisonService';

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
  hidingOrders: Set<number> = new Set();
  private orderTimers: Map<number, number> = new Map();
  private timerIntervals: Map<number, any> = new Map();

  @ViewChild('video') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvasElement!: ElementRef<HTMLCanvasElement>;
  @ViewChild('reasonInput') reasonInputElement!: ElementRef<HTMLTextAreaElement>;

  commandes: Livraison[] = [];
  pendingCommandes: Livraison[] = [];

  constructor(
    private livraisonService: LivraisonService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('userId');
      this.userId = id ? +id : null;
      this.loadDriverInfo();
      this.loadCommandes();
    });
  }

  loadDriverInfo() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        this.driverName = user.prenom || user.nom || 'Driver';
        this.userId = user.id || null;
      } catch (error) {
        console.error('Error parsing user data:', error);
        this.driverName = 'Driver';
      }
    }
  }

  loadCommandes() {
    console.log('Loading commandes from API...');
    this.livraisonService.getAllCommandes().subscribe({
      next: (data) => {
        console.log('Commandes loaded:', data);
        this.commandes = data
          .filter((commande): commande is Commande => !!commande && typeof commande.id === 'number')
          .map(commande => ({
            id: commande.id,
            statusLivraison: commande.statut === 'PENDING' ? 'TAKE_IT' : commande.statut || 'TAKE_IT',
            typeLivraison: 'A_DOMICILE',
            livreur: commande.livreur || {
              id: 0,
              nom: '',
              email: '',
              telephone: '',
              userId: 0
            },
            commandeId: commande.id,
            clientNom: commande.clientNom || 'Unknown Client',
            address: commande.address || 'Unknown Address',
            telephone: commande.telephone || 'Unknown Telephone',
            isTaken: commande.statut === 'EN_COURS' || !!commande.livreur?.nom,
            photo: undefined,
            reason: undefined
          }));
        
        this.pendingCommandes = this.commandes.filter(commande => 
          (commande.statusLivraison === 'TAKE_IT' || commande.statusLivraison === 'EN_COURS') && 
          !this.hidingOrders.has(commande.id!)
        );
        
        this.pendingCommandes = [...this.pendingCommandes];
      },
      error: (error) => {
        console.error('Error loading commandes:', error.message);
        alert(`Erreur lors du chargement des commandes: ${error.message}`);
        this.commandes = [];
        this.pendingCommandes = [];
      }
    });
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  showConfirm(orderId: number, action: 'LIVRE' | 'NON_LIVRE') {
    this.currentOrderId = orderId;
    this.resetModal();
    if (action === 'LIVRE') {
      this.startCamera();
    } else {
      this.showReasonInput();
    }
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
      console.error('Camera access error:', err);
      alert('Impossible d\'accéder à la caméra: ' + (err as Error).message);
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
      if (order?.id) {
        order.statusLivraison = 'LIVRE';
        order.photo = photoData;
        this.livraisonService.updateLivraison(order.id, order).subscribe({
          next: () => {
            if (order.id) this.hideOrderWithDelay(order.id);
          },
          error: (error) => {
            console.error('Error updating livraison:', error);
            alert('Erreur lors de la mise à jour du statut.');
          }
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
        if (order?.id) {
          order.statusLivraison = 'NON_LIVRE';
          order.reason = reason;
          this.livraisonService.updateLivraison(order.id, order).subscribe({
            next: () => {
              if (order.id) this.hideOrderWithDelay(order.id);
            },
            error: (error) => {
              console.error('Error updating livraison:', error);
              alert('Erreur lors de la mise à jour du statut.');
            }
          });
        }
        this.hideConfirm();
      } else {
        alert('Veuillez fournir une raison pour la non-livraison.');
      }
    }
  }

  private hideOrderWithDelay(orderId: number) {
    if (!orderId) {
      console.error('Cannot hide order without ID');
      return;
    }

    this.hidingOrders.add(orderId);
    this.orderTimers.set(orderId, 10);
    
    const timerInterval = setInterval(() => {
      const currentTime = this.orderTimers.get(orderId);
      if (currentTime && currentTime > 0) {
        this.orderTimers.set(orderId, currentTime - 1);
      }
    }, 1000);
    
    this.timerIntervals.set(orderId, timerInterval);
    
    setTimeout(() => {
      if (this.timerIntervals.has(orderId)) {
        clearInterval(this.timerIntervals.get(orderId));
        this.pendingCommandes = this.pendingCommandes.filter(c => c.id !== orderId);
        this.hidingOrders.delete(orderId);
        this.orderTimers.delete(orderId);
        this.timerIntervals.delete(orderId);
        this.pendingCommandes = [...this.pendingCommandes];
      }
    }, 10000);
  }

  cancelStatusChange(commande: Livraison) {
    if (commande.id) {
      if (this.timerIntervals.has(commande.id)) {
        clearInterval(this.timerIntervals.get(commande.id));
        this.timerIntervals.delete(commande.id);
      }
      
      this.hidingOrders.delete(commande.id);
      this.orderTimers.delete(commande.id);
      
      commande.statusLivraison = commande.isTaken ? 'EN_COURS' : 'TAKE_IT';
      
      this.livraisonService.updateLivraison(commande.id, commande).subscribe({
        next: () => {
          console.log('Status reverted to', commande.statusLivraison);
          this.pendingCommandes = [...this.pendingCommandes];
        },
        error: (error) => {
          console.error('Error reverting status:', error);
          alert('Erreur lors de la réinitialisation du statut.');
        }
      });
    }
  }

  getRemainingTime(orderId: number): number {
    return this.orderTimers.get(orderId) || 0;
  }

  takeOrder(commande: Livraison) {
    if (!commande.id) {
      console.error('Cannot take order: Missing commande ID');
      alert('Erreur: Commande non valide');
      return;
    }

    const currentUser = localStorage.getItem('currentUser');
    const userEmail = localStorage.getItem('userEmail') || 'ramzi@example.com';

    if (!currentUser) {
      console.error('Cannot take order: User not logged in', { currentUser, userEmail });
      alert('Erreur: Vous devez être connecté pour prendre une commande');
      this.router.navigate(['/login']);
      return;
    }

    try {
      const user = JSON.parse(currentUser);
      if (!user.id || !user.nom) {
        console.error('Invalid user data:', user);
        alert('Erreur: Données utilisateur incomplètes');
        this.router.navigate(['/login']);
        return;
      }

      const newLivraison: Livraison = {
        dateLivraison: new Date().toISOString().split('T')[0],
        statusLivraison: 'EN_COURS',
        typeLivraison: 'A_DOMICILE',
        livreur: {
          id: user.id,
          nom: user.nom,
          email: userEmail,
          telephone: user.telephone || user.numeroDeTelephone || '',
          userId: user.id
        },
        commandeId: commande.id,
        isTaken: true
      };

      console.log('Attempting to create livraison:', JSON.stringify(newLivraison, null, 2));

      this.livraisonService.createLivraison(newLivraison).subscribe({
        next: (response) => {
          console.log('Livraison created successfully:', response);
          // Update local commande object
          commande.isTaken = true;
          commande.statusLivraison = 'EN_COURS';
          commande.livreur = newLivraison.livreur;
          // Update commandes and pendingCommandes arrays
          const commandeIndex = this.commandes.findIndex(c => c.id === commande.id);
          if (commandeIndex !== -1) {
            this.commandes[commandeIndex] = { ...commande };
          }
          const pendingIndex = this.pendingCommandes.findIndex(c => c.id === commande.id);
          if (pendingIndex !== -1) {
            this.pendingCommandes[pendingIndex] = { ...commande };
          }
          // Trigger UI update
          this.pendingCommandes = [...this.pendingCommandes];
          alert('Commande prise en charge avec succès');
          // Optional: Call loadCommandes() only if needed (e.g., to sync other orders)
          // this.loadCommandes();
        },
        error: (error) => {
          console.error('Failed to create livraison:', error);
          alert(`Erreur lors de la prise en charge: ${error.message || 'Veuillez réessayer'}`);
        }
      });
    } catch (error) {
      console.error('Error processing user data:', error);
      alert('Erreur: Problème avec les données utilisateur');
      this.router.navigate(['/login']);
    }
  }
}
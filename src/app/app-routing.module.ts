import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReclamationComponent } from './reclamation/reclamation.component';
import { DonComponent } from './don/don.component';
import { ChatbotComponent } from './chat-bot/chat-bot.component';

const routes: Routes = [
  { path: 'dons', component: DonComponent },
  { path: 'reclamation', component: ReclamationComponent },
  { path: 'chatbot', component: ChatbotComponent },
  { path: '', redirectTo: '/dons', pathMatch: 'full' }, // Default route
  { path: '**', redirectTo: '/dons' } // Fallback route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
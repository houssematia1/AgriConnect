import { Component, ElementRef, ViewChild } from '@angular/core';
import { ChatbotService } from '../Service/chatbot.service';
import { lastValueFrom } from 'rxjs';  // <-- Added import

interface Message {
    content: string;
    isUser: boolean;
    timestamp: Date;
}

@Component({
    selector: 'app-chatbot',
    templateUrl: './chat-bot.component.html',
    styleUrls: ['./chat-bot.component.css']
})
export class ChatbotComponent {
    userInput = '';
    messages: Message[] = [];
    @ViewChild('messageContainer') private messageContainer!: ElementRef;

    constructor(private chatbotService: ChatbotService) {}

    async sendMessage() {
        const userMessage = this.userInput.trim();
        if (!userMessage) return;

        // Add user message
        this.messages.push({
            content: userMessage,
            isUser: true,
            timestamp: new Date()
        });

        this.userInput = '';
        this.scrollToBottom();

        try {
            // Modified service call using lastValueFrom
            const botResponse = await lastValueFrom(
                this.chatbotService.getResponse(userMessage)
            );

            // Add bot response
            if (botResponse) {
                this.messages.push({
                    content: botResponse,
                    isUser: false,
                    timestamp: new Date()
                });
            }
            
            this.scrollToBottom();
        } catch (error) {
            console.error('Error:', error);
            this.messages.push({
                content: 'Sorry, I encountered an error. Please try again.',
                isUser: false,
                timestamp: new Date()
            });
            this.scrollToBottom();
        }
    }

    private scrollToBottom(): void {
        setTimeout(() => {
            try {
                this.messageContainer.nativeElement.scrollTop = 
                    this.messageContainer.nativeElement.scrollHeight;
            } catch(err) { }
        }, 100);
    }
}
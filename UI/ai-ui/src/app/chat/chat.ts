import { Component } from '@angular/core';
import { Ai } from '../services/ai';
@Component({
  selector: 'app-chat',
  imports: [],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat {
   userMessage = '';
  assistantMessage = '';
  loading = false;

  constructor(private ai: Ai) {}

  send() {
    if (!this.userMessage.trim()) return;

    this.loading = true;
    this.assistantMessage = '';

    this.ai.sendMessage(this.userMessage).subscribe({
      next: (res) => {
        this.assistantMessage = res.assistantMessage;
        this.loading = false;
      },
      error: () => {
        this.assistantMessage = 'Error: Could not reach AI service.';
        this.loading = false;
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ai } from '../services/ai';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat implements OnInit {
  
  userMessage = '';
  messages: Message[] = [];
  loading = false;
  error = '';
  serviceStatus = 'checking';

  constructor(private ai: Ai) {}

  ngOnInit() {
    this.checkService();
  }

  checkService() {
    this.ai.checkHealth().subscribe({
      next: () => {
        this.serviceStatus = 'ready';
      },
      error: () => {
        this.serviceStatus = 'offline';
        this.error = 'AI service is not available. Please make sure the backend is running on http://localhost:8080';
      }
    });
  }

  send() {
    if (!this.userMessage.trim()) return;
    if (this.loading) return;
    if (this.serviceStatus !== 'ready') {
      this.error = 'Service not available. Please check if backend is running.';
      return;
    }

    // Add user message to chat history
    this.messages.push({
      role: 'user',
      content: this.userMessage,
      timestamp: new Date()
    });

    const userInput = this.userMessage;
    this.userMessage = '';
    this.loading = true;
    this.error = '';

    this.ai.sendMessage(userInput).subscribe({
      next: (res) => {
        this.messages.push({
          role: 'assistant',
          content: res.assistantMessage,
          timestamp: new Date()
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Error: Could not reach AI service. Please try again.';
        this.loading = false;
        // Remove the user message if there was an error
        if (this.messages.length > 0 && this.messages[this.messages.length - 1].role === 'user') {
          this.messages.pop();
        }
      }
    });
  }

  clearChat() {
    this.messages = [];
    this.error = '';
  }

  retry() {
    this.error = '';
    this.checkService();
  }
}

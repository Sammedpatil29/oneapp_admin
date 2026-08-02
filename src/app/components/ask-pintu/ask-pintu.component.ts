import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-ask-pintu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ask-pintu.component.html',
  styleUrl: './ask-pintu.component.css'
})
export class AskPintuComponent {
  query: string = '';
  loading: boolean = false;
  
  // Holds sanitized HTML response from the API
  apiResponseHtml: SafeHtml | null = '';

  constructor(private sanitizer: DomSanitizer, private commonService: CommonService) {}

  onAskPintu(): void {
    if (!this.query.trim()) return;

    this.loading = true;
    this.apiResponseHtml = null; // Clear previous response while loading
    let params = {
      "question": this.query
    }
    this.commonService.askPintu(params).subscribe({
      next: (response: any) => {
        // Sanitize the HTML response from the API before displaying it
        this.apiResponseHtml = this.sanitizer.bypassSecurityTrustHtml(response.text);
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error fetching Pintu response:', error);
        const errorMessage = `<div class="alert alert-danger">
                                <strong>Oops!</strong> Something went wrong while asking Pintu. \n Try asking different Question.
                              </div>`;
        this.apiResponseHtml = this.sanitizer.bypassSecurityTrustHtml(errorMessage);
        this.loading = false;
      }
    });

  }

  clearResponse(): void {
    this.apiResponseHtml = null;
    this.query = '';
  }
}
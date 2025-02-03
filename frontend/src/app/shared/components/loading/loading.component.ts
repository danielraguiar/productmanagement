import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  template: `
    <div class="loading-overlay" *ngIf="show">
      <mat-spinner diameter="50"></mat-spinner>
      <span class="loading-text">{{message}}</span>
    </div>
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    
    .loading-text {
      color: white;
      margin-top: 1rem;
      font-size: 1.2rem;
    }
  `]
})
export class LoadingComponent {
  @Input() show = false;
  @Input() message = 'Loading...';
} 
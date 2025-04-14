import { Component, Signal } from '@angular/core';
import { SignalRService } from '../../services/signalr.service';
import { EmdrService } from '../../services/emdr.service';
import { CommonModule } from '@angular/common';
import { DistractService } from '../../services/distract.service';

@Component({
  selector: 'app-emdr-screen',
  imports: [CommonModule],
  templateUrl: './emdr-screen.component.html',
  styleUrl: './emdr-screen.component.scss'
})
export class EmdrScreenComponent {
  ballPosition: number = 0;
  speed: number = 5;
  distractionText: string = "";
  distractionType: 'math' | 'bubbles' = 'math';
  enabledDistraction: Signal<boolean> | undefined; 
  isConnected: boolean = false;
  bubbles: any[] = [];

  constructor(
    private emdrService: EmdrService,
    private distractService: DistractService,
    private signalRService: SignalRService
  ) {}

  ngOnInit(): void {
    this.emdrService.onPositionUpdate((position: number) => {
      this.ballPosition = position;
    });
    this.enabledDistraction = this.distractService.enabledDistraction$;
    this.setupDistractions();
    this.setupConnectionMonitoring();
    this.generateBubbles();
  }

  private setupDistractions(): void {
    // Change distraction every 8-12 seconds
    setInterval(() => {
      if (!this.enabledDistraction!()) return;
      
      this.distractionType = Math.random() > 0.5 ? 'math' : 'bubbles';
      
      if (this.distractionType === 'math') {
        this.distractionText = this.distractService.generateQuestion();
      } else {
        this.distractionText = '';
        this.generateBubbles();
      }
    }, 8000 + Math.random() * 4000);
  }

  private generateBubbles(): void {
    this.bubbles = [];
    const bubbleCount = 15 + Math.floor(Math.random() * 10);
    
    for (let i = 0; i < bubbleCount; i++) {
      this.bubbles.push({
        size: 5 + Math.random() * 15,
        x: Math.random() * 100,
        y: Math.random() * 100,
        speed: 0.2 + Math.random() * 0.8,
        delay: Math.random() * 5
      });
    }
  }

  private setupConnectionMonitoring(): void {
    // Implement your actual connection monitoring logic here
    setInterval(() => {
      this.isConnected = Math.random() > 0.1; // Simulate connection
    }, 3000);
  }

  ngOnDestroy(): void {
    // Clean up any intervals or subscriptions
  }
}
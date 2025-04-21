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
  isConnected: boolean = false;

  constructor(
    public emdrService: EmdrService,
    public distractService: DistractService,
    private signalRService: SignalRService
  ) {
    this.emdrService.onPositionUpdate((position: number) => {
      this.ballPosition = position;
    });
    this.monitorConnection();
  }

  private monitorConnection(): void {
    setInterval(() => {
      // Implement actual connection monitoring logic
      this.isConnected = true;
    }, 3000);
  }

  ngOnDestroy(): void {
    this.signalRService.disconnect();
  }
}
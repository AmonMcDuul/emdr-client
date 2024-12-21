import { Component } from '@angular/core';
import { SignalRService } from '../../services/signalr.service';
import { EmdrService } from '../../services/emdr.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-emdr-screen',
  imports: [CommonModule],
  templateUrl: './emdr-screen.component.html',
  styleUrl: './emdr-screen.component.scss'
})
export class EmdrScreenComponent {
  ballPosition: number = 0;
  speed: number = 5;
  soundEnabled: boolean = false;

  constructor(private signalRService: SignalRService, private emdrService: EmdrService) {}

  ngOnInit(): void {
    this.emdrService.onPositionUpdate((position: number) => {
      this.ballPosition = position;
    });
  }
}
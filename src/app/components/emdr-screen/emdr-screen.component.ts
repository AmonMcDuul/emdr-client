import { Component } from '@angular/core';
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
  ballPositionTop: number = window.innerHeight / 2;
  speed: number = 5;
  distraction: string = "";
  enabledDistraction: any;

  constructor(private emdrService: EmdrService, private distractService: DistractService) {}

  ngOnInit(): void {
    this.emdrService.onPositionUpdate((position: number) => {
      this.ballPosition = position;
    });

    this.generateNewDistraction();
    setInterval(() => {
      this.generateNewDistraction();
    }, 10000);

    this.enabledDistraction = this.distractService.enabledDistraction$;
  }

  private generateNewDistraction(): void {
    this.distraction = this.distractService.generateQuestion();
  }
}
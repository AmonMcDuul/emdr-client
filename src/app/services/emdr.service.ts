import { Injectable } from '@angular/core';
import * as Tone from 'tone';

@Injectable({
  providedIn: 'root',
})
export class EmdrService {
  private ballPosition: number = 0; 
  private direction: number = 1; // 1 for right, -1 for left
  private containerWidth: number = window.innerWidth;
  private ballSize: number = 30; 
  private speed: number = 5; 
  private intervalId: any; 
  private soundEnabled: boolean = false;

  private positionUpdateCallback: (position: number) => void = () => {};
  private synth = new Tone.Synth({
    envelope: {
      attack: 0.001, 
      decay: 0.05,   
      sustain: 0.1,  
      release: 0.05, 
    },
  }).toDestination();

  constructor() {
    window.addEventListener('resize', this.updateContainerWidth.bind(this));
  }

  onPositionUpdate(callback: (position: number) => void): void {
    this.positionUpdateCallback = callback;
  }

  enableSound(enabled: boolean): void {
    this.soundEnabled = enabled;
  }

  start(): void {
    if (!this.intervalId) {
      this.intervalId = setInterval(() => this.moveBall(), 20);
    }
  }

  pause(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  stop(): void {
    this.pause();
    this.ballPosition = 0;
    this.direction = 1;
    this.positionUpdateCallback(this.ballPosition);
  }

  setSpeed(newSpeed: number): void {
    this.speed = newSpeed;
  }

  private moveBall(): void {
    this.ballPosition += this.direction * this.speed;

    // Check for collisions with container edges
    if (this.ballPosition >= this.containerWidth - this.ballSize) {
      this.playBounceSound();
      this.direction = -1; // Bounce left
    } else if (this.ballPosition <= 0) {
      this.playBounceSound();
      this.direction = 1; // Bounce right
    }

    this.positionUpdateCallback(this.ballPosition);
  }

  private playBounceSound(): void {
    if(this.soundEnabled){
      this.synth.triggerAttackRelease("C5", 0.05);
    }
  }

  private updateContainerWidth(): void {
    this.containerWidth = window.innerWidth;
  }
}
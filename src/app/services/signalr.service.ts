import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { Environment } from '../../environment/environment';
import { EmdrService } from './emdr.service';
import { EmdrState } from '../models/emdr-state.model';
import { DistractService } from './distract.service';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private hubConnection: HubConnection | null = null;
  private hubUrl = Environment.baseUrl + '/sessionHub';

  private connectionPromise: Promise<void> | null = null;

  speed: number = 5;

  constructor(private emdrService: EmdrService, private distractService: DistractService) {}

  connect(): void {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      return; 
    }

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl)
      .withAutomaticReconnect()
      .build();

    this.connectionPromise = this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR connected');
        this.connectionPromise = null; 
      })
      .catch((err) => {
        console.error('SignalR connection error:', err);
        this.connectionPromise = null; 
      });

    this.registerListeners();
  }

  private registerListeners(): void {
    if (!this.hubConnection) {
      return;
    }

    this.hubConnection.on('RecieveEmdrState', (state: EmdrState) => {
      switch(state){
        case 'start': {
          this.emdrService.start()
          break;
        }
        case 'pause': {
          this.emdrService.pause()
          break;
        }
        case 'stop': {
          this.emdrService.stop()
          break;
        }
        default: {
          break;
        }
      }
    });

    this.hubConnection.on('RecieveSpeed', (speed: number) => {
      this.emdrService.setSpeed(speed);
    });

    this.hubConnection.on('RecieveToggleSound', (enableSound: boolean) => {
      this.emdrService.enableSound(enableSound);
    });

    this.hubConnection.on('RecieveToggleDistraction', (enableDistraction: boolean, mode: 'math' | 'dots') => {
      this.distractService.enable(enableDistraction, mode);
    });
  }
  
  
  async joinSession(sessionId: string) {
    await this.ensureConnected();
    this.hubConnection?.invoke('JoinSession', sessionId).catch((err) => {
      console.error(`Error joining session ${sessionId}:`, err);
    });
  }

  async leaveSession(sessionId: string) {
    await this.ensureConnected();
    this.hubConnection
    ?.invoke('LeaveSession', sessionId)
    .then(() => this.disconnect())
    .catch((err) => {
      console.error(`Error leaving Session ${sessionId}:`, err);
    });
  }

  private async ensureConnected(): Promise<void> {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      return; 
    }

    if (this.connectionPromise) {
      await this.connectionPromise; 
    } else {
      throw new Error('SignalR connection is not established.');
    }
  }

  disconnect(): void {
    this.hubConnection?.stop().then(() => console.log('SignalR disconnected')).catch((err) => {
      console.error('SignalR disconnection error:', err);
    });
  }
}
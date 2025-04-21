import { Injectable, signal, computed } from '@angular/core';

interface MathOperation {
  symbol: string;
  fn: (a: number, b: number) => number;
  generate?: () => { a: number; b: number };
}

interface Dot {
  size: number;
  x: number;
  y: number;
  speed: number;
  delay: number;
}

@Injectable({
  providedIn: 'root',
})
export class DistractService {
  private enabled = signal(false);
  private mode = signal<'math' | 'dots'>('dots');
  private currentQuestion = signal('');
  private dots = signal<Dot[]>([]);
  
  public readonly isEnabled = this.enabled.asReadonly();
  public readonly currentMode = this.mode.asReadonly();
  public readonly question = this.currentQuestion.asReadonly();
  public readonly dotDistractions = this.dots.asReadonly();

  private operations: MathOperation[] = [
    { symbol: '+', fn: (a, b) => a + b },
    { symbol: '-', fn: (a, b) => a - b },
    { symbol: '×', fn: (a, b) => a * b },
    { 
      symbol: '÷', 
      fn: (a, b) => a / b,
      generate: () => {
        const b = this.getRandomNumber(1, 10);
        const result = this.getRandomNumber(1, 10);
        return { a: b * result, b };
      }
    }
  ];

  constructor() {
    this.generateDots();
    this.startDistractionCycle();
  }

  enable(enable: boolean, mode?: 'math' | 'dots'): void {
    this.enabled.set(enable);
    if (mode) this.mode.set(mode);
    if (enable) this.changeDistraction();
  }

  private startDistractionCycle(): void {
    setInterval(() => {
      if (!this.enabled()) return;
      if(this.mode() === 'math'){
        this.changeDistraction();
      }
    }, 8000);
  }

  private changeDistraction(): void {
    if (this.mode() === 'math') {
      this.currentQuestion.set(this.generateQuestion());
    } else {
      this.generateDots();
    }
  }

  private generateQuestion(): string {
    const op = this.operations[Math.floor(Math.random() * this.operations.length)];
    
    if (op.symbol === '÷' && op.generate) {
      const { a, b } = op.generate();
      return `${a} ${op.symbol} ${b}`;
    } else {
      const a = this.getRandomNumber(1, 20);
      const b = this.getRandomNumber(1, 20);
      return `${a} ${op.symbol} ${b}`;
    }
  }

  private generateDots(): void {
    const dotCount = 25 + Math.floor(Math.random() * 10);
    const newDots: Dot[] = [];
    
    for (let i = 0; i < dotCount; i++) {
      newDots.push({
        size: 5 + Math.random() * 25,
        x: Math.random() * 100,
        y: Math.random() * 100,
        speed: 0.2 + Math.random() * 0.8,
        delay: Math.random() * 2
      });
    }
    
    this.dots.set(newDots);
  }

  private getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
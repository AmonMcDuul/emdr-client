import { Injectable, signal } from '@angular/core';

interface MathOperation {
  symbol: string;
  fn: (a: number, b: number) => number;
  generate?: () => { a: number; b: number };
}

@Injectable({
  providedIn: 'root',
})
export class DistractService {
  private enabledDistraction = signal(false);
  public readonly enabledDistraction$ = this.enabledDistraction.asReadonly();

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

  generateQuestion(): string {
    const op = this.operations[Math.floor(Math.random() * this.operations.length)];
    
    // Handle division separately since it has the generate method
    if (op.symbol === '÷' && op.generate) {
      const { a, b } = op.generate();
      return `${a} ${op.symbol} ${b}`;
    } else {
      const a = this.getRandomNumber(1, 20);
      const b = this.getRandomNumber(1, 20);
      return `${a} ${op.symbol} ${b}`;
    }
  }

  private getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  enableDistraction(enable: boolean): void {
    this.enabledDistraction.set(enable);
  }
}
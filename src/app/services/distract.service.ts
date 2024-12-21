import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DistractService {

  private enabledDistraction = signal(false);

  public readonly enabledDistraction$ = this.enabledDistraction.asReadonly();

  private getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private getRandomOperator(): string {
    const operators = ['+', '-', '*', '/'];
    return operators[Math.floor(Math.random() * operators.length)];
  }

  generateQuestion(): string {
    const num1 = this.getRandomNumber(1, 100); 
    const num2 = this.getRandomNumber(1, 100); 
    const operator = this.getRandomOperator();

    if (operator === '/') {
      const dividend = this.getRandomNumber(10, 99);
      return `${dividend} / ${num2}`;
    }
    return `${num1} ${operator} ${num2}`;
  }

  enableDistraction(bool: boolean): void {
    this.enabledDistraction.set(bool);
    console.log(this.enabledDistraction$)
  }
}

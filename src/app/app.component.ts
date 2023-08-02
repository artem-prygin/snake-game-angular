import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  cells: number[] = Array.from({ length: 100 }, ((_, i) => i + 1));
  snake: number[] = [1, 2, 3, 4, 5];
  apple: number = 9;
  eatenApples: number[] = [];
  direction: 'right' | 'left' | 'up' | 'down' = 'right';
  gameInterval: ReturnType<typeof setInterval>;
  arrowPressed: boolean;
  score = 0;

  @HostListener('document:keydown', ['$event'])
  onArrowPress(event: KeyboardEvent): void {
    if (this.arrowPressed) {
      return;
    }
    this.arrowPressed = true;

    switch (event.key) {
      case 'ArrowDown': {
        if (this.direction === 'up') {
          return;
        }
        this.direction = 'down';
        break;
      }
      case 'ArrowUp': {
        if (this.direction === 'down') {
          return;
        }
        this.direction = 'up';
        break;
      }
      case 'ArrowRight': {
        if (this.direction === 'left') {
          return;
        }
        this.direction = 'right';
        break;
      }
      case 'ArrowLeft': {
        if (this.direction === 'right') {
          return;
        }
        this.direction = 'left';
        break;
      }
      default: {
        break;
      }
    }
  }

  ngOnInit(): void {
    this.gameInterval = setInterval(() => {
      const lastSnakeCell = this.snake[this.snake.length - 1];
      this.arrowPressed = false;

      switch (this.direction) {
        case 'right': {
          const nextSnakeCell = lastSnakeCell % 10 === 0
            ? lastSnakeCell - 9
            : lastSnakeCell + 1;
          this.regenerateSnake(nextSnakeCell);
          break;
        }
        case 'left': {
          const nextSnakeCell = (lastSnakeCell + 9) % 10 === 0
            ? lastSnakeCell + 9
            : lastSnakeCell - 1;
          this.regenerateSnake(nextSnakeCell);
          break;
        }
        case 'down': {
          const nextSnakeCell = lastSnakeCell > 90
            ? lastSnakeCell - 90
            : lastSnakeCell + 10;
          this.regenerateSnake(nextSnakeCell);
          break;
        }
        case 'up': {
          const nextSnakeCell = lastSnakeCell <= 10
            ? lastSnakeCell + 90
            : lastSnakeCell - 10;
          this.regenerateSnake(nextSnakeCell);
          break;
        }
        default: {
          break;
        }
      }
    }, 250);
  }

  regenerateSnake(nextSnakeCell: number): void {
    if (this.snake.includes(nextSnakeCell)) {
      return this.endGame();
    }

    this.snake = [...this.snake.slice(1), nextSnakeCell];

    this.eatenApples.forEach(eatenApple => {
      if (!this.snake.includes(eatenApple)) {
        this.snake = [eatenApple, ...this.snake];
        this.eatenApples = this.eatenApples.filter(e => e !== eatenApple);
      }
    });

    if (this.snake.includes(this.apple)) {
      this.score += 1;
      this.eatenApples = [...this.eatenApples, this.apple];
      this.generateApple();
    }
  }

  generateApple(): void {
    const emptyCells = this.cells.filter(cell => !this.snake.includes(cell));
    console.log(emptyCells);
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    this.apple = emptyCells[randomIndex];
  }

  endGame(): void {
    console.log('game over');
    clearInterval(this.gameInterval);
  }
}

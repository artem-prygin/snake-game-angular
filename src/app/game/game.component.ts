import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  @Input() width: number;
  @Input() interval: number;
  @Output() cancelGame = new EventEmitter<boolean>();

  cells: number[] = [];
  snake: number[] = [1, 2, 3, 4, 5];
  apple: number;
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

  get snakeHead(): number {
    return this.snake[this.snake.length - 1];
  }

  ngOnInit(): void {
    this.cells = Array.from({ length: this.width ** 2 }, ((_, i) => i + 1));
    this.generateApple();

    this.gameInterval = setInterval(() => {
      const lastSnakeCell = this.snake[this.snake.length - 1];
      this.arrowPressed = false;

      switch (this.direction) {
        case 'right': {
          const nextSnakeCell = lastSnakeCell % this.width === 0
            ? lastSnakeCell - (this.width - 1)
            : lastSnakeCell + 1;
          this.regenerateSnake(nextSnakeCell);
          break;
        }
        case 'left': {
          const nextSnakeCell = (lastSnakeCell + (this.width - 1)) % this.width === 0
            ? lastSnakeCell + (this.width - 1)
            : lastSnakeCell - 1;
          this.regenerateSnake(nextSnakeCell);
          break;
        }
        case 'down': {
          const nextSnakeCell = lastSnakeCell > (this.width * (this.width - 1))
            ? lastSnakeCell - (this.width * (this.width - 1))
            : lastSnakeCell + this.width;
          this.regenerateSnake(nextSnakeCell);
          break;
        }
        case 'up': {
          const nextSnakeCell = lastSnakeCell <= this.width
            ? lastSnakeCell + (this.width * (this.width - 1))
            : lastSnakeCell - this.width;
          this.regenerateSnake(nextSnakeCell);
          break;
        }
        default: {
          break;
        }
      }
    }, this.interval);
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
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    this.apple = emptyCells[randomIndex];
  }

  endGame(): void {
    console.log('game over');
    clearInterval(this.gameInterval);
  }

  emitCancelGame(): void {
    clearInterval(this.gameInterval);
    this.cancelGame.emit(true);
  }
}

import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { MoveDirectionEnum } from '../../models/enums/move-direction.enum';
import { KeyboardKeysEnum } from '../../models/enums/keyboard-keys.enum';
import { MatDialog } from '@angular/material/dialog';
import { PopupMessageComponent } from '../popup-message/popup-message.component';
import { lastValueFrom } from 'rxjs';
import { SnakeDefaults } from '../../models/constants/snake-defaults';

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
  snake: number[] = [...SnakeDefaults.startCells];
  apple: number;
  eatenApples: number[] = [];
  MoveDirection = MoveDirectionEnum;
  direction: MoveDirectionEnum = MoveDirectionEnum.Right;
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
      case KeyboardKeysEnum.S:
      case KeyboardKeysEnum.ArrowDown: {
        if (this.direction === MoveDirectionEnum.Up) {
          return;
        }
        this.direction = MoveDirectionEnum.Down;
        break;
      }
      case KeyboardKeysEnum.W:
      case KeyboardKeysEnum.ArrowUp: {
        if (this.direction === MoveDirectionEnum.Down) {
          return;
        }
        this.direction = MoveDirectionEnum.Up;
        break;
      }
      case KeyboardKeysEnum.D:
      case KeyboardKeysEnum.ArrowRight: {
        if (this.direction === MoveDirectionEnum.Left) {
          return;
        }
        this.direction = MoveDirectionEnum.Right;
        break;
      }
      case KeyboardKeysEnum.A:
      case KeyboardKeysEnum.ArrowLeft: {
        if (this.direction === MoveDirectionEnum.Right) {
          return;
        }
        this.direction = MoveDirectionEnum.Left;
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

  constructor(private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.cells = Array.from({ length: this.width ** 2 }, ((_, i) => i + 1));
    this.generateApple();
    this.startOrResumeGame();
  }

  startOrResumeGame(): void {
    this.gameInterval = setInterval(() => {
      const lastSnakeCell = this.snake[this.snake.length - 1];
      this.arrowPressed = false;

      switch (this.direction) {
        case MoveDirectionEnum.Right: {
          const nextSnakeCell = lastSnakeCell % this.width === 0
            ? lastSnakeCell - (this.width - 1)
            : lastSnakeCell + 1;
          this.regenerateSnake(nextSnakeCell);
          break;
        }
        case MoveDirectionEnum.Left: {
          const nextSnakeCell = (lastSnakeCell + (this.width - 1)) % this.width === 0
            ? lastSnakeCell + (this.width - 1)
            : lastSnakeCell - 1;
          this.regenerateSnake(nextSnakeCell);
          break;
        }
        case MoveDirectionEnum.Down: {
          const nextSnakeCell = lastSnakeCell > (this.width * (this.width - 1))
            ? lastSnakeCell - (this.width * (this.width - 1))
            : lastSnakeCell + this.width;
          this.regenerateSnake(nextSnakeCell);
          break;
        }
        case MoveDirectionEnum.Up: {
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
    this.apple = null;
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

  pauseGame(): void {
    clearInterval(this.gameInterval);
    this.gameInterval = null;
  }

  resumeGame(): void {
    this.startOrResumeGame();
  }

  restartGame(): void {
    this.snake = [...SnakeDefaults.startCells];
    this.generateApple();
    this.startOrResumeGame();
  }

  async openCancelGamePopup(): Promise<void> {
    this.pauseGame();
    const dialog = this.dialog.open(PopupMessageComponent, {
      panelClass: 'popup',
      data: {
        message: 'Are you sure you want to cancel current game?',
      },
    });
    const result = await lastValueFrom(dialog.afterClosed());
    if (result?.confirm) {
      return this.emitCancelGame();
    }

    this.resumeGame();
  }
}

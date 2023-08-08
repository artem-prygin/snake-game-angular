import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { MoveDirectionEnum } from '../../models/enums/move-direction.enum';
import { KeyboardKeysEnum } from '../../models/enums/keyboard-keys.enum';
import { MatDialog } from '@angular/material/dialog';
import { PopupMessageComponent } from '../popup-message/popup-message.component';
import { lastValueFrom } from 'rxjs';
import { SnakeDefaults } from '../../models/constants/snake-defaults';
import { GameSpeedEnum } from '../../models/enums/game-speed.enum';
import { PopupButtonInterface } from '../../models/interfaces/popup-button.interface';
import { ButtonTypeEnum } from '../../models/enums/button-type.enum';
import { ButtonActionTypeEnum } from '../../models/enums/button-action-type.enum';
import { PopupDataInterface } from '../../models/interfaces/popup-data.interface';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  @Input() width: number;
  @Input() speed: GameSpeedEnum;
  @Output() cancelGame = new EventEmitter<boolean>();

  cells: number[] = [];
  snake: number[] = [...SnakeDefaults.startCells];
  apple: number;
  eatenApples: number[] = [];
  direction: MoveDirectionEnum = MoveDirectionEnum.Right;
  gameInterval: ReturnType<typeof setInterval>;
  interval: number;
  arrowPressed: boolean;
  gameFinished: boolean;
  score = 0;

  MoveDirection = MoveDirectionEnum;

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

  get snakeTail(): number {
    return this.snake[0];
  }

  constructor(private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.cells = Array.from({ length: this.width ** 2 }, ((_, i) => i + 1));
    this.getInterval();
    this.generateApple();
    this.startOrResumeGame();
  }

  getInterval(): void {
    switch (this.speed) {
      case GameSpeedEnum.Slow:
        this.interval = 500;
        return;
      case GameSpeedEnum.Normal:
        this.interval = 300;
        return;
      case GameSpeedEnum.Fast:
        this.interval = 150;
        return;
      default:
        return;
    }
  }

  startOrResumeGame(): void {
    this.gameInterval = setInterval(() => {
      this.arrowPressed = false;

      switch (this.direction) {
        case MoveDirectionEnum.Right: {
          const nextSnakeCell = this.snakeHead % this.width === 0
            ? this.snakeHead - (this.width - 1)
            : this.snakeHead + 1;
          this.regenerateSnake(nextSnakeCell);
          break;
        }
        case MoveDirectionEnum.Left: {
          const nextSnakeCell = (this.snakeHead + (this.width - 1)) % this.width === 0
            ? this.snakeHead + (this.width - 1)
            : this.snakeHead - 1;
          this.regenerateSnake(nextSnakeCell);
          break;
        }
        case MoveDirectionEnum.Down: {
          const nextSnakeCell = this.snakeHead > (this.width * (this.width - 1))
            ? this.snakeHead - (this.width * (this.width - 1))
            : this.snakeHead + this.width;
          this.regenerateSnake(nextSnakeCell);
          break;
        }
        case MoveDirectionEnum.Up: {
          const nextSnakeCell = this.snakeHead <= this.width
            ? this.snakeHead + (this.width * (this.width - 1))
            : this.snakeHead - this.width;
          this.regenerateSnake(nextSnakeCell);
          break;
        }
        default: {
          break;
        }
      }
    }, this.interval);
  }

  async regenerateSnake(nextSnakeCell: number): Promise<void> {
    if ((this.snake.includes(nextSnakeCell) && this.snakeTail !== nextSnakeCell)
      || (this.snakeTail === nextSnakeCell && this.eatenApples.length > 0)) {
      return this.openEndGamePopup();
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
    this.gameFinished = false;
    this.snake = [...SnakeDefaults.startCells];
    this.direction = MoveDirectionEnum.Right;
    this.eatenApples = [];
    this.score = 0;
    this.generateApple();
    this.startOrResumeGame();
  }

  async openEndGamePopup(): Promise<void> {
    clearInterval(this.gameInterval);
    this.gameFinished = true;

    const popupData: { message: string, buttons: PopupButtonInterface[] } = {
      message: `Game over! Your score is ${this.score}`,
      buttons: [
        {
          buttonType: ButtonTypeEnum.Secondary,
          actionType: ButtonActionTypeEnum.ClosePopup,
          text: 'Close popup',
        },
        {
          buttonType: ButtonTypeEnum.Secondary,
          actionType: ButtonActionTypeEnum.Restart,
          text: 'Restart game',
        },
        {
          buttonType: ButtonTypeEnum.Primary,
          actionType: ButtonActionTypeEnum.ToMainMenu,
          text: 'Go to main menu',
        },
      ],
    };

    await this.openPopup(popupData);
  }

  async openCancelGamePopup(): Promise<void> {
    if (this.gameFinished) {
      return this.emitCancelGame();
    }

    this.pauseGame();
    const popupData: { message: string, buttons: PopupButtonInterface[] } = {
      message: 'Are you sure you want to cancel current game?',
      buttons: [
        {
          buttonType: ButtonTypeEnum.Secondary,
          actionType: ButtonActionTypeEnum.ResumeGame,
          text: 'No, resume game',
        },
        {
          buttonType: ButtonTypeEnum.Primary,
          actionType: ButtonActionTypeEnum.ToMainMenu,
          text: 'Yes, cancel game',
        },
      ],
    };
    await this.openPopup(popupData);
  }

  async openPopup(popupData: PopupDataInterface): Promise<void> {
    const dialog = this.dialog.open(PopupMessageComponent, {
      panelClass: 'popup',
      data: popupData,
      disableClose: true,
    });
    const result: { action: ButtonActionTypeEnum } = await lastValueFrom(dialog.afterClosed());

    switch (result?.action) {
      case ButtonActionTypeEnum.Restart:
        return this.restartGame();
      case ButtonActionTypeEnum.ToMainMenu:
        return this.emitCancelGame();
      case ButtonActionTypeEnum.ClosePopup:
        return;
      case ButtonActionTypeEnum.ResumeGame:
      default:
        return this.resumeGame();
    }
  }
}

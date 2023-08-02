import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  width: number = 10;
  interval: number = 250;
  gameStarted: boolean;

  startGame(): void {
    this.gameStarted = true;
  }

  cancelGame(): void {
    this.gameStarted = false;
  }
}

import { Component, OnInit } from '@angular/core';
import { GameSpeedEnum } from '../models/enums/game-speed.enum';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  gameStarted: boolean;
  GameSpeedEnum = GameSpeedEnum;
  form: UntypedFormGroup;

  constructor(private fb: UntypedFormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      speed: [GameSpeedEnum.Normal, Validators.required],
      width: [10, [Validators.required, Validators.min(5), Validators.max(15)]],
    });
  }

  startGame(): void {
    this.gameStarted = true;
  }

  cancelGame(): void {
    this.gameStarted = false;
  }
}

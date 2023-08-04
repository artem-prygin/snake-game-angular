import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';
import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PopupMessageComponent } from './popup-message/popup-message.component';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    PopupMessageComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}

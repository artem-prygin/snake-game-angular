import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PopupButtonInterface } from '../../models/interfaces/popup-button.interface';
import { ButtonTypeEnum } from '../../models/enums/button-type.enum';
import { ButtonActionTypeEnum } from '../../models/enums/button-action-type.enum';

@Component({
  selector: 'app-popup-message',
  templateUrl: './popup-message.component.html',
  styleUrls: ['./popup-message.component.scss'],
})
export class PopupMessageComponent {
  ButtonTypeEnum = ButtonTypeEnum;

  constructor(
    private dialogRef: MatDialogRef<PopupMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      message: string,
      buttons: PopupButtonInterface[],
    },
  ) {
  }

  close(btnActionType: ButtonActionTypeEnum): void {
    this.dialogRef.close({
      action: btnActionType,
    });
  }
}

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-popup-message',
  templateUrl: './popup-message.component.html',
  styleUrls: ['./popup-message.component.scss'],
})
export class PopupMessageComponent {
  constructor(
    private dialogRef: MatDialogRef<PopupMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      message: string,
    },
  ) {
  }

  close(confirm?: boolean): void {
    this.dialogRef.close({
      confirm,
    });
  }
}

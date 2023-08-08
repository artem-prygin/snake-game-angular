import { ButtonTypeEnum } from '../enums/button-type.enum';
import { ButtonActionTypeEnum } from '../enums/button-action-type.enum';

export interface PopupButtonInterface {
  text: string;
  buttonType: ButtonTypeEnum;
  actionType: ButtonActionTypeEnum;
}

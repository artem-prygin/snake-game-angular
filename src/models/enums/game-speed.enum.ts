export enum GameSpeedEnum {
  Slow,
  Normal,
  Fast,
}

export namespace GameSpeedEnum {
  export function getSpeedName(gameSpeed: GameSpeedEnum): string {
    switch (gameSpeed) {
      case GameSpeedEnum.Slow:
        return 'Slow';
      case GameSpeedEnum.Normal:
        return 'Normal';
      case GameSpeedEnum.Fast:
        return 'Fast';
      default:
        return null;
    }
  }
}

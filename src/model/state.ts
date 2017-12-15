import { Target } from './target'
import { Either } from 'monet'

export enum InactiveType {
  ASK_JOB,
  SPAWN,
  NONE,
  DONE,
  ERROR,
};

export enum ActionType {
  MOVE,
  HARVEST,
  TRANSFERT,
  BUILD,
  REPAIR,
  UPGRADE,
  PICKUP,
  WITHDRAW
};

export class Action {
  type: ActionType;
  target: Target;
  constructor(type: ActionType, target: Target) {
    this.type = type;
    this.target = target;
  }
  static fromArgsArray(argsArray: string[]): Action {
    return new Action((<any>ActionType)[argsArray[0]], new Target(argsArray[1]));
  }
  toArray(): string[] {
    return [ActionType[this.type], this.target.id]
  }
  static asRight(type: ActionType, target: Target): Either<Inactive, Action> {
    return Either.Right(new Action(type, target));
  }
}

export class Inactive {
  type: InactiveType;
  constructor(type: InactiveType = InactiveType.NONE) {
    this.type = type;
  }
  static asLeft(type?: InactiveType): Either<Inactive, Action> {
    return Either.Left(new Inactive(type));
  }
}

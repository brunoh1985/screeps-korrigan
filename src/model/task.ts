import { Target } from './target';
import { isNeedDepotTarget } from '../services/decision/task'

export enum Role {
  HARVESTER,
  HAULER,
  BUILDER,
  DEFENSER,
  DEFENSER_REPAIRER,
  ROAD_MAINTAINER,
  UPGRADER,
  WALL_MAINTAINER
}

export enum TaskType {
  HARVEST_STATIC,
  HAUL,
  BUILD,
  REPAIR,
  UPGRADE
};

export class Task {
  type: TaskType;
  target: Target;
  target2?: Target;
  constructor(type: TaskType, target: Target, target2?: Target) {
    this.type = type;
    this.target = target;
    if (target2 == null && isNeedDepotTarget(this.type)) {
      throw new Error("Can not create Task of type " + TaskType[type] +
        ", target 2 is missing");
    } else this.target2 = target2;
  }
  static fromArgsArray(argsArray: string[]): Task {
    return new Task((<any>TaskType)[argsArray[0]], new Target(argsArray[1]),
      argsArray[2] ? new Target(argsArray[2]) : undefined);
  }
  toArray(): string[] {
    let array = [TaskType[this.type], this.target.id]
    if (this.target2) array.push(this.target2.id)
    return array;
  }
}

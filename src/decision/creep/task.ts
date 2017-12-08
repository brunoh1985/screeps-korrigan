import { findSalvageableDroppedResources } from '../../information/resource';
import { getSourceWithdrawalPoints } from '../../information/structure';
import { Either, Maybe } from 'monet';

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
  BUILD,
  REPAIR,
  UPGRADE,
  PICKUP,
  WITHDRAW
};

export class InactiveTask {
  type: InactiveType;
  constructor(type: InactiveType) {
    this.type = type;
  }
}
export class ActiveTask {
  type: ActionType;
  target: Target;
  state: Action | Inactive;
  constructor(type: ActionType, target: Target, state: Action | Inactive) {
    this.type = type;
    this.target = target;
    this.state = state;
  }
}
const unemployed = new InactiveTask(InactiveType.ASK_JOB);
export const noneTask = new InactiveTask(InactiveType.NONE);

export class Action {
  type: ActionType;
  target: Target;
  constructor(type: ActionType, target: Target) {
    this.type = type;
    this.target = target;
  }
}

export class Inactive {
  type: InactiveType;
  constructor(type: InactiveType) {
    this.type = type;
  }
}

export class Target {
  room?: string
  id?: string
  constructor(id?: string, room?: string) {
    this.id = id;
    this.room = room;
  }
}

const nextTaskStateFor = (creep: CreepProps) => (task: ActiveTask): Either<Inactive, Action> => {
  switch (task.type) {
    case ActionType.HARVEST:
      return MaybeFromNull<Source>(Game.getObjectById<Source>(task.target.id))
        .filter(target => target.energy >= (creep.carryCapacity * 0.2))
        .map(target => new Action(
          creep.pos.isNearTo(target) ? ActionType.HARVEST : ActionType.MOVE,
          task.target
        )).toEither(
        //Harvest task is considered done if the source is not found or have almost any more energy
        new Inactive(InactiveType.DONE)
        );
    case ActionType.BUILD:
    case ActionType.REPAIR:
    case ActionType.UPGRADE:
      //if doesn't carry full energy and not currently upgrading
      if (_.sum(creep.carry) < creep.carryCapacity && task.state && task.state.type !== ActionType.UPGRADE) {
        //find a source of energy, move to it and take it
        return findNTakeResource(creep);
      } else {
        //else move to the controller and upgrade it
        MaybeFromNull(task.target).flatMap(target => MaybeFromNull(target.id))
          .flatMap<Controller>(id => MaybeFromNull(Game.getObjectById<Controller>(id) || creep.room.controller))
          .map(target => new Action(
            creep.pos.isNearTo(target) ? ActionType.UPGRADE : ActionType.MOVE,
            new Target(target.id, target.room.name)
          )).toEither(
          new Inactive(InactiveType.ERROR)
          );
      }
    default: return Either.Left(new Inactive(InactiveType.NONE));
  }
}

const updateActiveTaskAtFor = ((task: ActiveTask) => (action: Action) => { task.state = action; return task; });

export const update = (task: ActiveTask) => ({
  with: (creep: CreepProps): Either<InactiveTask, ActiveTask> => {
    const fromNextStateOf = nextTaskStateFor(creep),
      updateTaskAt = updateActiveTaskAtFor(task);
    return fromNextStateOf(task).bimap(() => unemployed, state => updateTaskAt(state));
  }
});

const findNTakeResource = (creep: CreepProps): Either<Inactive, Action> => {
  //find a source of energy, move to it and take it
  const source = (findSalvageableDroppedResources(creep) || getSourceWithdrawalPoints(creep.room))[0];
  return source && source.room ? Either.Right({
    type: creep.pos.isNearTo(source) ? actionFor(source) : ActionType.MOVE,
    target: { id: source.id, room: source.room.name }
  }) : Either.Left({ type: InactiveType.NONE });
}

const actionFor = (source: Resource | Structure): ActionType => {
  return source instanceof Resource ? ActionType.PICKUP : ActionType.WITHDRAW;
}

const MaybeSource = (target: Target): Maybe<Source> => {
  const source = Game.getObjectById<Source>(target.id);
  return source ? Maybe.Some(source) : Maybe.None();
}

//waiting for mmonet#0.9 on npm https://github.com/monet/monet.js/issues/83
function MaybeFromNull<T>(val: T | null | undefined): Maybe<T> {
  return val == null ? Maybe.None() : Maybe.Some(val)
}

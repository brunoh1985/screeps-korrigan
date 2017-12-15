import { Inactive, Action, ActionType, InactiveType } from '../../../model/state';
import { Task, TaskType } from '../../../model/task';
import { Target } from '../../../model/target';
import { Either, Maybe, MaybeFromNull } from '../../../utils/monet';

export const nextStateFor = (creep: CreepProps) => (task: Task, state: Either<Inactive, Action> = Either.Left(new Inactive())): Either<Inactive, Action> => {
  if (task.target == undefined) throw new Error("task target is undefined");
  switch (task.type) {
    case TaskType.HARVEST_STATIC:
      return MaybeFromNull<Source>(Game.getObjectById<Source>(task.target.id))
        .filter(target => target.energy >= (creep.carryCapacity * 0.2))
        .map(target => new Action(
          creep.pos.isNearTo(target) ? ActionType.HARVEST : ActionType.MOVE,
          task.target
        )
        ).toEither(
        //Harvest task is considered done if the source is not found or have almost any more energy
        new Inactive(InactiveType.DONE)
        );
    case TaskType.HAUL:
      return MaybeFromNull<Resource>(Game.getObjectById<Resource>(task.target.id))
        .filter(target => target.amount >= (creep.carryCapacity * 0.2))
        .map(target => {
          if (creep.carry.energy == creep.carryCapacity ||
            creep.carry.energy > 0 && isTransfering(state)) {
            //let transfertTarget = findStructuresToFill(creep)[0];
            if (task.target2 == undefined) throw new Error("task target2 is undefined");
            return new Action(
              creep.pos.isNearTo(task.target2) ? ActionType.TRANSFERT : ActionType.MOVE,
              task.target2
            )
          } else {
            return new Action(
              creep.pos.isNearTo(target) ? ActionType.PICKUP : ActionType.MOVE,
              task.target
            )
          }
        }).toEither(
        //Carry task is considered done if the source is not found or have almost any more energy
        new Inactive(InactiveType.DONE)
        );
    case TaskType.BUILD:
    case TaskType.REPAIR:
    case TaskType.UPGRADE:
      if (creep.carry.energy < creep.carryCapacity && !isUpgrading(state) ||
        creep.carry.energy == 0 /*&& isUpgrading(state)*/) {
        //find a source of energy, move to it and take it
        if (task.target2 == undefined) throw new Error("task target2 is undefined");
        return Maybe.Some(new Action(
          creep.pos.isNearTo(task.target2) ? actionFor(task.target2) : ActionType.MOVE,
          task.target2
        )).toEither(
          new Inactive(InactiveType.ERROR)
          );
      } else {
        //else move to the controller and upgrade it
        return Maybe.Some(new Action(
          creep.pos.isNearTo(task.target) ? ActionType.UPGRADE : ActionType.MOVE,
          task.target
        )).toEither(
          new Inactive(InactiveType.ERROR)
          );
      }

    default: return Either.Left(new Inactive(InactiveType.NONE));
  }
}

const isUpgrading = (state: Either<Inactive, Action>) => state.isRight() && state.right().type === ActionType.UPGRADE
const isTransfering = (state: Either<Inactive, Action>) => state.isRight() && state.right().type === ActionType.TRANSFERT

const actionFor = (target: Target): ActionType =>
  MaybeFromNull(Game.getObjectById(target.id)).filter(object => "hits" in object)
    .map(() => ActionType.WITHDRAW).orSome(ActionType.PICKUP);

const MaybeSource = (target: Target): Maybe<Source> => {
  const source = Game.getObjectById<Source>(target.id);
  return source ? Maybe.Some(source) : Maybe.None();
}

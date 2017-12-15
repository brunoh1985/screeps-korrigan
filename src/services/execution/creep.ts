import { Maybe, Either } from 'monet';
const { Some, None } = Maybe;
import { Inactive, Action, ActionType, InactiveType } from '../../model/state';
import { Task, TaskType } from '../../model/task';
import { Target } from '../../model/target';

export const order = (creep: Creep) => ({
  to: (action: Action): Either<Inactive, Action> => {
    let returnedValue: Maybe<number>;
    switch (action.type) {
      case ActionType.MOVE:
        returnedValue = Maybe.Some(creep.moveTo(action.target.pos, { visualizePathStyle: { stroke: '#ffffff' } }));
        break;
      case ActionType.HARVEST:
        returnedValue = getOptionalObjectById<Source>(action).map(source => creep.harvest(source));
        creep.say('harvest ' + stringStatus(returnedValue));
        break;
      case ActionType.TRANSFERT:
        returnedValue = getOptionalObjectById<Structure>(action).map(structure => creep.transfer(structure, RESOURCE_ENERGY));
        creep.say('transfert ' + stringStatus(returnedValue));
        break;
      case ActionType.BUILD:
        returnedValue = getOptionalObjectById<ConstructionSite>(action)
          .map(constructionSite => creep.build(constructionSite));
        creep.say('build ' + stringStatus(returnedValue));
        break;
      case ActionType.REPAIR:
        returnedValue = getOptionalObjectById<Structure>(action).map(structure => creep.repair(structure));
        creep.say('repair ' + stringStatus(returnedValue));
        break;
      case ActionType.UPGRADE:
        returnedValue = getOptionalObjectById<StructureController>(action)
          .map(structure => creep.upgradeController(structure));
        creep.say('upgrade ' + stringStatus(returnedValue));
        break;
      case ActionType.PICKUP:
        returnedValue = getOptionalObjectById<Resource>(action).map(resource => creep.pickup(resource));
        creep.say('pickup ' + stringStatus(returnedValue));
        break;
      case ActionType.WITHDRAW:
        returnedValue = getOptionalObjectById<Structure>(action).map(structure => creep.withdraw(structure, RESOURCE_ENERGY));
        creep.say('withdraw ' + stringStatus(returnedValue));
        break;
      default: returnedValue = None();
    }
    return returnedValue.filter(value => value == OK).toEither(returnedValue)
      .cata(returnedValue => {
        /*warn*/console.log("Creep " + creep.name + " couldn't execute order " + (<any>ActionType)[action.type] +
          ". Status:" + returnedValue.some() + "");
        return Either.Left(new Inactive(InactiveType.ERROR));
      },
      returnedValue => Either.Right(action));
  }
});

const stringStatus = (maybe: Maybe<number>): string => maybe.some() == 0 ? "" : maybe.some().toString();

const targetIdOptionFor = (targetContainer: Action | Task) => MaybeFromNull(targetContainer.target).flatMap(target => MaybeFromNull(target.id));
function getOptionalObjectById<T>(targetContainer: Action | Task): Maybe<T> {
  return targetIdOptionFor(targetContainer).flatMap(id => MaybeFromNull(Game.getObjectById<T>(id)));
}

//waiting for mmonet#0.9 on npm https://github.com/monet/monet.js/issues/83
function MaybeFromNull<T>(val: T | null | undefined): Maybe<T> {
  return val == null ? Maybe.None() : Maybe.Some(val)
}

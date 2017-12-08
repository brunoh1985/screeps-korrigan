import { Maybe, Either } from 'monet';
const { Some, None } = Maybe;
import { ActiveTask, Action, Inactive, ActionType, InactiveType } from "../decision/creep/task";
export const APIAction = {
  MOVE: { function: "moveTo", paramType: "RoomPosition" },
  HARVEST: { function: "harvest", paramType: "Source" },
  BUILD: { function: "build", paramType: "ConstructionSite" },
  REPAIR: { function: "repair", paramType: "Structure" },
  UPGRADE: { function: "upgradeController", paramType: "StructureController" },
  PICKUP: { function: "pickup", paramType: "	Resource" },
  WITHDRAW: { function: "withdraw", paramType: "RoomPosition" },
}

export const order = (creep: Creep) => ({
  to: (action: Action): Inactive | Action => {
    let returnedValue: Maybe<number>;
    switch (action.type) {
      case ActionType.MOVE:
        returnedValue = getOptionalObjectById<RoomPosition>(action).map(roomPosition => creep.moveTo(roomPosition));
        break;
      case ActionType.HARVEST:
        returnedValue = getOptionalObjectById<Source>(action).map(source => creep.harvest(source));
        break;
      case ActionType.BUILD:
        returnedValue = getOptionalObjectById<ConstructionSite>(action).map(constructionSite => creep.build(constructionSite));
        break;
      case ActionType.REPAIR:
        returnedValue = getOptionalObjectById<Structure>(action).map(structure => creep.repair(structure));
        break;
      case ActionType.UPGRADE:
        returnedValue = getOptionalObjectById<StructureController>(action).map(structure => creep.upgradeController(structure));
        break;
      case ActionType.PICKUP:
        returnedValue = getOptionalObjectById<Resource>(action).map(resource => creep.pickup(resource));
        break;
      case ActionType.WITHDRAW:
        returnedValue = getOptionalObjectById<Structure>(action).map(structure => creep.withdraw(structure, RESOURCE_ENERGY));
        break;
      default: returnedValue = None();
    }
    return returnedValue.filter(value => value == OK).flatMap(() => Maybe.Some<Inactive | Action>(action)).orSome(new Inactive(InactiveType.ERROR));
  }
});

const targetIdOptionFor = (targetContainer: Action | ActiveTask) => MaybeFromNull(targetContainer.target).flatMap(target => MaybeFromNull(target.id));
function getOptionalObjectById<T>(targetContainer: Action | ActiveTask): Maybe<T> {
  return targetIdOptionFor(targetContainer).flatMap(id => MaybeFromNull(Game.getObjectById<T>(id)));
}

//waiting for mmonet#0.9 on npm https://github.com/monet/monet.js/issues/83
function MaybeFromNull<T>(val: T | null | undefined): Maybe<T> {
  return val == null ? Maybe.None() : Maybe.Some(val)
}

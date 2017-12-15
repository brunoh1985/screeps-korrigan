import { Task, Role, TaskType } from '../../model/task';
import { Target } from '../../model/target';
import { Either, Maybe } from 'monet';

export class CannotBuildTaskError extends Error {}

export class TaskBuilder {
  private _creep: CreepProps;
  private _role: Role;
  private _type: TaskType;
  private _target1: Target;
  private _target2: Target;
  constructor(creep: CreepProps) {
    this._creep = creep;
  }
  role = (role: Role) => {
    this._role = role;
    return this;
  }
  typerole = (type: TaskType) => {
    this._type = type;
    return this;
  }
  target1 = (target1: string | Target) => {
    this._target1 = typeof target1 == "string" ? new Target(target1) : target1;
    return this;
  }
  target2 = (target2: string | Target) => {
    this._target2 = typeof target2 == "string" ? new Target(target2) : target2;
    return this;
  }
  build = (): Either<CannotBuildTaskError, Task> => {
    if (this._type == undefined) this._type = taskTypeFor(this._role);
    if (this._target1 == undefined) {
      let eitherTarget1 = findATargetFor(this._creep, this._type);
      if(eitherTarget1.isRight())this._target1 = eitherTarget1.right();
      else return Either.Left(eitherTarget1.left());
    }
    if (this._target2 == undefined && isNeedDepotTarget(this._type)) {
      let eitherDepot = findDepotFor(this._creep, this._type);
      if(eitherDepot.isRight()) this._target2 = eitherDepot.right();
      else return Either.Left(eitherDepot.left());
    }

    return Either.Right(new Task(this._type, this._target1, this._target2))
  }
}

export const isNeedDepotTarget = (taskType: TaskType) => taskType != TaskType.HARVEST_STATIC

const taskTypeFor = (role: Role) => {
  switch (role) {
    case Role.HAULER: return TaskType.HAUL;
    case Role.BUILDER: return TaskType.BUILD;
    case Role.UPGRADER: return TaskType.UPGRADE;
    default: return TaskType.HARVEST_STATIC; //case Role.HARVESTER: return TaskType.HARVEST;
  }
}
const findATargetFor = (creep: CreepProps, type: TaskType): Either<CannotBuildTaskError, Target> => {
  switch (type) {
    case TaskType.HAUL:
      //FIND_DROPPED_ENERGY
      let droppedSource = creep.pos.findClosestByRange<Resource>(FIND_DROPPED_RESOURCES)
      if (droppedSource == undefined) {
        return Either.Left(new CannotBuildTaskError("dropped Resource not found"));
      }
      return Either.Right(new Target(droppedSource.id, droppedSource.pos));
    case TaskType.BUILD:
      let constructionSite = creep.pos.findClosestByRange<ConstructionSite>(FIND_CONSTRUCTION_SITES)
      if (constructionSite == undefined) {
        return Either.Left(new CannotBuildTaskError("Construction site not found"));
      }
      return Either.Right(new Target(constructionSite.id, constructionSite.pos));
    case TaskType.UPGRADE:
      let controller = creep.room.controller;
      if (controller == undefined) {
        return Either.Left(new CannotBuildTaskError("controller not found"));
      }
      return Either.Right(new Target(controller.id, controller.pos));
    case TaskType.HARVEST_STATIC:
      let activeSource = creep.pos.findClosestByRange<Source>(FIND_SOURCES_ACTIVE)
      if (activeSource == undefined) {
        return Either.Left(new CannotBuildTaskError("Active source not found"));
      }
      return Either.Right(new Target(activeSource.id, activeSource.pos));
      default: return Either.Left(new CannotBuildTaskError("this task type "+TaskType[type]+" is not handled"));
  }
}

const findDepotFor = (creep: CreepProps, type: TaskType): Either<CannotBuildTaskError, Target> => {
  switch (type) {
    case TaskType.HAUL:
      return findEnergyDepotToFill(creep);
    default:
      return findEnergyDepotToWithdraw(creep);
  }
}

const energyDepotToFillFilter = (creep: CreepProps) => (structure: any) => isEnergyDepot(structure) &&
  structure.energy + creep.carry.energy < structure.energyCapacity;
const findEnergyDepotToFill = (creep: CreepProps): Either<CannotBuildTaskError, Target> => {
  let energyDepot = creep.pos.findClosestByRange<Source>(FIND_MY_STRUCTURES, { filter: energyDepotToFillFilter(creep) })
  if (energyDepot == undefined) {
    return Either.Left(new CannotBuildTaskError("Didn't found a depot of energy to fill"));
  }
  const target = new Target(energyDepot.id, energyDepot.pos);
  return Either.Right(target);
}

const energyDepotToWithdrawFilter = (creep: CreepProps) => (structure: any) => isEnergyDepot(structure) &&
  structure.energy >= creep.carryCapacity;
const findEnergyDepotToWithdraw = (creep: CreepProps): Either<CannotBuildTaskError, Target> => {
  let energyDepot = creep.pos.findClosestByRange<Source>(FIND_MY_STRUCTURES, { filter: energyDepotToWithdrawFilter(creep) })
  if (energyDepot == undefined) {
    return Either.Left(new CannotBuildTaskError("Didn't found a depot of energy to withdraw"));
  }
  return Either.Right(new Target(energyDepot.id, energyDepot.pos));
}

const isEnergyDepot = (structure: any) => structure.structureType == STRUCTURE_EXTENSION ||
  structure.structureType == STRUCTURE_SPAWN

import {
  InactiveTask, ActiveTask,
  Inactive, Action,
  ActionType, InactiveType,
  Target,
  noneTask
} from "../decision/creep/task";
import { Role } from '../decision/jobs'
import { Either } from 'monet';

/*
// ----    enum exemples   -----
//https://stackoverflow.com/questions/17380845/how-to-convert-string-to-enum-in-typescript

enum Color {
  Red, Green
}
var green: string = Color[Color.Green];
var color : Color = Color[green];
var green= "Green";
var color: Color = (<any>Color)[green];
*/

//http://docs.screeps.com/global-objects.html#Serialization
/*
Memory = JSON.parse(RawMemory.get()); //on the first access to Memory object
// ...your script
RawMemory.set(JSON.stringify(Memory));
*/

export class TCreepMemory {
  room: string;
  role: Role;
  task: InactiveTask | ActiveTask;
  constructor(room: string, role: Role, task: InactiveTask | ActiveTask){
    this.room = room;
    this.role = role;
    this.task = task;
  }

  static fromAPI(creepMemory: CreepMemory): TCreepMemory {
    return new TCreepMemory(creepMemory.room, (<any>Role)[creepMemory.role], MemoryTask.fromAPI(creepMemory));
  }
  static toAPI(tCreepMemory: TCreepMemory): CreepMemory {
    return _.merge({
      room: tCreepMemory.room,
      role: Role[tCreepMemory.role]
    }, MemoryTask.toAPI(tCreepMemory.task))
  }
}

const MemoryTask = {
  fromAPI: (creepMemory: CreepMemory): InactiveTask | ActiveTask => creepMemory.taskType in ActionType ?
    new ActiveTask(unsafeActionType(creepMemory.taskType), MemoryTaskTarget.fromAPI(creepMemory),MemoryTaskState.fromAPI(creepMemory)) :
    new InactiveTask(unsafeInactiveType(creepMemory.taskType)),
  toAPI: (task: InactiveTask | ActiveTask) => {
    const inactiveTask: { taskType: string } = { taskType: enumTypetoString(task.type) };
    return task instanceof ActiveTask ?
      _.merge(inactiveTask, MemoryTaskState.toAPI(task)) : inactiveTask;
  }
}

const MemoryTaskState = {
  fromAPI: (creepMemory: CreepMemory): Inactive | Action => creepMemory.taskStateType && creepMemory.taskStateType in ActionType ?
    new Action(unsafeActionType(creepMemory.taskStateType), MemoryActionTarget.fromAPI(creepMemory)) : new Inactive((<any>InactiveType)[creepMemory.taskStateType || "NONE"]),
  toAPI: (taskStateMemory: Inactive | Action) => {
    const inactive: { taskStateType: string } = { taskStateType: enumTypetoString(taskStateMemory.type) }
    return taskStateMemory instanceof Action ?
      _.merge(inactive, MemoryTaskTarget.toAPI(taskStateMemory.target)) : inactive
  }
}

const actionType = (name: keyof typeof ActionType) => (<any>ActionType)[name];
const inactiveType = (name: keyof typeof InactiveType) => (<any>InactiveType)[name];
const unsafeActionType = (name: string) => (<any>ActionType)[name];
const unsafeInactiveType = (name: string) => (<any>InactiveType)[name];

const MemoryTaskTarget = {
  fromAPI: (creepMemory: CreepMemory): Target => new Target(creepMemory.taskTargetId, creepMemory.taskTargetRoom),
  toAPI: (taskTarget: Target): { taskTargetId: string | undefined, taskTargetRoom: string | undefined } =>
    ({ taskTargetId: taskTarget.id, taskTargetRoom: taskTarget.room })
}

const MemoryActionTarget = {
  fromAPI: (creepMemory: CreepMemory): Target => new Target(creepMemory.taskStateTargetId, creepMemory.taskStateTargetRoom),
  toAPI: (taskTarget: Target): { taskStateTargetId: string | undefined, taskStateTargetRoom: string | undefined } => ({ taskStateTargetId: taskTarget.id, taskStateTargetRoom: taskTarget.room })
}

export const forCreep = (creep: Creep) => ({
  get: function <K extends keyof TCreepMemory>(name: K): TCreepMemory[K] {
    return TCreepMemory.fromAPI(creep.memory)[name];
  },
  getEitherTask: function <K extends keyof TCreepMemory>(name: K): Either<InactiveTask, ActiveTask> {
    const creepMem = this.get('task'); //deserialization
    return creepMem instanceof ActiveTask ? Either.Right(creepMem) :
      Either.Left(creepMem instanceof InactiveTask ? creepMem : noneTask);
  },
  set: function <K extends keyof TCreepMemory>(name: K, value: any): TCreepMemory[K] {
    switch(name) {
      case 'room': creep.memory['room'] = value; break;
      case 'role': creep.memory['role'] = Role[value] ; break;
      case 'task': _.merge(creep.memory, MemoryTask.toAPI(value)); break;
    }
    return value;
  }
});

const enumTypetoString = (type: InactiveType | ActionType): string => type in ActionType ?
  (<any>ActionType)[type] : (<any>Inactive)[type]

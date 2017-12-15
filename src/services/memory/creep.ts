import { Task, TaskType, Role } from "../../model/task";
import { Inactive, Action, ActionType, InactiveType } from "../../model/state";
import { Target } from "../../model/target";

import { Maybe, Either } from 'monet';

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

export const memoryOf = (creep: HasMemory) => ({
  get: function <K extends keyof TCreepMemory>(name: K): TCreepMemory[K] {
    switch(name){
      case 'role': return MaybeFromNull(creep.memory.role).map(role => (<any>Role)[role])
      case 'state': return StateMemory.fromAPI(creep.memory)
      case 'task': return TaskMemory.fromAPI(creep.memory)
      default: return TCreepMemory.fromAPI(creep.memory)[name];
    }

  },
  set: function <K extends keyof TCreepMemory>(name: K, value: any): TCreepMemory[K] {
    switch (name) {
      case 'role': creep.memory.role = Role[value]; break;
      case 'state': creep.memory.state = StateMemory.toAPI(value); break;
      case 'task': creep.memory.task = TaskMemory.toAPI(value); break;
    }
    return value;
  }
});

export class TCreepMemory {
  role: Maybe<Role>;
  task: Maybe<Task>;
  state: Either<Inactive, Action>;
  constructor(role: Maybe<Role>, state: Either<Inactive, Action>, task: Maybe<Task>) {
    this.role = role;
    this.state = state;
    this.task = task;
  }

  /**
   * TCreepMemory factory
   * @param creepMemory
   */
  static fromAPI(creepMemory: CreepMemory): TCreepMemory {
    let maybeRole = MaybeFromNull(creepMemory.role).map(role => (<any>Role)[role]);
    return new TCreepMemory(maybeRole,
      StateMemory.fromAPI(creepMemory), TaskMemory.fromAPI(creepMemory));
  }
  /**
   * CreepMemory factory
   * @param tCreepMemory
   */
  static toAPI(tCreepMemory: TCreepMemory): CreepMemory {
    let creepMemory = {};
    let state: string = StateMemory.toAPI(tCreepMemory.state);
    let task: string | undefined = TaskMemory.toAPI(tCreepMemory.task);
    if (tCreepMemory.state) _.merge(creepMemory, { "state": state });
    if (tCreepMemory.task) _.merge(creepMemory, { "task": task });
    if (tCreepMemory.role.isSome()) _.merge(creepMemory, { "role": Role[tCreepMemory.role.some()] });
    return creepMemory;
  }
}

const StateMemory = {
  fromAPI: (creepMemory: CreepMemory): Either<Inactive, Action> => {
    let state: string[] = (creepMemory.state || "").split(":")
    return state[0] in ActionType ? Either.Right(Action.fromArgsArray(state)) :
      Either.Left(new Inactive(inactiveType(creepMemory.state)))
  },
  toAPI: (state: Either<Inactive, Action>): string => state.cata(
    (state: Inactive) => (<any>InactiveType)[state.type],
    (state: Action) => [(<any>ActionType)[state.type]].concat(state.target.id).join(":"))
}

const TaskMemory = {
  fromAPI: (creepMemory: CreepMemory): Maybe<Task> => creepMemory.task ?
    Maybe.Some(Task.fromArgsArray(creepMemory.task.split(":"))) : Maybe.None(),
  toAPI: (task: Maybe<Task>): string | undefined => task.isSome() ? task.some().toArray().join(":") : undefined
}

const inactiveType = (name: string | undefined) => (<any>InactiveType)[name || InactiveType[InactiveType.NONE]];

//waiting for mmonet#0.9 on npm https://github.com/monet/monet.js/issues/83
function MaybeFromNull<T>(val: T | null | undefined): Maybe<T> {
  return val == null ? Maybe.None() : Maybe.Some(val)
}

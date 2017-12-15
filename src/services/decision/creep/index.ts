import { nextStateFor } from "./state";
import { order } from '../../execution/creep';
import { memoryOf } from '../../memory/creep';
import { Either, Maybe } from 'monet';
import { tryToFindJobFor } from '../jobs';
import { Task, Role } from '../../../model/task';
import { Inactive, Action } from '../../../model/state';

export const run = (creep: Creep) => {
  let creepMemory = memoryOf(creep);
  let task = creepMemory.get('task');
  let state = creepMemory.get('state');
  const role = creepMemory.get('role');

  if (task.isNone())[state, task] = newActivatedTaskFor(role, creep);
  else nextStateFor(creep)(task.some(), state).cata(
    done => {[state, task] = newActivatedTaskFor(role, creep)},
    action => {state = Either.Right(action)}
  );

  state = state.cata(
    inactive => _.tap(Either.Left(inactive), () => creep.say("idle")),
    order(creep).to
  )

  //TODO if state is left -> abort task?  ERR_TIRED 11 The fatigue indicator of the creep is non-zero.
  creepMemory.set('state', state);
  creepMemory.set('task', task);
}

const newActivatedTaskFor = (role: Maybe<Role>, creep: Creep): [Either<Inactive, Action>, Maybe<Task>] => {
  const left = (): [Either<Inactive, Action>, Maybe<Task>] =>
    [Either.Left(new Inactive()), Maybe.None<Task>()];
  const right = (task: Task): [Either<Inactive, Action>, Maybe<Task>] =>
    [nextStateFor(creep)(task), Maybe.Some<Task>(task)];
  return findTaskFor(role, creep).toEither().cata(left, right);
}

const coordinates = (id: number): [number, number] => [id, id];

const findTaskFor = (role: Maybe<Role>, creep: Creep): Maybe<Task> => {
  return tryToFindJobFor(role, creep).cata(
    (error: Error) => _.tap(Maybe.None(), () => console.log("Didn't found task for " + creep.name + " [" + role + "] : " + error.message)),
    (foundTask: Task) => Maybe.Some(foundTask));
}

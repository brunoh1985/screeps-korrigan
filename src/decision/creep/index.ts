import {
  update,
  ActiveTask, InactiveTask,
  Inactive, Action, Target,
  ActionType, InactiveType,
  noneTask
} from "./task";
import { order } from '../../execution/creep';
import * as Memory from '../../memory/creep';
import { Either, Maybe } from 'monet';
import { jobs } from '../jobs'

const EitherFrom = (task: InactiveTask | ActiveTask): Either<InactiveTask, ActiveTask> =>
  (task instanceof ActiveTask) ? Either.Right(task) : Either.Left(task)

export const run = (creep: Creep) => {
  Memory.forCreep(creep).getEitherTask('task')//Either<InactiveTask, ActiveTask>
    .flatMap((task: ActiveTask) => update(task).with(creep))
    .cata(() => jobs.tryToFindFor(Memory.forCreep(creep).get('role')), task => Either.Right(task)) //If is in inactive state (On left), try find a job
    .map((task: ActiveTask) => { mayBeActionOf(task).map(order(creep).to); return task; })
    .cata((task: InactiveTask) => Memory.forCreep(creep).set('task', task),
    (task: ActiveTask) => Memory.forCreep(creep).set('task', task))
  //do Either
}

export const mayBeActionOf = (task: ActiveTask): Maybe<Action> => (task.state instanceof Action) ?
  Maybe.Some(task.state) : Maybe.None();


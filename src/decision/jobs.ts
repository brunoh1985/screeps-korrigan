import { Either, Maybe } from 'monet';
import {
  InactiveTask, ActiveTask,
  noneTask
} from './creep/task';


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

export class Job {
  role: Role;
  task: ActiveTask;
}

export class JobsController {
  jobs: Job[] = [];
  constructor(jobs?: Job[]) {
    this.jobs = jobs || [];
  }
  tryToFindFor = (role: Role, creep?: Creep): Either<InactiveTask, ActiveTask> =>
    MaybeFromNull(_.find(this.jobs, job => job.role = role)).map((job: Job) => job.task).toEither(noneTask);
}
export const jobs = new JobsController();

//waiting for mmonet#0.9 on npm https://github.com/monet/monet.js/issues/83
function MaybeFromNull<T>(val: T | null | undefined): Maybe<T> {
  return val == null ? Maybe.None() : Maybe.Some(val)
}

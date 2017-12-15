import { Maybe, MaybeFromNull  } from '../../utils/monet';
import { Task, Role } from '../../model/task';
import { TaskBuilder, CannotBuildTaskError } from './task';
import { Either } from 'monet';

/*
export class Job {
  role: Role;
  task: Task;
}

export class JobsController {
  jobs: Job[] = [];
  constructor(jobs?: Job[]) {
    this.jobs = jobs || [];
  }
  tryToFindFor = (role: Maybe<Role>, creep: CreepProps): Maybe<Task> => {
    if (role.isSome()) {
      //get a task from job list
      return MaybeFromNull(_.find(this.jobs, job => job.role = role.some())).map((job: Job) => job.task)
      //or create automatically a task according to the role
      .orElse(MaybeFromNull(new TaskBuilder(creep).role(role.some()).build())
      );
    } else {
      return Maybe.None(); //No role, No Job assignement
    }
  }
}

export const jobs = new JobsController();
*/

export const tryToFindJobFor = (role: Maybe<Role>, creep: CreepProps): Either<Error, Task> => {
  if (role.isSome()) {
    //create automatically a task according to the role
    return new TaskBuilder(creep).role(role.some()).build();
  } else {
    return Either.Left(new CannotBuildTaskError("No role, No Job assignement"));
  }
}

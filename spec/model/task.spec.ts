import "../helpers/global-screeps-runtime";
import { Either, Maybe } from 'monet';
import { memoryOf } from '../../src/services/memory/creep';
import { Task, TaskType, Role } from "../../src/model/task";

describe("taskArgs: [\"HARVEST_STATIC\"\,\"74698a3a958afb4a87028d0f\"", () => {
  const taskArgs = ["HARVEST_STATIC","74698a3a958afb4a87028d0f"]

  it(" Task.fromArgsArray(taskArgs) should contains type and Target properties ", () => {
    let task = Task.fromArgsArray(taskArgs);
    expect(task.type).toBe(TaskType.HARVEST_STATIC);
    expect(task.target.id).toBe("74698a3a958afb4a87028d0f");
  });
});

describe("taskArgs: [\"HAUL\"\,\"74698a3a958afb4a87028d0f\"", () => {
  const taskArgs = ["HAUL","74698a3a958afb4a87028d0f"]

  it(" Task.fromArgsArray(taskArgs) should throw an error (missing target2) ", () => {
    expect(()=>Task.fromArgsArray(taskArgs)).toThrowError("Can not create Task of type HAUL, target 2 is missing");
  });
});

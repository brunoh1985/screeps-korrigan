import "../../helpers/global-screeps-runtime";
import { TestCreepWithMemory } from "../../helpers/models/creep/memory"
import { Either, Maybe } from '../../../src/utils/monet';
import { memoryOf } from '../../../src/services/memory/creep';
import { Task, TaskType, Role } from "../../../src/model/task";

describe("for Creep {role:HARVESTER, task:\"HARVEST_STATIC:74698a3a958afb4a87028d0f\"}", () => {
  let creep = new TestCreepWithMemory({ role: "HARVESTER", task: "HARVEST_STATIC:74698a3a958afb4a87028d0f" })
  let memoryOfCreep = memoryOf(creep);

  describe("memoryOfCreep ", () => {
    it(" have to containe the role property ", () => {
      expect(memoryOfCreep.get("role").some()).toBe(Role["HARVESTER"]);
    });
    it(" have to containe the task property ", () => {
      let task = memoryOfCreep.get("task");
      expect(task.isSome()).toBe(true);
      expect(task.some().type).toBe(TaskType.HARVEST_STATIC);
      expect(task.some().target.id).toBe("74698a3a958afb4a87028d0f");
    });
  });
});

describe("for Creep {task:HARVEST_STATIC:74698a3a958afb4a87028d0f}", () => {
  let creep = new TestCreepWithMemory({ task: "HARVEST_STATIC:74698a3a958afb4a87028d0f" })
  let memoryOfCreep = memoryOf(creep);

  it("memoryOfCreep have to contains all the task properties ", () => {
    let task = memoryOfCreep.get("task");
    expect(task.isSome()).toBe(true);
    expect(task.some().type).toBe(TaskType.HARVEST_STATIC);
    expect(task.some().target.id).toBe("74698a3a958afb4a87028d0f");
  });
});

describe("for Creep {task:\"HAUL\"\,\"74698a3a958afb4a87028d0f:74698a3a958afb4a87028d0g\"", () => {
  let creep = new TestCreepWithMemory({ task: "HAUL:74698a3a958afb4a87028d0f:74698a3a958afb4a87028d0g" })
  let memoryOfCreep = memoryOf(creep);

  it("memoryOfCreep have to contains all the task properties ", () => {
    let task = memoryOfCreep.get("task");
    expect(task.isSome()).toBe(true);
    expect(task.some().type).toBe(TaskType.HAUL);
    expect(task.some().target.id).toBe("74698a3a958afb4a87028d0f");
    expect((task.some().target2||{id:undefined}).id).toBe("74698a3a958afb4a87028d0g");
  });
});

describe("for Creep {task:\"HAUL\"\,\"74698a3a958afb4a87028d0f\"", () => {
  let creep = new TestCreepWithMemory({ task: "HAUL:74698a3a958afb4a87028d0f" })
  let memoryOfCreep = memoryOf(creep);

  it(" memoryOfCreep.get(\"task\") should throw an error (missing target2) ", () => {
    expect(()=>memoryOfCreep.get("task")).toThrowError("Can not create Task of type HAUL, target 2 is missing");
  });
});


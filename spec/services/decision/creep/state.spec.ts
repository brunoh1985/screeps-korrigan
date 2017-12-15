import "../../../helpers/global-screeps-runtime";
import { TestGame } from "../../../helpers/global-screeps-runtime";
import { TestRoomPosition, TestSource, TestSpawn,
  TestController, TestResource } from "../../../helpers/models"
import { TestCreepWithProps, CreepPropsFactory } from "../../../helpers/models/creep/props"
import { Inactive, Action, ActionType, InactiveType } from "../../../../src/model/state";
import { Task, TaskType } from "../../../../src/model/task";
import { Target } from "../../../../src/model/target";
import { nextStateFor } from "../../../../src/services/decision/creep/state";
import { Either, Maybe } from '../../../../src/utils/monet';
//import { Task, TaskType, Role } from "../../../src/model/task";


//TODO


//start Game conditions

const sourcePos = new TestRoomPosition(8, 1, "sim");
const source = new TestSource("source1Id", sourcePos);
const sourceTarget = new Target("source1Id", sourcePos);

const droppedSourcePos = new TestRoomPosition(12, 1, "sim");
const droppedSource = new TestResource("droppedSource1Id", 200, RESOURCE_ENERGY, droppedSourcePos);
const droppedSourceTarget = new Target("droppedSource1Id", droppedSourcePos);

const spawnPos = new TestRoomPosition(0, 0, "sim");
const spawn = new TestSpawn("source1Id", spawnPos);
const spawnTarget = new Target("spawn1Id", spawnPos);

it("", ()=>{
  expect("hits" in spawn).toBe(true);
  expect(spawn.hits).toBe(100);
})
const controllerPos = new TestRoomPosition(2, 5, "sim");
const controller = new TestController("controller1Id", controllerPos);
const controllerTarget = new Target("controller1Id", controllerPos);

Game = new TestGame({
  "source1Id": source,
  "droppedSource1Id": droppedSource,
  "spawn1Id": spawn,
  "controller1Id": controller
})
Game.spawns["Spawn1"] = spawn;
//Game.structures ?
//end Game Conditions

describe("Harvester", () => {

  describe("task: [\"HARVEST_STATIC\",\"source1\"]", () => {

    const task = new Task(TaskType.HARVEST_STATIC, sourceTarget);

    describe(" start away from source ", () => {
      const creepPos = new TestRoomPosition(1, 1, "sim");
      const creep = new CreepPropsFactory().pos(creepPos)
        .energy(0).carryCapacity(100)
        .build();
      const nextState = nextStateFor(creep)(task, Inactive.asLeft())
      it(" should move to the source ", () => {
        expect(nextState.right().type).toBe(ActionType.MOVE);
        expect(nextState.right().target.id).toBe("source1Id");
      });
    });

    describe(" is near to the source ", () => {
      const creepPos = new TestRoomPosition(7, 1, "sim");
      const creep = new CreepPropsFactory().pos(creepPos)
        .energy(0).carryCapacity(100)
        .build();
      const nextState = nextStateFor(creep)(task, Inactive.asLeft())
      it(" should move to the source ", () => {
        expect(nextState.right().type).toBe(ActionType.HARVEST);
        expect(nextState.right().target.id).toBe("source1Id");
      });
    });
  });
});

describe("Upgrader", ()=>{

  describe("task: [\"UPGRADE\",\"controller\"]", () => {

    const task = new Task(TaskType.UPGRADE, controllerTarget, spawnTarget);

    describe(" start away from controller and spawn. Empty ", () => {
      const creepPos = new TestRoomPosition(2, 2, "sim");
      const creep = new CreepPropsFactory().pos(creepPos)
        .energy(0).carryCapacity(100)
        .build();
      const nextState = nextStateFor(creep)(task, Inactive.asLeft())
      it(" should move to the spawn, source of energy ", () => {
        expect(nextState.right().type).toBe(ActionType.MOVE);
        expect(nextState.right().target.id).toBe(spawnTarget.id);
      });
    });

    describe(" is near to the spawn. Empty ", () => {
      const creepPos = new TestRoomPosition(0, 1, "sim");
      const creep = new CreepPropsFactory().pos(creepPos)
        .energy(0).carryCapacity(100)
        .build();
      const nextState = nextStateFor(creep)(task, Inactive.asLeft())
      it(" should withdraw energy from the spawn ", () => {
        expect(nextState.right().type).toBe(ActionType.WITHDRAW);
        expect(nextState.right().target.id).toBe(spawnTarget.id);
      });
    });

    describe(" is near to the spawn. Not Empty. Not Full ", () => {
      const creepPos = new TestRoomPosition(0, 1, "sim");
      const creep = new CreepPropsFactory().pos(creepPos)
        .energy(50).carryCapacity(100)
        .build();
      const nextState = nextStateFor(creep)(task, Inactive.asLeft())
      it(" should still withdraw energy from the spawn ", () => {
        expect(nextState.right().type).toBe(ActionType.WITHDRAW);
        expect(nextState.right().target.id).toBe(spawnTarget.id);
      });
    });

    describe(" is near to the spawn. Full ", () => {
      const creepPos = new TestRoomPosition(0, 1, "sim");
      const creep = new CreepPropsFactory().pos(creepPos)
        .energy(100).carryCapacity(100)
        .build();
      const nextState = nextStateFor(creep)(task, Inactive.asLeft())
      it(" should move to the controller ", () => {
        expect(nextState.right().type).toBe(ActionType.MOVE);
        expect(nextState.right().target.id).toBe(controllerTarget.id);
      });
    });

    describe(" is somewhere. Full ", () => {
      const creepPos = new TestRoomPosition(2, 2, "sim");
      const creep = new CreepPropsFactory().pos(creepPos)
        .energy(100).carryCapacity(100)
        .build();
      const nextState = nextStateFor(creep)(task, Inactive.asLeft())
      it(" should move to the controller ", () => {
        expect(nextState.right().type).toBe(ActionType.MOVE);
        expect(nextState.right().target.id).toBe(controllerTarget.id);
      });
    });

    describe(" is near the controller. Full ", () => {
      const creepPos = new TestRoomPosition(2, 4, "sim");
      const creep = new CreepPropsFactory().pos(creepPos)
        .energy(100).carryCapacity(100)
        .build();
      const nextState = nextStateFor(creep)(task, Inactive.asLeft())
      it(" should upgrade the controller ", () => {
        expect(nextState.right().type).toBe(ActionType.UPGRADE);
        expect(nextState.right().target.id).toBe(controllerTarget.id);
      });
    });

    describe(" is upgrading the controller. Half full ", () => {
      const creepPos = new TestRoomPosition(2, 4, "sim");
      const creep = new CreepPropsFactory().pos(creepPos)
        .energy(50).carryCapacity(100)
        .build();
      const nextState = nextStateFor(creep)(task, Action.asRight(ActionType.UPGRADE, controllerTarget))
      it(" should continue to upgrade the controller ", () => {
        expect(nextState.right().type).toBe(ActionType.UPGRADE);
        expect(nextState.right().target.id).toBe(controllerTarget.id);
      });
    });

    describe(" is upgrading the controller and, then is empty ", () => {
      const creepPos = new TestRoomPosition(2, 4, "sim");
      const creep = new CreepPropsFactory().pos(creepPos)
        .energy(0).carryCapacity(100)
        .build();
      const nextState = nextStateFor(creep)(task, Action.asRight(ActionType.UPGRADE, controllerTarget))
      it(" should go back to source of energy (spawn) ", () => {
        expect(nextState.right().type).toBe(ActionType.MOVE);
        expect(nextState.right().target.id).toBe(spawnTarget.id);
      });
    });
  });
})


describe("Hauler", ()=>{

    describe("task: [\"HAUL\",\"dropped energy\"]", () => {

      const task = new Task(TaskType.HAUL, droppedSourceTarget, spawnTarget);


      describe(" is somewhere. Empty ", () => {
        const creepPos = new TestRoomPosition(2, 2, "sim");
        const creep = new CreepPropsFactory().pos(creepPos)
          .energy(0).carryCapacity(100)
          .build();
        const nextState = nextStateFor(creep)(task, Inactive.asLeft())
        it(" should continue to move to the droppedSource ", () => {
          expect(nextState.isRight()).toBe(true);
          expect(nextState.right().type).toBe(ActionType.MOVE);
          expect(nextState.right().target.id).toBe(droppedSource.id);
        });
      });

      describe(" is near the dropped Source. ", () => {
        const creepPos = new TestRoomPosition(11, 1, "sim");
        const creep = new CreepPropsFactory().pos(creepPos)
          .energy(0).carryCapacity(100)
          .build();
        const nextState = nextStateFor(creep)(task, Inactive.asLeft())
        it(" should pickup the dropped resource ", () => {
          expect(nextState.right().type).toBe(ActionType.PICKUP);
          expect(nextState.right().target.id).toBe(droppedSource.id);
        });
      });

      describe(" is pickup the dropped Source. Half full ", () => {
        const creepPos = new TestRoomPosition(11, 1, "sim");
        const creep = new CreepPropsFactory().pos(creepPos)
          .energy(50).carryCapacity(100)
          .build();
        const nextState = nextStateFor(creep)(task, Action.asRight(ActionType.PICKUP, controllerTarget))
        it(" should continue to pickup the dropped resource ", () => {
          expect(nextState.right().type).toBe(ActionType.PICKUP);
          expect(nextState.right().target.id).toBe(droppedSource.id);
        });
      });

      describe(" is picking up the resource and, then is full ", () => {
        const creepPos = new TestRoomPosition(11, 1, "sim");
        const creep = new CreepPropsFactory().pos(creepPos)
          .energy(100).carryCapacity(100)
          .build();
        const nextState = nextStateFor(creep)(task, Action.asRight(ActionType.PICKUP, controllerTarget))
        it(" should go back to source of energy (spawn) ", () => {
          expect(nextState.right().type).toBe(ActionType.MOVE);
          expect(nextState.right().target.id).toBe(spawnTarget.id);
        });
      });

      describe(" Somewhere. Full of energy ", () => {
        const creepPos = new TestRoomPosition(4, 4, "sim");
        const creep = new CreepPropsFactory().pos(creepPos)
          .energy(100).carryCapacity(100)
          .build();
        const nextState = nextStateFor(creep)(task, Inactive.asLeft())
        it(" should move to the spawn, source of energy ", () => {
          expect(nextState.right().type).toBe(ActionType.MOVE);
          expect(nextState.right().target.id).toBe(spawnTarget.id);
        });
      });

      describe(" is near to the spawn. Full ", () => {
        const creepPos = new TestRoomPosition(0, 1, "sim");
        const creep = new CreepPropsFactory().pos(creepPos)
          .energy(100).carryCapacity(100)
          .build();
        const nextState = nextStateFor(creep)(task, Inactive.asLeft())
        it(" should transfert energy to the spawn ", () => {
          expect(nextState.right().type).toBe(ActionType.TRANSFERT);
          expect(nextState.right().target.id).toBe(spawnTarget.id);
        });
      });

      describe(" is near to the spawn. Not Empty. Not Full ", () => {
        const creepPos = new TestRoomPosition(0, 1, "sim");
        const creep = new CreepPropsFactory().pos(creepPos)
          .energy(50).carryCapacity(100)
          .build();
        const nextState = nextStateFor(creep)(task, Action.asRight(ActionType.TRANSFERT, droppedSourceTarget))
        it(" should still transfert energy to the spawn ", () => {
          expect(nextState.right().type).toBe(ActionType.TRANSFERT);
          expect(nextState.right().target.id).toBe(spawnTarget.id);
        });
      });

      describe(" is near to the spawn. Empty ", () => {
        const creepPos = new TestRoomPosition(0, 1, "sim");
        const creep = new CreepPropsFactory().pos(creepPos)
          .energy(0).carryCapacity(100)
          .build();
        const nextState = nextStateFor(creep)(task, Action.asRight(ActionType.TRANSFERT, droppedSourceTarget))
        it(" should move to the dropped Resource ", () => {
          expect(nextState.right().type).toBe(ActionType.MOVE);
          expect(nextState.right().target.id).toBe(droppedSource.id);
        });
      });
    });
  })

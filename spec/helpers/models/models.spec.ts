import "./../global-screeps-runtime";
import { TestCreepWithProps } from "./creep/props"
import {TestRoomPosition, TestSpawn, TestSource} from "./"

describe("for RoomPosition(2, 2, \"sim\")", () => {
  //RoomPosition(x: number, y: number, roomName: string)
  const roomPosition = new TestRoomPosition(2, 2, "sim");
  roomPosition.isNearTo = () => true;
  const roomPosition2 = new TestRoomPosition(2, 3, "sim")
  it(" roomPosition.isNearTo(roomPosition2) ", () => {
    expect(roomPosition.isNearTo(roomPosition2)).toBe(true);
  });
});

describe("for RoomPosition(2, 2, \"sim\")", () => {
  //RoomPosition(x: number, y: number, roomName: string)
  const roomPosition = new TestRoomPosition(2, 2, "sim");
  describe("for RoomPosition2 (3, 2, \"sim\")", () => {
    const roomPosition2 = new TestRoomPosition(2, 2, "sim")
    it(" isNearTo should be true ", () => {
      expect(roomPosition.isNearTo(roomPosition2)).toBe(true);
    });
  });

  describe("for RoomPosition2 (3, 2, \"sim\")", () => {
    const roomPosition2 = new TestRoomPosition(6, 3, "sim")
    it(" isNearTo should be false ", () => {
      expect(roomPosition.isNearTo(roomPosition2)).toBe(false);
    });
  });
});


describe("TestSource(\"source1Id\", new TestRoomPosition(8, 1, \"sim\"))", () => {
  const sourcePos = new TestRoomPosition(8, 1, "sim");
  const source = new TestSource("source1Id", sourcePos);
  it(" should have an id ", () => {
    expect(source.id).toBe("source1Id");
  });
})

/* Fail
describe("TestSpawn(\"spawn1Id\", new TestRoomPosition(8, 1, \"sim\"))", () => {
  const spawnPos = new TestRoomPosition(8, 1, "sim");
  const spawn = new TestSpawn("spawn1Id", spawnPos);
  it(" should have an id ", () => {
    expect(spawn.id).toBe("spawn1Id");
  });
})
*/

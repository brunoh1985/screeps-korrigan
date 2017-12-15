export class TestRoomPosition implements RoomPosition {
  readonly prototype: RoomPosition;
  roomName: string = "sim";
  x: number = 0;
  y: number = 0;
  constructor(x: number, y: number, roomName: string) {
    this.x = x;
    this.y = y,
      this.roomName = roomName;
  }
  createConstructionSite(structureType: StructureConstant): ScreepsReturnCode { return 0 };
  createFlag(name?: string, color?: ColorConstant, secondaryColor?: ColorConstant): ScreepsReturnCode { return 0 };
  findClosestByPath<T extends _HasRoomPosition | RoomPosition>(...args: any[]): T | null { return null };
  findClosestByRange<T extends _HasRoomPosition | RoomPosition>(...args: any[]): T | null { return null };
  findInRange<T extends _HasRoomPosition | RoomPosition>(...args: any[]): any {
  };
  findPathTo(...args: any[]): PathStep[] { return [{ x: 0, dx: 0, y: 0, dy: 0, direction: 1 }] };
  getDirectionTo(): DirectionConstant { return 1 };
  getRangeTo(...args: any[]): number { return 1 };
  inRangeTo(target: RoomPosition | {
    pos: RoomPosition;
  }, range: number): boolean { return true };
  isEqualTo(...args: any[]): boolean { return true };
  isNearTo(...args: any[]) {
    var [x, y, roomName] = fetchXYArguments(args[0], args[1]);
    return Math.abs(x - this.x) <= 1 && Math.abs(y - this.y) <= 1 && (!roomName || roomName == this.roomName);
  };
  look(): LookAtResult[] { return [{ type: "creep" }] };
  lookFor<T extends RoomObject>(type: LookConstant): any { return [{ pos: new TestRoomPosition(0, 0, "sim") }] };
}

const fetchXYArguments = function (firstArg: any, secondArg: any) {
  var x, y, roomName;
  if (_.isUndefined(secondArg) || !_.isNumber(secondArg)) {
    if (!_.isObject(firstArg)) {
      return [undefined, undefined, undefined];
    }
    if (firstArg.pos) {
      x = firstArg.pos.x;
      y = firstArg.pos.y;
      roomName = firstArg.pos.roomName;
    }
    else {
      x = firstArg.x;
      y = firstArg.y;
      roomName = firstArg.roomName;
    }

  }
  else {
    x = firstArg;
    y = secondArg;
  }
  if (_.isNaN(x)) {
    x = undefined;
  }
  if (_.isNaN(y)) {
    y = undefined;
  }
  return [x, y, roomName];
}

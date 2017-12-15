import * as RoomPosition from './roomPosition'

export const TestRoomPosition = RoomPosition.TestRoomPosition;

export class TestRoomObject implements RoomObject{
  readonly prototype: RoomObject;
  pos: RoomPosition;
  room: Room | undefined;
  constructor(pos: RoomPosition, room?: Room) {
    this.pos = pos;
    this.room = room;
  }
}

export class TestSource extends TestRoomObject implements Source {
  readonly prototype: Source;
  energy: number = 1000;
  energyCapacity: number = 10000;
  id: string;
  room: Room;
  ticksToRegeneration: number;
  constructor(id: string, pos: RoomPosition, room?: Room) {
    super(pos, room);
    this.id = id;
  }
}

export class TestResource<T extends ResourceConstant = ResourceConstant> extends TestRoomObject {
  readonly prototype: Resource;
  amount: number;
  id: string;
  resourceType: T;
  constructor(id: string, amount: number, resourceType: T, pos: RoomPosition, room?: Room) {
    super(pos, room);
    this.id = id;
    this.amount = amount;
    this.resourceType = resourceType;
  }
}

export class TestStructure<T extends StructureConstant = StructureConstant> extends TestRoomObject implements Structure {
  readonly prototype: Structure;
  hits: number = 100;
  hitsMax: number = 100;
  id: string;
  room: Room;
  structureType: T;
  constructor(id: string, pos: RoomPosition, room?: Room) {
    super(pos, room);
    this.id;
    this.room;
  }
  destroy(): ScreepsReturnCode {return 0};
  isActive(): boolean {return true};
  notifyWhenAttacked(enabled: boolean): ScreepsReturnCode {return 0};
}

export class TestOwnedStructure<T extends StructureConstant = StructureConstant> extends TestStructure<T> implements OwnedStructure {
  readonly prototype: OwnedStructure;
  my: boolean;
  owner: Owner;
  room: Room;
  constructor(id: string, pos: RoomPosition, room?: Room) {
    super(id, pos, room);
  }
}

export class TestSpawn extends TestOwnedStructure<STRUCTURE_SPAWN> implements Spawn {
  readonly prototype: StructureSpawn;
  energy: number;
  energyCapacity: number;
  memory: SpawnMemory;
  name: string;
  spawning: {
      name: string;
      needTime: number;
      remainingTime: number;
  };
  constructor(id: string, pos: RoomPosition, room?: Room) {
    super(id, pos, room);
  }
  canCreateCreep(body: BodyPartConstant[], name?: string): ScreepsReturnCode {return 0};
  createCreep(body: BodyPartConstant[], name?: string, memory?: CreepMemory): ScreepsReturnCode | string {return 0};
  spawnCreep(body: BodyPartConstant[], name: string, opts?: {
      memory?: CreepMemory;
      energyStructures?: Array<(StructureSpawn | StructureExtension)>;
      dryRun?: boolean;
  }): ScreepsReturnCode {return 0};;
  destroy(): ScreepsReturnCode {return 0};
  isActive(): boolean {return true};
  notifyWhenAttacked(enabled: boolean): ScreepsReturnCode {return 0};
  renewCreep(target: Creep): ScreepsReturnCode {return 0};
  recycleCreep(target: Creep): ScreepsReturnCode {return 0};
}

export class TestController extends TestOwnedStructure<STRUCTURE_CONTROLLER> implements Controller {
  readonly prototype: StructureController;
  level: number;
  progress: number;
  progressTotal: number;
  reservation: ReservationDefinition;
  safeMode?: number;
  safeModeAvailable: number;
  safeModeCooldown?: number;
  sign: SignDefinition;
  ticksToDowngrade: number;
  upgradeBlocked: number;
  activateSafeMode(): ScreepsReturnCode {return 0};
  unclaim(): ScreepsReturnCode {return 0};
}

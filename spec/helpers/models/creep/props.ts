import { TestRoomPosition } from "../roomPosition";


export class TestCreepWithProps implements CreepProps {
  readonly prototype: RoomObject;
  pos: RoomPosition;
  body: BodyPartDefinition[];
  carry: StoreDefinition;
  carryCapacity: number;
  fatigue: number;
  hits: number;
  hitsMax: number;
  id: string;
  memory: any;
  my: boolean;
  name: string;
  owner: Owner;
  room: Room;
  spawning: boolean;
  saying: string;
  ticksToLive: number;
  getActiveBodyparts: (type: BodyPartConstant) => number;

  constructor(x?: number, y?: number, roomName?: string) {
    if (x && y && roomName) this.pos = new TestRoomPosition(x, y, roomName);
  }
}

export class CreepPropsFactory {
  private _pos: RoomPosition;
  private _body: BodyPartDefinition[];
  private _carry: StoreDefinition = {energy: 50};
  private _carryCapacity: number = 100;
  private _fatigue: number;
  private _hits: number;
  private _hitsMax: number;
  private _id: string;
  private _memory: any;
  private _my: boolean;
  private _name: string;
  private _owner: Owner;
  private _room: Room;
  private _spawning: boolean;
  private _saying: string;
  private _ticksToLive: number;
  private _getActiveBodyparts: (type: BodyPartConstant) => number;

  public build(): CreepProps {

    let capacity = this._carryCapacity;
    if (!capacity && _.isArray(this._body)) {
      capacity = _.filter(this._body, (p: any) => p === CARRY).length * CARRY_CAPACITY;
    }
    return {
      pos: this._pos,
      body: this._body,
      carry: this._carry,
      carryCapacity: this._carryCapacity,
      fatigue: this._fatigue,
      hits: this._hits,
      hitsMax: this._hitsMax,
      id: this._id,
      memory: this._memory,
      my: this._my,
      name: this._name,
      owner: this._owner,
      room: this._room,
      spawning: this._spawning,
      saying: this._saying,
      ticksToLive: this._ticksToLive,
      getActiveBodyparts: this._getActiveBodyparts
    } as TestCreepWithProps;
  }

  public pos(pos: RoomPosition): CreepPropsFactory {
    this._pos = pos;
    return this;
  }

  public body(body: any): CreepPropsFactory {
    this._body = body;
    return this;
  }

  public energy(amount: number): CreepPropsFactory {
    this._carry = {energy: amount};
    return this;
  }

  public carrying(type: StoreDefinition | string, amount?: number): CreepPropsFactory {
    if (!amount) {
      this._carry = type as StoreDefinition;
    } else if (typeof type === "string") {
      const c: any = {};
      c[type] = amount;
      this._carry = c as StoreDefinition;
    }
    return this;
  }

  public carryCapacity(capactiy: number): CreepPropsFactory {
    this._carryCapacity = capactiy;
    return this;
  }

  public fatigue(fatigue: number): CreepPropsFactory {
    this._fatigue = fatigue;
    return this;
  }

  public hits(hits: number): CreepPropsFactory {
    this._hits = hits;
    return this;
  }

  public hitsMax(hitsMax: number): CreepPropsFactory {
    this._hitsMax = hitsMax;
    return this;
  }

  public id(id: string): CreepPropsFactory {
    this._id = id;
    return this;
  }

  public memory(memory: any): CreepPropsFactory {
    this._memory = memory;
    return this;
  }

  public my(my: boolean): CreepPropsFactory {
    this._my = my;
    return this;
  }

  public name(name: string): CreepPropsFactory {
    this._name = name;
    return this;
  }

  public owner(owner: Owner): CreepPropsFactory {
    this._owner = owner;
    return this;
  }

  public room(room: Room): CreepPropsFactory {
    this._room = room;
    return this;
  }

  public spawning(spawning: boolean): CreepPropsFactory {
    this._spawning = spawning;
    return this;
  }

  public saying(saying: string): CreepPropsFactory {
    this._saying = saying;
    return this;
  }

  public ticksToLive(ticksToLive: number): CreepPropsFactory {
    this._ticksToLive = ticksToLive;
    return this;
  }
}

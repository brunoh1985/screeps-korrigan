import { MaybeFromNull } from '../utils/monet';

export class Target implements _HasRoomPosition {
  id: string
  private _pos?: RoomPosition
  constructor(id: string, pos?: RoomPosition) {
    this.id = id;
    this._pos = pos;
  }
  get pos(): RoomPosition {
    return this._pos || MaybeFromNull(Game.getObjectById<_HasRoomPosition>(this.id)).some().pos;
  }
}

/// <reference path="../../src/types.d.ts" />
/*
 Screeps Typescript Test Helper
 We add the following to the global namespace to mimic the Screeps runtime:
 + lodash
 + Screeps game constants
 */
declare const global: any;
declare const _: any;

import * as lodash from "lodash";
import consts from "./game-constants";

global._ = lodash;

export class TestGame implements Game {
  private _objects: { [key: string]: any; } = {};

  constructor(objects: { [key: string]: any }) {
    this._objects = objects;
  }

  cpu: CPU;
  creeps: { [creepName: string]: Creep; } = {};
  flags: { [flagName: string]: Flag; } = {};
  gcl: GlobalControlLevel = { level: 0, progress: 0, progressTotal: 0};
  map: GameMap;
  market: Market;
  resources: { [key: string]: any; } = {};
  rooms: { [roomName: string]: Room; } = {};
  spawns: { [spawnName: string]: Spawn; } = {};
  structures: { [structureId: string]: Structure; } = {};
  constructionSites: { [constructionSiteId: string]: ConstructionSite; } = {};
  shard: Shard;
  time: number;
  getObjectById<T>(id: string): T { return this._objects[id] };
  notify(message: string, groupInterval?: number): void {};
}
global.Game = new TestGame({});

_.merge(global, consts);

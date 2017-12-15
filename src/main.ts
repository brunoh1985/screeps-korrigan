import { ErrorMapper } from "utils/ErrorMapper";
import { checkOutOfBoundsMemory } from './services/memory';
import { run } from './services/decision/creep';

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(function () {
  //console.log(`Current game tick is ${Game.time}`);

  // Check memory for null or out of bounds custom objects
  checkOutOfBoundsMemory()

  // Initialise all controlled rooms.
  _.each(Game.rooms, (room: Room) => {
    runControlledRooms(room)
  })
});

const runControlledRooms = (room: Room) => {
  const creeps: Creep[] = room.find<Creep>(FIND_MY_CREEPS)
  // update needs and then jobs room.memory
  _.each(creeps, (creep: Creep) => {
    let creepMemory = creep.memory;
    run(creep);
  })
}

/**
 * Loads all the available structures within a room.
 *
 * @export
 * @param {Room} room The current room.
 * @returns {Structure[]} an array of structures inside the room
 */
export function loadStructures(room: Room): Structure[] {
  return room.find(FIND_MY_STRUCTURES)
}

/**
 * Loads all the available structures within a room.
 *
 * @export
 * @param {Room} room The current room.
 * @returns {StructureTower[]} an array of towers inside the room
 */
export function getTowers(room: Room): StructureTower[] {
  return room.find(FIND_MY_STRUCTURES, {
    filter: (structure: Structure) => structure.structureType === STRUCTURE_TOWER
  })
}

/**
 * Get the storage objects available. This prioritizes StructureContainer,
 * but will fall back to an extension, or to the spawn if need be.
 *
 * @export
 * @param {Room} room The current room.
 * @returns {Structure[]} an array of storage objects
 */
export function getStorageObjects(room: Room): Structure[] {
  const structures: Structure[] = loadStructures(room)
  let targets: Structure[]

  // Prioritise containers first.
  targets = structures.filter((structure: Structure) => {
    return (structure instanceof StructureContainer &&
      structure.structureType === STRUCTURE_CONTAINER)
      && (_.sum(structure.store) < structure.storeCapacity)
  })

  // If nothing is found, expand search to include extensions
  if (targets.length === 0) {
    targets = structures.filter((structure: Structure) => {
      return structure instanceof StructureExtension && structure.energy < structure.energyCapacity
    })
  }

  // Otherwise, look for spawns
  if (targets.length === 0) {
    targets = structures.filter((structure: Structure) => {
      return structure instanceof StructureSpawn && structure.energy < structure.energyCapacity
    })
  }

  return targets
}

/**
 * Get the storage objects available. This prioritizes StructureContainer,
 * but will fall back to an extension, or to the spawn if need be.
 *
 * @export
 * @param {Room} room The current room.
 * @returns {Structure[]} an array of source withdrawal points if any.
 */
export function getSourceWithdrawalPoints(room: Room): Structure[] {
  const structures: Structure[] = loadStructures(room)
  let targets: Structure[] = []

  // First pass: prioritise StructureStorage.
  if (room.storage) {
    if (_.sum(room.storage.store) > 500) {
      targets.push(room.storage)
    }
  }

  // Second pass: if no StructureStorage is found, find any containers.
  if (targets.length === 0) {
    targets = structures.filter((structure: Structure) => {
      return structure instanceof StructureContainer && _.sum(structure.store) > 500
    })
  }

  return targets
}

/**
 * Get the energy dropoff points available. This prioritizes the spawn,
 * falling back on extensions, then towers, and finally containers.
 *
 * @export
 * @param {Room} room The current room
 * @returns {Structure[]} An array of energy dropoff points, if any.
 */
export function getDropOffPoints(room: Room): Structure[] {
  const structures: Structure[] = loadStructures(room)

  let targets: Structure[] = structures.filter((structure: Structure) => {
    return (structure instanceof StructureSpawn
      && (structure.structureType === STRUCTURE_SPAWN)
      && structure.energy < structure.energyCapacity)
  })

  // If the spawn is full, we'll find any extensions/towers.
  if (targets.length === 0) {
    targets = structures.filter((structure: Structure) => {
      return (structure instanceof StructureExtension
        && (structure.structureType === STRUCTURE_EXTENSION)
        && structure.energy < structure.energyCapacity)
    })
  }

  // Or if that's filled as well, look for towers.
  if (targets.length === 0) {
    targets = structures.filter((structure: Structure) => {
      return (structure instanceof StructureTower
        && (structure.structureType === STRUCTURE_TOWER)
        && structure.energy < structure.energyCapacity - (structure.energyCapacity * 0.5))
    })
  }

  // Otherwise, look for storage containers.
  if (targets.length === 0) {
    targets = structures.filter((structure: Structure) => {
      return (structure instanceof StructureStorage
        && (structure.structureType === STRUCTURE_STORAGE)
        && _.sum(structure.store) < structure.storeCapacity)
    })
  }

  return targets
}

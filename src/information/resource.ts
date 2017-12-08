/**
 * Gets a list of salvageable dropped resources. 'Salvageable' in this case
 * means any dropped resource stash with the amount greater than or equal to
 * `this.creep.carryCapacity * 0.2`
 *
 * @returns {Resource[]} Filtered array of dropped resources
 * @memberof Role
*/
export const findSalvageableDroppedResources = (creep: CreepProps, room = creep.room): Resource[] => {
  const droppedResources: Resource[] = room.find<Resource>(FIND_DROPPED_RESOURCES)
  return droppedResources.filter((resource: Resource) => resource.amount >= (creep.carryCapacity * 0.2))
}

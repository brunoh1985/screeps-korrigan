export class TestCreepWithMemory implements HasMemory {
  memory: CreepMemory;
  constructor(memory: CreepMemory) {
    this.memory = memory;
  }
}

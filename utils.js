const utils = {
    /**
     * Generic function to get the first structure of a given type that has free capacity for energy.
     * @param {Creep} creep - The creep requesting the structure.
     * @param {string} structureType - The type of structure to look for.
     * @returns {Structure|null} - Closest structure or null.
     */
    getStructureWithFreeEnergyCapacity(creep, structureType) {
        const targets = creep.room.find(FIND_STRUCTURES, {
            filter: structure =>
                structure.structureType === structureType &&
                structure.store &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        });
        return targets.length > 0 ? targets[0] : null;
    },

    /**
     * Get the closest extension that can accept energy.
     */
    getExtensions(creep) {
        return this.getStructureWithFreeEnergyCapacity(creep, STRUCTURE_EXTENSION);
    },

    /**
     * Get the closest spawn that can accept energy.
     */
    getSpawns(creep) {
        return this.getStructureWithFreeEnergyCapacity(creep, STRUCTURE_SPAWN);
    },

    /**
     * Get the closest tower that can accept energy.
     */
    getTowers(creep) {
        return this.getStructureWithFreeEnergyCapacity(creep, STRUCTURE_TOWER);
    },

    /**
     * Get the closest container that can accept energy.
     */
    getContainers(creep) {
        return this.getStructureWithFreeEnergyCapacity(creep, STRUCTURE_CONTAINER);
    },

    /**
     * Get the closest storage that can accept energy.
     */
    getStorages(creep) {
        return this.getStructureWithFreeEnergyCapacity(creep, STRUCTURE_STORAGE);
    }
};

module.exports = utils;

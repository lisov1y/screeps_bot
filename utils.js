const utils = {
    getExtensions: function(creep) {
        const targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
            }
        });
        return targets ? targets[0] : 0;
    },

    getSpawns: function(creep) {
        const targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_SPAWN &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
            }
        });
        return targets ? targets[0] : 0;
    },

    getTowers: function(creep) {
        const targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_TOWER &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
            }
        });
        return targets ? targets[0] : 0;
    },

    getContainers: function(creep) {
        const targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
            }
        });
        return targets ? targets[0] : 0;
    },

    getStorages: function() {
        const targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_STORAGE &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
            }
        });
        return targets ? targets[0] : 0;
    },

}

module.exports = utils;
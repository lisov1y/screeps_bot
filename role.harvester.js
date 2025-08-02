const actions = require("./actions");

const roleHarvester = {

    run: function(creep) {
        if (creep.store.getFreeCapacity() > 0) {
            this.harvestEnergy(creep);
        } else {
            this.transferEnergy(creep);
        }
    },

    harvestEnergy: function(creep) {
        actions.pickupDroppedEnergy(creep);
        if (!creep.memory.targetSource) {
            const sources = creep.room.find(FIND_SOURCES);
            const closestSource = creep.pos.findClosestByPath(sources);
            creep.memory.targetSource = closestSource.id;
        }
        const source = Game.getObjectById(creep.memory.targetSource);
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
        }
    },

    transferEnergy: function(creep) {
        const targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER ||
                        structure.structureType == STRUCTURE_CONTAINER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        console.log(creep.transfer(targets[0]));
        if (targets.length > 0) {
            if (creep.transfer(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
    }
};

module.exports = roleHarvester;
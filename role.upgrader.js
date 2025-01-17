const roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // Check if the creep should switch between harvesting and upgrading
        if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.upgrading && creep.store.getFreeCapacity() === 0) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        // Perform the appropriate action based on the creep's state
        if (creep.memory.upgrading) {
            this.upgradeController(creep);
        } else {
            this.harvestEnergy(creep);
        }
    },

    /** @param {Creep} creep **/
    upgradeController: function(creep) {
        // Move to and upgrade the controller
        if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
        }
    },

    /** @param {Creep} creep **/
    harvestEnergy: function(creep) {
        // Find the best available energy source
        const target = this.findEnergySource(creep);
        if (target) {
            // Withdraw or harvest energy from the target
            if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE || creep.harvest(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    },

    /** @param {Creep} creep **/
    findEnergySource: function(creep) {
        // Find the closest container or storage with energy
        let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_CONTAINER ||
                        structure.structureType === STRUCTURE_STORAGE) &&
                        structure.store[RESOURCE_ENERGY] > 0;
            }
        });

        // If no container or storage is found, find the closest active source
        if (!target) {
            target = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        }

        return target;
    }
};

module.exports = roleUpgrader;
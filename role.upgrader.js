const actions = require("./actions");

const roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // Check if the creep should switch between harvesting and upgrading
        if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.upgrading = false;
        }
        if (!creep.memory.upgrading && creep.store.getFreeCapacity() === 0) {
            creep.memory.upgrading = true;
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

    harvestEnergy: function(creep) {
        if (!creep.memory.targetSource) {
            const source = creep.room.find(FIND_SOURCES)[0];
            creep.memory.targetSource = source.id;
        }
        const source = Game.getObjectById(creep.memory.targetSource);
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
    },
};

module.exports = roleUpgrader;
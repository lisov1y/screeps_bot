const actions = require("./actions");

const roleRepairer = {
    run: function(creep) {
        if (creep.memory.repairing && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.repairing = false;
        }
        if (!creep.memory.repairing && creep.store.getFreeCapacity() === 0) {
            creep.memory.repairing = true;
        }

        if (creep.memory.repairing) {
            // Check for towers that need energy
            const lowTower = creep.room.find(FIND_MY_STRUCTURES, {
                filter: s => s.structureType === STRUCTURE_TOWER &&
                             s.store[RESOURCE_ENERGY] <= 250
            })[0];

            if (lowTower) {
                if (creep.transfer(lowTower, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(lowTower);
                }
                return; // skip repairing this tick
            }

            // Otherwise proceed with repairs
            actions.repairDamagedStructures(creep);
        } else {
            let src = actions.findEnergySource(creep);
            if (src) {
                const result = creep.withdraw(src, RESOURCE_ENERGY);
                if (result === ERR_NOT_IN_RANGE) {
                    creep.moveTo(src);
                }
            }
        }
    }
};

module.exports = roleRepairer;

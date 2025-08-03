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
            actions.repairDamagedStructures(creep);
        } else {
            let src = actions.findEnergySource(creep);
            if (src) {
                // Withdraw or harvest energy from the target
                if (creep.withdraw(src, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE || creep.harvest(src) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(src);
                }
            }
        }
    }
};

module.exports = roleRepairer;
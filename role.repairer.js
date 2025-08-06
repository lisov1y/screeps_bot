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
            // Find all towers that aren't full
            // const towersNeedingEnergy = creep.room.find(FIND_MY_STRUCTURES, {
            //     filter: s => s.structureType === STRUCTURE_TOWER &&
            //                  s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            // });

            // if (towersNeedingEnergy.length > 0) {
            //     const targetTower = creep.pos.findClosestByPath(towersNeedingEnergy);
            //     if (creep.transfer(targetTower, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            //         creep.moveTo(targetTower);
            //     }
            //     return; // skip repairing this tick
            // }

            // Only repair if all towers are full
            actions.repairDamagedStructures(creep);
        } else {
            const src = actions.findEnergySource(creep);
            if (src) {
                if (creep.withdraw(src, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(src);
                }
            }
        }
    }
};

module.exports = roleRepairer;

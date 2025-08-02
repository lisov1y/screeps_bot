const actions = require("./actions");

const roleBuilder = {
    run: function(creep) {
        if (creep.memory.building && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.building = false;
        }
        if (!creep.memory.building && creep.store.getFreeCapacity() === 0) {
            creep.memory.building = true;
        }

        if (creep.memory.building) {
            actions.buildConstruction(creep);
        } else {
            // If energy is stored in excess somewhere
            if (actions.findStoredEnergy(creep)) {
                const storage = actions.findStoredEnergy(creep);
                if(creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage);
                }
            } else {
                actions.harvestEnergy(creep);
            }
        }
    }
};

module.exports = roleBuilder;
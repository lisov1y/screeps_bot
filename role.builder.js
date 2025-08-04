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
            const src = actions.findEnergySource(creep);
            if (src) {
                const result = creep.withdraw(src, RESOURCE_ENERGY);
                if (result === ERR_NOT_IN_RANGE) {
                    creep.moveTo(src);
                }
            }

        }
    }
};

module.exports = roleBuilder;
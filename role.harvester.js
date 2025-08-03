const actions = require("./actions");

const roleHarvester = {

    run: function(creep, creepCount) {
        if (creep.memory.harvesting && creep.store.getFreeCapacity() === 0) {
            creep.memory.harvesting = false;
        }
        if (!creep.memory.harvesting && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.harvesting = true;
        }

        if (creep.memory.harvesting) {
            actions.harvestEnergy(creep)
        } else {
            actions.transferEnergy(creep);
        }
    },
};



module.exports = roleHarvester;
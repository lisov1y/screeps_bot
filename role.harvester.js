const actions = require("./actions");

const roleHarvester = {

    run: function(creep) {
        if (creep.memory.harvesting && creep.store.getFreeCapacity() === 0) {
            creep.memory.harvesting = false;
        }
        if (!creep.memory.harvesting && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.harvesting = true;
        }

        if (creep.memory.harvesting) {
            actions.harvestEnergy(creep);
        } else {
            actions.transferEnergy(creep);
        }
    },


    /** @param {Creep} creep **/
    findConstructionSite: function(creep) {
        const containerSites = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (containerSites.length === 0) {
            return null;
        }
            return containerSites[0];
        }
};



module.exports = roleHarvester;
const roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.building && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.building && creep.store.getFreeCapacity() === 0) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if (creep.memory.building) {
            this.buildConstruction(creep);
        } else {
            this.harvestEnergy(creep);
        }
    },

    /** @param {Creep} creep **/
    buildConstruction: function(creep) {
        const target = this.findConstructionSite(creep);
        if (target) {
            if (creep.build(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
    },

    /** @param {Creep} creep **/
    harvestEnergy: function(creep) {
        const target = this.findEnergySource(creep);
        if (target) {
            if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE || creep.harvest(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    },

    /** @param {Creep} creep **/
    findEnergySource: function(creep) {
        let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_CONTAINER ||
                        structure.structureType === STRUCTURE_STORAGE) &&
                        structure.store[RESOURCE_ENERGY] > 0;
            }
        });

        if (!target) {
            target = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        }

        return target;
    },

    /** @param {Creep} creep **/
    findConstructionSite: function(creep) {
        const constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (constructionSites.length === 0) {
            return null;
        }
        return constructionSites[0];
    },
};

module.exports = roleBuilder;
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

        // Prioritize construction sites based on distance, building progress, and importance
        constructionSites.sort((a, b) => {
            const distanceA = creep.pos.getRangeTo(a);
            const distanceB = creep.pos.getRangeTo(b);
            const progressA = a.progress / a.progressTotal;
            const progressB = b.progress / b.progressTotal;
            const importanceA = this.getConstructionImportance(a);
            const importanceB = this.getConstructionImportance(b);

            return (importanceB - importanceA) || (progressA - progressB) || (distanceA - distanceB);
        });

        return constructionSites[0];
    },

    /** @param {ConstructionSite} site **/
    getConstructionImportance: function(site) {
        switch (site.structureType) {
            case STRUCTURE_SPAWN:
                return 3;
            case STRUCTURE_EXTENSION:
                return 2;
            case STRUCTURE_TOWER:
                return 1;
            default:
                return 0;
        }
    }
};

module.exports = roleBuilder;
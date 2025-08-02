const roleBuilder = {

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
        const droppedEnergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
            filter: resource => resource.resourceType === RESOURCE_ENERGY && resource.amount > 0
        });
        if (droppedEnergy) {
            if (creep.pickup(droppedEnergy) === ERR_NOT_IN_RANGE) {
                creep.moveTo(droppedEnergy, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
        if (!creep.memory.targetSource) {
            const sources = creep.room.find(FIND_SOURCES);
            const closestSource = creep.pos.findClosestByPath(sources);
            creep.memory.targetSource = closestSource.id;
        }
        const source = Game.getObjectById(creep.memory.targetSource);
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
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
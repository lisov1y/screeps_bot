const actions = {

    /* Getting energy */
    pickupDroppedEnergy: function(creep) {
        const droppedEnergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
            filter: resource => resource.resourceType === RESOURCE_ENERGY && resource.amount > 0
        });
        if (droppedEnergy) {
            if (creep.pickup(droppedEnergy) === ERR_NOT_IN_RANGE) {
                creep.moveTo(droppedEnergy);
            }
        }
    },
    harvestEnergy: function(creep) {
        actions.pickupDroppedEnergy(creep);
        if (!creep.memory.targetSource) {
            const sources = creep.room.find(FIND_SOURCES);
            const closestSource = creep.pos.findClosestByPath(sources);
            creep.memory.targetSource = closestSource.id;
        }
        const source = Game.getObjectById(creep.memory.targetSource);
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
    },
    findStoredEnergy: function(creep) {
        let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_CONTAINER ||
                        structure.structureType === STRUCTURE_STORAGE) &&
                    structure.store[RESOURCE_ENERGY] > 0;
            }
        });
        return target ? target : 0;
    },
    findEnergySource: function(creep) {
        // Find the closest container or storage with energy
        let target = this.findStoredEnergy(creep);
        // If no container or storage is found, find the closest active source
        if (target === 0) {
            target = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        }
        return target;
    },
    transferEnergy: function(creep) {
        const targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER ||
                        structure.structureType == STRUCTURE_CONTAINER) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        if (targets.length > 0) {
            if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
            }
        } else {
            this.buildConstruction(creep);
        }
    },
    transferEnergyEmergency: function(creep) {
        const targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
            }
        });
        console.log(targets[0]);
        if (targets.length > 0) {
            if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
            }
        }
    },

    /* Building */
    buildConstruction: function(creep) {
        const target = this.findConstructionSite(creep);
        if (target) {
            if (creep.build(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    },
    findConstructionSite: function(creep) {
        const constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES, {
            filter: site => (site.structureType === STRUCTURE_EXTENSION ||
                site.structureType === STRUCTURE_TOWER ||
                site.structureType === STRUCTURE_CONTAINER ||
                site.structureType === STRUCTURE_STORAGE ||
                site.structureType === STRUCTURE_ROAD)
        });
        return constructionSites[0] ? constructionSites[0] : 0;
    },

    /* Maintenance */
    findDamagedStructure: function(creep) {
        return creep.room.find(FIND_MY_STRUCTURES, {
            filter: structure => structure.hits < structure.hitsMax
        });
    },

    /** @param {Creep} creep **/
    repairDamagedStructures: function(creep) {
        const target = this.findDamagedStructure(creep);
        if (target) {
            if (creep.repair(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    },

}

module.exports = actions;
const utils = require("./utils");


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
            let closestSource = creep.pos.findClosestByPath(sources);
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
        let target = utils.getExtensions(creep);
        if (!target) {
            target = utils.getSpawns(creep);
        }
        if (!target && creep.memory.role === "repairer") {
            target = utils.getTowers(creep);
        }
        if (!target) {
            target = utils.getContainers(creep);
        }
        if (!target) {
            target = utils.getStorages(creep);
        }
        if (target) {
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        } else {
            this.buildConstruction(creep);
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
        const constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);
        return constructionSites[0] ? constructionSites[0] : 0;
    },

    /* Maintenance */
    findDamagedStructure: function(creep) {
        const priorities = [
            STRUCTURE_SPAWN,
            STRUCTURE_EXTENSION,
            STRUCTURE_TOWER,
            STRUCTURE_CONTAINER,
            STRUCTURE_STORAGE,
            STRUCTURE_ROAD,
            STRUCTURE_RAMPART,
            STRUCTURE_WALL,
        ];

        const damagedStructures = creep.room.find(FIND_STRUCTURES, {
            filter: structure => {
                if (structure.hits >= structure.hitsMax) return false;

                // Only repair walls below 1 million hits
                if (structure.structureType === STRUCTURE_WALL && structure.hits > 250000) {
                    return false;
                }

                return true;
            }
        });

        // Sort by priority
        damagedStructures.sort((a, b) => {
            const aPriority = priorities.indexOf(a.structureType);
            const bPriority = priorities.indexOf(b.structureType);

            return aPriority - bPriority;
        });

        return damagedStructures;
    },

    /** @param {Creep} creep **/
    repairDamagedStructures: function(creep) {
        const target = this.findDamagedStructure(creep)[0];
        if (target) {
            if (creep.repair(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    },


}

module.exports = actions;
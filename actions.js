const utils = require("./utils");

const actions = {
    /* Energy Acquisition */
    pickupDroppedEnergy: function(creep) {
        const droppedEnergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
            filter: resource => resource.resourceType === RESOURCE_ENERGY && resource.amount > 0
        });

        if (droppedEnergy && creep.pickup(droppedEnergy) === ERR_NOT_IN_RANGE) {
            creep.moveTo(droppedEnergy);
        }
    },

    harvestEnergy: function(creep) {
        this.pickupDroppedEnergy(creep);

        if (!creep.memory.targetSource) {
            const sources = creep.room.find(FIND_SOURCES);
            const closest = creep.pos.findClosestByPath(sources);
            if (closest) {
                creep.memory.targetSource = closest.id;
            }
        }

        const source = Game.getObjectById(creep.memory.targetSource);
        if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
    },

    findStoredEnergy: function(creep) {
        return creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: structure =>
                (structure.structureType === STRUCTURE_CONTAINER ||
                 structure.structureType === STRUCTURE_STORAGE) &&
                structure.store[RESOURCE_ENERGY] > 0
        }) || 0;
    },

    findEnergySource: function(creep) {
        let target = this.findStoredEnergy(creep);
        if (!target) {
            target = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        }
        return target;
    },

    transferEnergy: function(creep) {
        let target = utils.getExtensions(creep)
            || utils.getSpawns(creep)
            || (creep.memory.role === "repairer" && utils.getTowers(creep))
            || utils.getContainers(creep)
            || utils.getStorages(creep);

        if (target) {
            if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        } else {
            this.buildConstruction(creep);
        }
    },

    /* Building */
    buildConstruction: function(creep) {
        const target = this.findConstructionSite(creep);
        if (target && creep.build(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    },

    findConstructionSite: function(creep) {
        const sites = creep.room.find(FIND_CONSTRUCTION_SITES);
        return sites[0] || 0;
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
            STRUCTURE_WALL
        ];

        const damaged = creep.room.find(FIND_STRUCTURES, {
            filter: s => {
                if (s.hits >= s.hitsMax) return false;
                if (s.structureType === STRUCTURE_WALL && s.hits > 250000) return false;
                return true;
            }
        });

        damaged.sort((a, b) => {
            return priorities.indexOf(a.structureType) - priorities.indexOf(b.structureType);
        });

        return damaged;
    },

    repairDamagedStructures: function(creep) {
        const target = this.findDamagedStructure(creep)[0];
        if (target && creep.repair(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
};

module.exports = actions;

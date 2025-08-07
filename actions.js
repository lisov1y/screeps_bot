const utils = require("./utils");

const actions = {
    /** ========== HELPER METHODS ========== */
    moveToIfNotInRange(creep, target, color = '#ffffff') {
        if (creep.moveTo && target) {
            creep.moveTo(target, {
                visualizePathStyle: { stroke: color }
            });
        }
    },

    transferIfNotInRange(creep, target, resource = RESOURCE_ENERGY) {
        if (creep.transfer(target, resource) === ERR_NOT_IN_RANGE) {
            this.moveToIfNotInRange(creep, target, '#ffffff');
        }
    },

    withdrawIfNotInRange(creep, target, resource = RESOURCE_ENERGY) {
        if (creep.withdraw(target, resource) === ERR_NOT_IN_RANGE) {
            this.moveToIfNotInRange(creep, target, '#ffaa00');
        }
    },

    /** ========== ENERGY ACQUISITION ========== */
    pickupDroppedEnergy(creep) {
        const dropped = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
            filter: r => r.resourceType === RESOURCE_ENERGY && r.amount > 0
        });

        if (dropped && creep.pickup(dropped) === ERR_NOT_IN_RANGE) {
            this.moveToIfNotInRange(creep, dropped, '#ffaa00');
        }
    },

    harvestEnergy(creep) {
        this.pickupDroppedEnergy(creep);

        if (!creep.memory.targetSource) {
            const closest = creep.pos.findClosestByPath(FIND_SOURCES);
            if (closest) creep.memory.targetSource = closest.id;
        }

        const source = Game.getObjectById(creep.memory.targetSource);
        if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
            this.moveToIfNotInRange(creep, source, '#ffaa00');
        }
    },

    findStoredEnergy(creep) {
        return creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: s => [STRUCTURE_CONTAINER, STRUCTURE_STORAGE].includes(s.structureType) &&
                s.store[RESOURCE_ENERGY] > 0
        });
    },

    findEnergySource(creep) {
        return this.findStoredEnergy(creep) || creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    },

    transferEnergy(creep) {
        let target =
            utils.getExtensions(creep) ||
            utils.getSpawns(creep) ||
            (creep.memory.role === "repairer" && utils.getTowers(creep)) ||
            utils.getContainers(creep) ||
            utils.getStorages(creep);

        if (target) {
            this.transferIfNotInRange(creep, target);
        } else {
            this.buildConstruction(creep);
        }
    },

    /** ========== BUILDING ========== */
    findConstructionSite(creep) {
        return creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES) || null;
    },

    buildConstruction(creep) {
        const site = this.findConstructionSite(creep);
        if (site && creep.build(site) === ERR_NOT_IN_RANGE) {
            this.moveToIfNotInRange(creep, site, '#00ff00');
        }
    },

    /** ========== REPAIRING ========== */
    findDamagedStructure(creep) {
        const PRIORITY = [
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
            filter: s =>
                s.hits < s.hitsMax &&
                !(s.structureType === STRUCTURE_WALL && s.hits > 250000)
        });

        damaged.sort((a, b) =>
            PRIORITY.indexOf(a.structureType) - PRIORITY.indexOf(b.structureType)
        );

        return damaged;
    },

    repairDamagedStructures(creep) {
        const target = this.findDamagedStructure(creep)[0];
        if (target && creep.repair(target) === ERR_NOT_IN_RANGE) {
            this.moveToIfNotInRange(creep, target, '#00ffff');
        }
    },

    /** ========== HAULER LOGIC ========== */
    manageHaulerState(creep) {
        const isEmpty = creep.store[RESOURCE_ENERGY] === 0;
        const isFull = creep.store.getFreeCapacity() === 0;

        if (creep.memory.hauling && isEmpty) {
            creep.memory.hauling = false;
        } else if (!creep.memory.hauling && isFull) {
            creep.memory.hauling = true;
        }
    },

    runHauler(creep) {
        this.manageHaulerState(creep);

        if (creep.memory.hauling) {
            const towers = creep.room.find(FIND_STRUCTURES, {
                filter: s =>
                    s.structureType === STRUCTURE_TOWER &&
                    s.store[RESOURCE_ENERGY] < s.store.getCapacity(RESOURCE_ENERGY)
            });

            const target = creep.pos.findClosestByPath(towers);
            if (target) this.transferIfNotInRange(creep, target);
        } else {
            const source = this.findStoredEnergy(creep);
            if (source) this.withdrawIfNotInRange(creep, source);
        }
    }
};

module.exports = actions;

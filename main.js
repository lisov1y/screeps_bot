const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleRepairer = require('./role.repairer');

const SPAWN_NAME = "Spawn1";
const MIN_HARVESTERS = 2;
const MIN_UPGRADERS = 2;
const MIN_BUILDERS = 2;
const MIN_REPAIRERS = 1;
const CREEP_BODY = [WORK, CARRY, MOVE];
const CREEP_COST = 200;

module.exports.loop = function () {
    cleanUpMemory();
    spawnCreepsIfNeeded();
    runCreeps();
};

function cleanUpMemory() {
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
}

function spawnCreepsIfNeeded() {
    const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
    const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');
    const builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');
    const repairers = _.filter(Game.creeps, (creep) => creep.memory.role === 'repairer');

    const energyAvailable = getRoomEnergyAvailable(Game.spawns[SPAWN_NAME].room)
    const maxRoomEnergy = Game.spawns[SPAWN_NAME].maxRoomEnergy;
    const roomLevel = Game.spawns[SPAWN_NAME].room.controller.level;
    const constructionSites = Game.spawns[SPAWN_NAME].room.find(FIND_CONSTRUCTION_SITES);

    if (maxRoomEnergy === 300 || harvesters.length === 0 || roomLevel === 1) {
        if (harvesters.length < MIN_HARVESTERS && energyAvailable >= CREEP_COST) {
            spawnCreep('harvester', CREEP_BODY);
        } else if (upgraders.length < MIN_UPGRADERS && energyAvailable >= CREEP_COST && harvesters.length > 1) {
            spawnCreep('upgrader', CREEP_BODY);
        } else if (builders.length < MIN_BUILDERS && energyAvailable >= CREEP_COST && roomLevel >= 2 && constructionSites.length > 0 && harvesters.length > 1) {
            spawnCreep('builder', CREEP_BODY);
        }
    } else {
        if (harvesters.length < MIN_HARVESTERS && energyAvailable >= 500) {
            spawnCreep('harvester', [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE]);
        } else if (upgraders.length < 3 && energyAvailable >= 500 && harvesters.length > 1) {
            spawnCreep('upgrader', [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE]);
        } else if (builders.length < MIN_BUILDERS && energyAvailable >= 500 && harvesters.length > 1 && constructionSites.length > 0) {
            spawnCreep('builder', [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE]);
        } else if (repairers.length < MIN_REPAIRERS && energyAvailable >= 500 && harvesters.length >= 2) {
            spawnCreep('repairer', [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]);
        }
    }
}

function spawnCreep(role, body) {
    const newName = `${role.charAt(0)}${Game.time}`;
    console.log(`Spawning new ${role}: ${newName}`);
    Game.spawns[SPAWN_NAME].spawnCreep(body, newName, { memory: { role: role } });
}

function runCreeps(harvesters) {
    for (let name in Game.creeps) {
        const creep = Game.creeps[name];
        if (creep.memory.role === 'harvester') {
            roleHarvester.run(creep, harvesters);
        } else if (creep.memory.role === 'upgrader') {
            roleUpgrader.run(creep);
        } else if (creep.memory.role === 'builder') {
            roleBuilder.run(creep);
        } else if (creep.memory.role === 'repairer') {
            roleRepairer.run(creep);
        }
    }
}

function getRoomEnergyAvailable(room) {
    const structures = room.find(FIND_STRUCTURES, {
        filter: s =>
            (s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_EXTENSION)
    });

    return structures.reduce((sum, s) => sum + s.store[RESOURCE_ENERGY], 0);
}

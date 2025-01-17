const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');

const SPAWN_NAME = "Main";
const MIN_HARVESTERS = 2;
const MIN_UPGRADERS = 2;
const MIN_BUILDERS = 2;
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

    const energyAvailable = Game.spawns[SPAWN_NAME].energy;
    const roomLevel = Game.spawns[SPAWN_NAME].room.controller.level;
    const constructionSites = Game.spawns[SPAWN_NAME].room.find(FIND_CONSTRUCTION_SITES);

    if (harvesters.length < MIN_HARVESTERS && energyAvailable >= CREEP_COST) {
        spawnCreep('harvester');
    } else if (upgraders.length < MIN_UPGRADERS && energyAvailable >= CREEP_COST) {
        spawnCreep('upgrader');
    } else if (builders.length < MIN_BUILDERS && energyAvailable >= CREEP_COST && roomLevel >= 2 && constructionSites.length > 0) {
        spawnCreep('builder');
    }
}

function spawnCreep(role) {
    const newName = `${role.charAt(0).toUpperCase() + role.slice(1)}${Game.time}`;
    console.log(`Spawning new ${role}: ${newName}`);
    Game.spawns[SPAWN_NAME].spawnCreep(CREEP_BODY, newName, { memory: { role: role } });
}

function runCreeps() {
    for (let name in Game.creeps) {
        const creep = Game.creeps[name];
        if (creep.memory.role === 'harvester') {
            roleHarvester.run(creep);
        } else if (creep.memory.role === 'upgrader') {
            roleUpgrader.run(creep);
        } else if (creep.memory.role === 'builder') {
            roleBuilder.run(creep);
        }
    }
}
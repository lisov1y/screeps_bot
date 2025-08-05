const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleRepairer = require('./role.repairer');
const towerManager = require('towerManager');
const roomVisuals = require('./roomVisuals');

const SPAWN_NAME = "Spawn1";

const ROLES = {
    harvester: {
        min: 2,
        bodies: [
            [WORK, CARRY, MOVE], // RCL 1
            [WORK, WORK, CARRY, CARRY, MOVE, MOVE], // RCL 2
            [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE], // RCL 3
        ]
    },
    upgrader: {
        min: 2,
        bodies: [
            [WORK, CARRY, MOVE],
            [WORK, WORK, CARRY, MOVE, MOVE],
            [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE],
        ]
    },
    builder: {
        min: 2,
        bodies: [
            [WORK, CARRY, MOVE],
            [WORK, WORK, CARRY, MOVE, MOVE],
            [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE],
        ]
    },
    repairer: {
        min: 2,
        bodies: [
            [WORK, CARRY, MOVE],
            [WORK, CARRY, CARRY, MOVE, MOVE],
            [WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        ]
    }
};

module.exports.loop = function () {
    cleanUpMemory();
    spawnCreepsIfNeeded();
    runCreeps();
    roomVisuals.drawEnv();
    towerManager.runTowers(Game.rooms[Game.spawns[SPAWN_NAME].room.name]);
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
    const room = Game.spawns[SPAWN_NAME].room;
    const energyAvailable = room.energyAvailable;
    const energyCapacity = room.energyCapacityAvailable;
    const controllerLevel = room.controller.level;
    const constructionSites = room.find(FIND_CONSTRUCTION_SITES);

    const counts = {
        harvester: _.filter(Game.creeps, c => c.memory.role === 'harvester').length,
        upgrader: _.filter(Game.creeps, c => c.memory.role === 'upgrader').length,
        builder: _.filter(Game.creeps, c => c.memory.role === 'builder').length,
        repairer: _.filter(Game.creeps, c => c.memory.role === 'repairer').length,
    };

    const rolePriority = ['harvester', 'upgrader', 'builder', 'repairer'];

    for (const role of rolePriority) {
        const config = ROLES[role];
        const current = counts[role];
        const hasMinHarvesters = counts.harvester >= 2;

        if (role !== 'harvester' && !hasMinHarvesters) continue; // block spawning non-harvesters

        if (role === 'builder' && constructionSites.length === 0) continue;
        if (role === 'repairer' && controllerLevel < 2) continue;

        if (current < config.min || (role === 'upgrader' && current < 5)) {
            const tier = Math.min(controllerLevel - 1, config.bodies.length - 1);
            const body = config.bodies[tier];
            const cost = body.reduce((sum, part) => sum + BODYPART_COST[part], 0);

            if (energyAvailable >= cost) {
                spawnCreep(role, body);
                break; // spawn only one per tick
            }
        }
    }
}


function spawnCreep(role, body) {
    const name = `${role.charAt(0)}${Game.time}`;
    console.log(`Spawning new ${role}: ${name}`);
    Game.spawns[SPAWN_NAME].spawnCreep(body, name, { memory: { role: role } });
}

function runCreeps() {
    for (let name in Game.creeps) {
        const creep = Game.creeps[name];
        switch (creep.memory.role) {
            case 'harvester':
                roleHarvester.run(creep);
                break;
            case 'upgrader':
                roleUpgrader.run(creep);
                break;
            case 'builder':
                roleBuilder.run(creep);
                break;
            case 'repairer':
                roleRepairer.run(creep);
                break;
        }
    }
}
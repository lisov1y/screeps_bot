const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleRepairer = require('role.repairer');
const roleHauler = require('role.hauler');
const towerManager = require('towerManager');
const roomVisuals = require('roomVisuals');

const ROLES = {
    harvester: {
        min: 2,
        bodies: [
            [WORK, CARRY, MOVE],
            [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
            [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
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
        min: 1,
        bodies: [
            [WORK, CARRY, MOVE],
            [WORK, CARRY, CARRY, MOVE, MOVE],
            [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        ]
    },
    hauler: {
        min: 1,
        bodies: [
            [CARRY, CARRY, MOVE],
            [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
            [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        ]
    }
};

module.exports.loop = function () {
    cleanUpMemory();

    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];

        if (!room.controller || !room.controller.my) continue; // skip unclaimed

        spawnCreepsIfNeeded(room);
        roomVisuals.drawEnv(room); // pass room so visuals can be dynamic
        towerManager.runTowers(room);
    }

    runCreeps();
};

function cleanUpMemory() {
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('🗑️ Cleared memory of:', name);
        }
    }
}

function spawnCreepsIfNeeded(room) {
    const spawns = room.find(FIND_MY_SPAWNS, { filter: s => !s.spawning });
    if (spawns.length === 0) return;

    const energyAvailable = room.energyAvailable;
    const controllerLevel = room.controller.level;
    const constructionSites = room.find(FIND_CONSTRUCTION_SITES);
    const towers = room.find(FIND_STRUCTURES, { filter: s => s.structureType === STRUCTURE_TOWER });

    const counts = _.countBy(
        _.filter(Game.creeps, c => c.memory.role && c.room.name === room.name),
        c => c.memory.role
    );

    const rolePriority = ['harvester', 'hauler', 'upgrader', 'builder', 'repairer'];

    for (const role of rolePriority) {
        const config = ROLES[role];
        const current = counts[role] || 0;
        const hasMinHarvesters = (counts.harvester || 0) >= 2;

        if (role !== 'harvester' && !hasMinHarvesters) continue;
        if (role === 'builder' && constructionSites.length === 0) continue;
        if (role === 'repairer' && controllerLevel < 2) continue;
        if (role === 'hauler' && towers.length === 0) continue;

        const shouldSpawn = current < config.min || (role === 'upgrader' && current < 5);
        if (!shouldSpawn) continue;

        const tier = Math.min(controllerLevel - 1, config.bodies.length - 1);
        const body = config.bodies[tier];
        const cost = body.reduce((sum, part) => sum + BODYPART_COST[part], 0);

        if (energyAvailable >= cost) {
            const spawn = spawns[0]; // just pick first available
            spawnCreep(spawn, role, body);
            break;
        }
    }
}

function spawnCreep(spawn, role, body) {
    const name = `${role.charAt(0).toUpperCase()}${Game.time}`;
    console.log(`🚼 Spawning new ${role}: ${name} in ${spawn.room.name}`);
    spawn.spawnCreep(body, name, {
        memory: {
            role: role
        }
    });
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
            case 'hauler':
                roleHauler.run(creep);
                break;
        }
    }
}

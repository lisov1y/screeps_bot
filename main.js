var spawn = "Main";
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {

    // Clean up memory of dead creeps
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // Spawn new creeps if needed
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');

    var energyAvailable = Game.spawns[spawn].energy;
    var roomLevel = Game.spawns[spawn].room.controller.level;

    if(harvesters.length < 2 && energyAvailable >= 200) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns[spawn].spawnCreep([WORK, CARRY, MOVE], newName, 
            {memory: {role: 'harvester'}});
    }
    else if(upgraders.length < 2 && energyAvailable >= 200) {
        var newName = 'Upgrader' + Game.time;
        console.log('Spawning new upgrader: ' + newName);
        Game.spawns[spawn].spawnCreep([WORK, CARRY, MOVE], newName, 
            {memory: {role: 'upgrader'}});
    }
    else if(builders.length < 2 && energyAvailable >= 200 && roomLevel >= 2) {
        var newName = 'Builder' + Game.time;
        console.log('Spawning new builder: ' + newName);
        Game.spawns[spawn].spawnCreep([WORK, CARRY, MOVE], newName, 
            {memory: {role: 'builder'}});
    }

    // Run the creeps
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}
module.exports = {
    runTowers(room) {
        const towers = room.find(FIND_MY_STRUCTURES, {
            filter: structure => structure.structureType === STRUCTURE_TOWER
        });

        for (const tower of towers) {
            // First: Look for enemies
            const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (closestHostile) {
                tower.attack(closestHostile);
                continue; // Skip repair if attacking
            }

            // Otherwise: Repair important structures
            // const repairTarget = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            //     filter: structure => {
            //         if (structure.structureType === STRUCTURE_WALL || structure.structureType === STRUCTURE_RAMPART) {
            //             return structure.hits < 250000; // only repair if very low
            //         }
            //         return (
            //             structure.hits < structure.hitsMax &&
            //             (
            //                 structure.structureType === STRUCTURE_ROAD ||
            //                 structure.structureType === STRUCTURE_CONTAINER ||
            //                 structure.structureType === STRUCTURE_EXTENSION ||
            //                 structure.structureType === STRUCTURE_SPAWN ||
            //                 structure.structureType === STRUCTURE_STORAGE ||
            //                 structure.structureType === STRUCTURE_TOWER
            //             )
            //         );
            //     }
            // });

            // if (repairTarget) {
            //     tower.repair(repairTarget);
            // }
        }
    }
};

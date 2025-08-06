const roomVisuals = {
    drawEnv: function() {
        Game.rooms["E43S57"].visual.text("🐈‍⬛", 36, 32, {
            color: 'white',
            font: 0.8,
            align: 'center'
        });
        Game.rooms["E43S57"].visual.text("🐈‍", 37, 32, {
            color: 'white',
            font: 0.8,
            align: 'center',
        });
        Game.rooms["E43S57"].visual.text("⚖️ Trader's Outpost ⚖️", 37, 1, {
            color: 'white',
            font: 0.8,
            align: 'center',
        });
        Game.rooms["E43S57"].visual.text("Everyone is welcome!", 33, 3, {
            color: 'white',
            font: 0.8,
            align: 'center',
        });
        Game.rooms["E43S57"].visual.text("EXCEPT INVADERS!", 41, 3, {
            color: 'red',
            font: 0.8,
            align: 'center',
        });
        Game.rooms["E43S57"].visual.text("⛔", 43, 32, {
            color: 'white',
            font: 0.8,
            align: 'center',
        });
        Game.rooms["E43S57"].visual.text("⚡", 35, 31, {
            color: 'white',
            font: 1,
            align: 'center',
        });
        Game.rooms["E43S57"].visual.text("⚡", 22, 16, {
            color: 'white',
            font: 1,
            align: 'center',
        });
        Game.rooms["E43S57"].visual.text("📡", 10, 8, {
            color: 'white',
            font: 1,
            align: 'center',
        });
        Game.rooms["E43S57"].visual.text("🐸", 48, 39, {
            color: 'white',
            font: 0.5,
            align: 'center',
        });
        Game.rooms["E43S57"].visual.text("🌺", 48, 39, {
            color: 'white',
            font: 0.5,
            align: 'left',
        });
        Game.rooms["E43S57"].visual.text("🐸", 42, 22, {
            color: 'white',
            font: 0.7,
            align: 'center',
        });
        Game.rooms["E43S57"].visual.text("🐸", 44, 11, {
            color: 'white',
            font: 0.4,
            align: 'center',
        });
        Game.rooms["E43S57"].visual.text("Wanna say hi? Discord: ", 35, 38, {
            color: 'white',
            font: 0.4,
            align: 'center',
        });
        Game.rooms["E43S57"].visual.text("shishberry.", 39, 38, {
            color: 'red',
            font: 0.4,
            align: 'right',
        });
    }
}

module.exports = roomVisuals;
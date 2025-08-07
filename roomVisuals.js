const roomVisuals = {
    drawEnv: function() {
        const room = Game.rooms["E43S57"];
        const visual = room.visual;

        // Header & Welcome Text
        visual.text("⚖️ The Citadel of Harmony ⚖️", 37, 1, {
            color: 'white',
            font: 1.2,
            align: 'center',
        });

        visual.text("Visitors Welcome", 32, 3, {
            color: '#7CFC00',
            font: 0.9,
            align: 'center',
        });

        visual.text("🚫 Except Invaders 🚫", 45, 3, {
            color: 'red',
            font: 0.9,
            align: 'right',
        });

        // Towers/Defenses
        visual.text("🛡️", 40, 34, { font: 1, align: 'center' });

        // Energy Source Indicators
        visual.text("⚡", 35, 31, { color: 'yellow', font: 1.2, align: 'center' });
        visual.text("⚡", 22, 16, { color: 'yellow', font: 1.2, align: 'center' });

        // Fun & Personality
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
        visual.text("🐸", 48, 39, { font: 0.8, align: 'center' });
        visual.text("🌸", 48, 39, { font: 0.8, align: 'left' });
        visual.text("🐸", 42, 22, { font: 0.7, align: 'center' });
        visual.text("🛰️", 10, 8, { font: 1, align: 'center' });
        visual.text("🧿", 44, 11, { font: 0.8, align: 'center' });

        // Footer / Contact
        visual.text("Wanna say hi?", 34, 38, {
            color: '#DDDDDD',
            font: 0.6,
            align: 'center',
        });

        visual.text("Discord: shishberry.", 41.5, 38, {
            color: 'red',
            font: 0.6,
            align: 'right',
        });
        visual.text("⛩️", 43, 31, { font: 1 });

    }
};

module.exports = roomVisuals;

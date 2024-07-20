// server.js
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

const territories = {
    1: { name: 'Northern Tundra', resources: 'Fur', population: 2000 },
    2: { name: 'Eastern Mountains', resources: 'Iron', population: 5000 },
    3: { name: 'Southern Desert', resources: 'Oil', population: 3000 },
    4: { name: 'Western Forest', resources: 'Wood', population: 8000 },
    5: { name: 'Central Plains', resources: 'Wheat', population: 12000 },
    6: { name: 'Northeastern Highlands', resources: 'Gems', population: 4000 },
    7: { name: 'Eastern Coast', resources: 'Fish', population: 10000 },
    8: { name: 'Southeastern Savannah', resources: 'Gold', population: 6000 },
    9: { name: 'Southern Coast', resources: 'Pearls', population: 5000 },
    10: { name: 'Southwestern Hills', resources: 'Copper', population: 7000 },
    11: { name: 'Central Lakes', resources: 'Freshwater', population: 9000 },
    12: { name: 'Northern Bay', resources: 'Seafood', population: 3000 },
    13: { name: 'Western Peninsula', resources: 'Salt', population: 2000 },
    14: { name: 'Eastern Plateau', resources: 'Coal', population: 4000 }
};
// Simplified battle simulation
function simulateBattle(army1,army2,territories) {

    const terint = Math.floor(Math.random() * Object.keys(territories).length) + 1;
    console.log(terint);
    const battleground = territories[terint];
    
    const terrainFactor = getTerrainFactor(battleground.name);

    const rounds = 5;
    let battleReport = `Battle in ${battleground.name}:<br><br>`;

    for (let i = 0; i < rounds; i++) {
        battleReport += `Round ${i + 1}:<br>`;
        
        // Calculate combat effectiveness
        const effectiveness1 = calculateEffectiveness(army1, terrainFactor);
        const effectiveness2 = calculateEffectiveness(army2, terrainFactor);

        // Simulate casualties
        const casualties1 = simulateCasualties(army2, effectiveness1);
        const casualties2 = simulateCasualties(army1, effectiveness2);

        applyLosses(army1, casualties2);
        applyLosses(army2, casualties1);

        // Update supplies and morale
        updateSuppliesAndMorale(army1,casualties1);
        updateSuppliesAndMorale(army2,casualties2);

        battleReport += `Army 1: ${reportArmyStatus(army1)}<br>`;
        battleReport += `Army 2: ${reportArmyStatus(army2)}<br><br>`;
    }

    // Determine winner
    const totalStrength1 = calculateTotalStrength(army1);
    const totalStrength2 = calculateTotalStrength(army2);

    if (totalStrength1 > totalStrength2) {
        battleReport += "Army 1 is victorious!";
    } else if (totalStrength2 > totalStrength1) {
        battleReport += "Army 2 is victorious!";
    } else {
        battleReport += "The battle ends in a draw!";
    }

    return battleReport;
}

function getTerrainFactor(terrainName) {
    const terrainFactors = {
        "Northern Tundra": { infantry: 0.8, cavalry: 0.6, artillery: 0.9 },
        "Eastern Mountains": { infantry: 1.2, cavalry: 0.5, artillery: 0.7 },
        "Southern Desert": { infantry: 0.9, cavalry: 1.1, artillery: 1.0 },
        "Western Forest": { infantry: 1.1, cavalry: 0.7, artillery: 0.8 },
        "Central Plains": { infantry: 1.0, cavalry: 1.2, artillery: 1.1 },
        // Add factors for other terrains...
    };
    return terrainFactors[terrainName] || { infantry: 1, cavalry: 1, artillery: 1 };
}

function calculateEffectiveness(army, terrainFactor) {
    const baseEffectiveness = 
        (army.infantry * terrainFactor.infantry) +
        (army.cavalry * 1.5 * terrainFactor.cavalry) +
        (army.artillery * 2 * terrainFactor.artillery);
    
    return baseEffectiveness * (army.morale / 100) * (1 + army.experience / 100) * (army.supplies / 100);
}

function simulateCasualties(enemyArmy, effectiveness) {
    const totalEnemyUnits = enemyArmy.infantry + enemyArmy.cavalry + enemyArmy.artillery;
    const casualtyRate = effectiveness / (totalEnemyUnits * 10);
    return {
        infantry: Math.floor(enemyArmy.infantry * casualtyRate) || 0,
        cavalry: Math.floor(enemyArmy.cavalry * casualtyRate) || 0,
        artillery: Math.floor(enemyArmy.artillery * casualtyRate || 0)
    };
}

function applyLosses(army, casualties) {
    army.infantry = Math.max(0, army.infantry - casualties.infantry);
    army.cavalry = Math.max(0, army.cavalry - casualties.cavalry);
    army.artillery = Math.max(0, army.artillery - casualties.artillery);
}

function updateSuppliesAndMorale(army, casualties) {
    // Supplies decrease each round
    army.supplies = Math.max(0, army.supplies - 10);

    // Morale is affected by casualties and supplies
    const totalUnits = army.infantry + army.cavalry + army.artillery;
    const casualtyRate = 1 - (totalUnits / (totalUnits + casualties.infantry + casualties.cavalry + casualties.artillery));
    army.morale = Math.max(0, army.morale - (casualtyRate * 20) - (10 - army.supplies / 10));

    // Experience increases slightly each round
    army.experience = Math.min(100, army.experience + 2);
}

function calculateTotalStrength(army) {
    return army.infantry + (army.cavalry * 1.5) + (army.artillery * 2);
}

function reportArmyStatus(army) {
    return `Infantry: ${army.infantry || 0}, Cavalry: ${army.cavalry || 0}, Artillery: ${army.artillery || 0}, ` +
           `Supplies: ${army.supplies || 0}%, Morale: ${(army.morale || 0).toFixed(1)}%`;
}

// Endpoint for battle simulation
app.post('/simulate', (req, res) => {
    const { army1, army2 } = req.body;
    const result = simulateBattle(army1, army2,territories);
    res.json(result);
});


// Endpoint for territory information
app.get('/territory/:id', (req, res) => {
    const id = req.params.id;
    const ter = getTerrainFactor(territories[id].name);
    console.log(ter);
    res.json(territories[id] || { error: 'Territory not found' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

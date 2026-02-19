const fs = require('fs');
const path = require('path');

const teamsPath = path.join(__dirname, '../src/config/teams.json');
const teams = require(teamsPath);

function generateSecret() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const updatedTeams = teams.map(t => ({
    ...t,
    secretCode: generateSecret()
}));

fs.writeFileSync(teamsPath, JSON.stringify(updatedTeams, null, 2));
console.log('Secret codes randomized.');

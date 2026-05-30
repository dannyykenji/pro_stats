const pool = require('../config/database');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

function getDownloadsDir() {
  const possiblePaths = [
    path.join(__dirname, '..', '..', 'downloads'), 
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  const rootPath = path.resolve(__dirname, '../../../downloads');
  if (fs.existsSync(rootPath)) return rootPath;

  throw new Error(`Downloads directory not found in any expected path. Checked paths: ${possiblePaths.join(', ')}`);
}

function normalizePlayerData(rawPlayer, leagueOverride) {
  const keys = Object.keys(rawPlayer);
  const findKey = (patterns) => keys.find(k => patterns.some(p => k.toLowerCase().includes(p.toLowerCase())));

  const nameKey = findKey(['player', 'name', 'summoner']);
  const teamKey = findKey(['team', 'org']);
  const positionKey = findKey(['pos', 'position', 'role', 'lane']);
  const gamesKey = findKey(['gp', 'matches']);
  const winPercentageKey = findKey(['w%']);
  const kdaKey = findKey(['kda']);
  const kpKey = findKey(['kp', 'kill participation']);
  const goldKey = findKey(['egpm', 'gold@10', 'gpm', 'gold/min']);
  const dpmKey = findKey(['dpm', 'damage per minute']);
  const cspmKey = findKey(['cspm', 'cs per minute', 'cs/min']);

  const gamesPlayed = parseInt(rawPlayer[gamesKey]) || 0;
  let winPercentage = 0;
  if (winPercentageKey && rawPlayer[winPercentageKey]) {
    winPercentage = parseFloat(String(rawPlayer[winPercentageKey]).replace('%', '')) || 0;
  }

  return {
    name: (rawPlayer[nameKey] || 'Unknown').trim(),
    team_name: rawPlayer[teamKey] ? String(rawPlayer[teamKey]).trim() : null,
    position: rawPlayer[positionKey] ? String(rawPlayer[positionKey]).trim() : null,
    games_played: gamesPlayed,
    kda: parseFloat(rawPlayer[kdaKey]) || 0,
    kill_participation: parseFloat(rawPlayer[kpKey]) || 0,
    gold_per_min: parseFloat(rawPlayer[goldKey]) || 0,
    dpm: parseFloat(rawPlayer[dpmKey]) || 0,
    cspm: parseFloat(rawPlayer[cspmKey]) || 0,
    win_percentage: winPercentage,
    league: leagueOverride,
    real_name: rawPlayer.real_name || null,
    image_url: rawPlayer.image_url || null
  };
}

function normalizeTeamData(rawTeam, leagueOverride) {
  const keys = Object.keys(rawTeam);
  const findKey = (patterns) => keys.find(k => patterns.some(p => k.toLowerCase().includes(p)));

  const nameKey = findKey(['team', 'name', 'org']);
  const gamesKey = findKey(['games', 'gp', 'matches']);
  const winsKey = findKey(['wins', 'w']);
  const lossesKey = findKey(['losses', 'l']);

  return {
    name: (rawTeam[nameKey] || 'Unknown').trim(),
    games_played: parseInt(rawTeam[gamesKey]) || 0,
    wins: parseInt(rawTeam[winsKey]) || 0,
    losses: parseInt(rawTeam[lossesKey]) || 0,
    league: leagueOverride,
    logo_url: rawTeam.logo_url || null
  };
}

function normalizeChampionData(rawChampion, leagueOverride) {
  const keys = Object.keys(rawChampion);
  const findKey = (patterns) => keys.find(k => {
    const keyLower = k.toLowerCase();
    return patterns.some(p => keyLower === p.toLowerCase() || keyLower.includes(p.toLowerCase()));
  });

  const championKey = findKey(['champion', 'champ', 'name']);
  const roleKey = findKey(['pos', 'lane', 'position']);
  const gamesKey = findKey(['games', 'gp', 'matches']);
  const winPercentageKey = findKey(['w%', 'win%', 'win percentage']);
  const banPercentageKey = findKey(['b%', 'ban%', 'ban percentage', 'bans %']);
  const killsKey = findKey(['kills', 'k']);
  const deathsKey = findKey(['deaths', 'd']);
  const assistsKey = findKey(['assists', 'a']);
  const iconKey = findKey(['icon', 'image', 'url']);

  let winPercentage = 0;
  if (winPercentageKey && rawChampion[winPercentageKey]) {
    winPercentage = parseFloat(String(rawChampion[winPercentageKey]).replace('%', '')) || 0;
  }

  let banPercentage = 0;
  if (banPercentageKey && rawChampion[banPercentageKey]) {
    banPercentage = parseFloat(String(rawChampion[banPercentageKey]).replace('%', '')) || 0;
  }

  return {
    champion_name: (rawChampion[championKey] || 'Unknown').trim(),
    role: (rawChampion[roleKey] || 'UNKNOWN').trim().toUpperCase(),
    games_played: parseInt(rawChampion[gamesKey]) || 0,
    win_percentage: winPercentage,
    ban_percentage: banPercentage,
    kills: parseInt(rawChampion[killsKey]) || 0,
    deaths: parseInt(rawChampion[deathsKey]) || 0,
    assists: parseInt(rawChampion[assistsKey]) || 0,
    icon_url: rawChampion[iconKey] ? String(rawChampion[iconKey]).trim() : null,
    league: leagueOverride
  };
}

async function savePlayersToDB(players, league) {
  if (!players || players.length === 0) return;

  console.log(`Inserting ${players.length} player records for ${league}...`);

  for (const player of players) {
    const safeWinPercentage = Math.min(Math.max(player.win_percentage || 0, 0), 100);

    const query = `
      INSERT INTO players (name, team_name, position, league, games_played, kda, kill_participation, gold_per_min, dpm, cspm, win_percentage, real_name, image_url, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())
      ON CONFLICT (name, league) DO UPDATE SET
        team_name = EXCLUDED.team_name,
        position = EXCLUDED.position,
        games_played = EXCLUDED.games_played,
        kda = EXCLUDED.kda,
        kill_participation = EXCLUDED.kill_participation,
        gold_per_min = EXCLUDED.gold_per_min,
        dpm = EXCLUDED.dpm,
        cspm = EXCLUDED.cspm,
        win_percentage = EXCLUDED.win_percentage,
        real_name = COALESCE(EXCLUDED.real_name, players.real_name),
        image_url = COALESCE(EXCLUDED.image_url, players.image_url),
        updated_at = NOW()
    `;

    const values = [
      player.name,
      player.team_name,
      player.position,
      player.league,
      player.games_played,
      player.kda,
      player.kill_participation,
      player.gold_per_min,
      player.dpm,
      player.cspm,
      safeWinPercentage,
      player.real_name || null,
      player.image_url || null
    ];

    await pool.query(query, values);
  }
}

async function saveTeamsToDB(teams, league) {
  if (!teams || teams.length === 0) return;

  console.log(`Inserting ${teams.length} team records for ${league}...`);

  for (const team of teams) {
    const query = `
      INSERT INTO teams (name, league, games_played, wins, losses, logo_url, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      ON CONFLICT (name, league) DO UPDATE SET
        games_played = EXCLUDED.games_played,
        wins = EXCLUDED.wins,
        losses = EXCLUDED.losses,
        logo_url = COALESCE(EXCLUDED.logo_url, teams.logo_url),
        updated_at = NOW()
    `;

    const values = [
      team.name,
      team.league,
      team.games_played,
      team.wins,
      team.losses,
      team.logo_url || null
    ];

    await pool.query(query, values);
  }
}

async function saveChampionStatsToDB(champions, league) {
  if (!champions || champions.length === 0) return;

  console.log(`Inserting ${champions.length} champion records for ${league}...`);

  for (const champ of champions) {
    const query = `
      INSERT INTO champion_stats (champion_name, role, league, games_played, win_percentage, ban_percentage, total_kills, total_deaths, total_assists, icon_url, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
      ON CONFLICT (champion_name, role, league) DO UPDATE SET
        games_played = EXCLUDED.games_played,
        win_percentage = EXCLUDED.win_percentage,
        ban_percentage = EXCLUDED.ban_percentage,
        total_kills = EXCLUDED.total_kills,
        total_deaths = EXCLUDED.total_deaths,
        total_assists = EXCLUDED.total_assists,
        icon_url = COALESCE(EXCLUDED.icon_url, champion_stats.icon_url),
        updated_at = NOW()
    `;

    const values = [
      champ.champion_name,
      champ.role,
      champ.league,
      champ.games_played || 0,
      champ.win_percentage || 0,
      champ.ban_percentage || 0,
      champ.kills || 0,
      champ.deaths || 0,
      champ.assists || 0,
      champ.icon_url || null
    ];

    await pool.query(query, values);
  }
}

function extractLeagueFromFilename(filename) {
  const nameWithoutExt = filename.replace(/\.csv$/i, '');
  const parts = nameWithoutExt.split(/[_\.]/);
  const knownLeagues = ['lcs', 'lec', 'lck', 'lpl', 'cblol'];

  for (const part of parts) {
    if (knownLeagues.includes(part.toLowerCase())) {
      return part.toUpperCase();
    }
  }
  if (parts.length >= 2) {
    return parts[1].toUpperCase();
  }

  return 'GLOBAL';
}

async function runExtractionFromCSV() {
  let downloadsDir;
  try {
    downloadsDir = getDownloadsDir();
  } catch (error) {
    console.error('CRITICAL ERROR:', error.message);
    process.exit(1);
  }

  console.log(`Reading files from: ${downloadsDir}`);

  if (!fs.existsSync(downloadsDir)) {
    console.error('Downloads directory does not exist at this path.');
    process.exit(1);
  }
  const files = fs.readdirSync(downloadsDir)
    .filter(f => f.endsWith('.csv'))
    .sort(); 
  if (files.length === 0) {
    console.warn('No CSV files found in the downloads directory.');
    return;
  }
  console.log(`Found ${files.length} CSV files: ${files.join(', ')}`);
  const dataToProcess = {
    players: {}, 
    teams: {},
    champions: {}
  };

  for (const file of files) {
    const filePath = path.join(downloadsDir, file);
    const league = extractLeagueFromFilename(file);

    console.log(`\nProcessing file: ${file} | League detected: ${league}`);

    const results = [];
    try {
      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', resolve)
          .on('error', reject);
      });
    } catch (err) {
      console.error(`Error reading ${file}:`, err.message);
      continue;
    }

    if (results.length === 0) continue;
    const fileNameLower = file.toLowerCase();
    if (fileNameLower.includes('player')) {
      if (!dataToProcess.players[league]) dataToProcess.players[league] = [];

      results.forEach(r => {
        const normalized = normalizePlayerData(r, league);
        dataToProcess.players[league].push(normalized);
      });
    } else if (fileNameLower.includes('team')) {
      if (!dataToProcess.teams[league]) dataToProcess.teams[league] = [];

      results.forEach(r => {
        const normalized = normalizeTeamData(r, league);
        dataToProcess.teams[league].push(normalized);
      });
    } else if (fileNameLower.includes('champ')) {
      if (!dataToProcess.champions[league]) dataToProcess.champions[league] = [];

      results.forEach(r => {
        const normalized = normalizeChampionData(r, league);
        dataToProcess.champions[league].push(normalized);
      });
    }
  }

  const aggregatePlayers = (list) => {
    const map = new Map();
    list.forEach(p => {
      if (map.has(p.name)) {
        const existing = map.get(p.name);
        const oldGames = existing.games_played;
        const newGames = p.games_played;
        const totalGames = oldGames + newGames;

        existing.games_played = totalGames;
        existing.kda = ((existing.kda * oldGames) + (p.kda * newGames)) / totalGames;
        existing.gold_per_min = ((existing.gold_per_min * oldGames) + (p.gold_per_min * newGames)) / totalGames;
        existing.dpm = ((existing.dpm * oldGames) + (p.dpm * newGames)) / totalGames;
        existing.cspm = ((existing.cspm * oldGames) + (p.cspm * newGames)) / totalGames;
        existing.win_percentage = ((existing.win_percentage * oldGames) + (p.win_percentage * newGames)) / totalGames;

        if (p.team_name) existing.team_name = p.team_name;
        if (p.image_url) existing.image_url = p.image_url;
      } else {
        map.set(p.name, { ...p });
      }
    });
    return Array.from(map.values());
  };

  for (const [league, players] of Object.entries(dataToProcess.players)) {
    const aggregated = aggregatePlayers(players);
    await savePlayersToDB(aggregated, league);
    console.log(`Players of ${league} processed (${aggregated.length} unique).`);
  }

  for (const [league, teams] of Object.entries(dataToProcess.teams)) {
    const teamMap = new Map();
    teams.forEach(t => {
      if (teamMap.has(t.name)) {
        const ex = teamMap.get(t.name);
        ex.games_played += t.games_played;
        ex.wins += t.wins;
        ex.losses += t.losses;
      } else {
        teamMap.set(t.name, { ...t });
      }
    });
    await saveTeamsToDB(Array.from(teamMap.values()), league);
    console.log(`Teams of ${league} processed.`);
  }

  for (const [league, champs] of Object.entries(dataToProcess.champions)) {
    const champMap = new Map();
    champs.forEach(c => {
      const key = `${c.champion_name}-${c.role}`;
      if (champMap.has(key)) {
        const ex = champMap.get(key);
        ex.games_played += c.games_played;
        ex.kills += c.kills;
        ex.deaths += c.deaths;
        ex.assists += c.assists;
      } else {
        champMap.set(key, { ...c });
      }
    });
    await saveChampionStatsToDB(Array.from(champMap.values()), league);
    console.log(`Champions of ${league} processed.`);
  }

  console.log('\nData extraction and database update completed successfully.');
}

module.exports = {
  runExtractionFromCSV,
  savePlayersToDB,
  saveTeamsToDB,
  saveChampionStatsToDB
};

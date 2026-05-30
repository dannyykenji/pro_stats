const express = require('express');
const router = express.Router();
const { getTeams, getTeamById, getPlayers, getPlayerById, getChampionStats, getTotalPlayersCount, getLastUpdateTime, getMaxStats } = require('../controllers/statsController');

router.get('/teams', getTeams);
router.get('/teams/:league', getTeams);
router.get('/team/:id', getTeamById);

router.get('/players', getPlayers);
router.get('/players/:league', getPlayers);
router.get('/player/:id', getPlayerById);

router.get('/champions', getChampionStats);

router.get('/total-players', getTotalPlayersCount);
router.get('/last-update', getLastUpdateTime);
router.get('/max-stats', getMaxStats);

module.exports = router;
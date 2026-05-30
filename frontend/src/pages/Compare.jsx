import { useState, useEffect } from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

ChartJS.register(RadialLinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

export function Compare() {
  const [allPlayers, setAllPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [player1Id, setPlayer1Id] = useState('');
  const [player2Id, setPlayer2Id] = useState('');
  const { t } = useLanguage();

  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const data = await api.getAllPlayers();
        setAllPlayers(data);
      } catch (error) {

      } finally {
        setLoading(false);
      }
    };
    loadPlayers();
  }, []);

  const player1 = allPlayers.find(p => p.id === player1Id);
  const player2 = allPlayers.find(p => p.id === player2Id);

  const normalizeValue = (value, type) => {
    if (!value) return 0;

    if ((type === 'kp' || type === 'wr') && value < 1) {
      return value * 100;
    }
    return value;
  };

  const getLocalMax = (stat, p1Val, p2Val) => {
    if (stat === 'kp' || stat === 'wr') return 100;
    const maxVal = Math.max(p1Val, p2Val);
    return maxVal === 0 ? 1 : maxVal * 1.1; 
  };

  const p1 = {
    kda: normalizeValue(player1?.kda, 'kda'),
    csPerMin: normalizeValue(player1?.csPerMin, 'cs'),
    kp: normalizeValue(player1?.kp, 'kp'),
    wr: normalizeValue(player1?.wr, 'wr'),
    damage: normalizeValue(player1?.damage, 'dpm'),
    gold: normalizeValue(player1?.gold, 'gold'),
  };

  const p2 = {
    kda: normalizeValue(player2?.kda, 'kda'),
    csPerMin: normalizeValue(player2?.csPerMin, 'cs'),
    kp: normalizeValue(player2?.kp, 'kp'),
    wr: normalizeValue(player2?.wr, 'wr'),
    damage: normalizeValue(player2?.damage, 'dpm'),
    gold: normalizeValue(player2?.gold, 'gold'),
  };

  const radarData = {
    labels: ['KDA', 'CS/min', 'KP%', 'WR%', 'DPM', 'Gold per Min'],
    datasets: [
      {
        label: player1?.name || 'Player 1',
        data:player1 && player2 ? [
          (p1.kda / getLocalMax('kda', p1.kda, p2.kda)) * 100,
          (p1.csPerMin / getLocalMax('cs', p1.csPerMin, p2.csPerMin)) * 100,
          Math.min(100, p1.kp), 
          Math.min(100, p1.wr), 
          (p1.damage / getLocalMax('dpm', p1.damage, p2.damage)) * 100,
          (p1.gold / getLocalMax('gold', p1.gold, p2.gold)) * 100,
        ] : [0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(240, 192, 64, 0.2)',
        borderColor: 'rgba(240, 192, 64, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(240, 192, 64, 1)',
      },
      {
        label: player2?.name || 'Player 2',
        data: player1 && player2 ? [
          (p2.kda / getLocalMax('kda', p1.kda, p2.kda)) * 100,
          (p2.csPerMin / getLocalMax('cs', p1.csPerMin, p2.csPerMin)) * 100,
          Math.min(100, p2.kp), 
          Math.min(100, p2.wr), 
          (p2.damage / getLocalMax('dpm', p1.damage, p2.damage)) * 100,
          (p2.gold / getLocalMax('gold', p1.gold, p2.gold)) * 100,
        ] : [0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(10, 200, 185, 0.2)',
        borderColor: 'rgba(10, 200, 185, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(10, 200, 185, 1)',
      },
    ],
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#9CA3AF', font: { size: 12 } },
      },
      title: {
        display: true,
        text: t('statsComparison'),
        color: '#F0C040',
        font: { size: 16, weight: 'bold' },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const index = context.dataIndex;
            const value = context.raw; 
            const labels = ['KDA', 'CS/min', 'KP%', 'WR%', 'DPM', 'Gold per Min'];

            if (index === 2 || index === 3) {
              return `${labels[index]}: ${value.toFixed(1)}%`;
            }

            let realValue = 0;
            const playerData = context.datasetIndex === 0 ? p1 : p2;
            if (playerData) {
              realValue = index === 0 ? playerData.kda :
                         index === 1 ? playerData.csPerMin :
                         index === 4 ? playerData.damage : playerData.gold;
            }

            return `${labels[index]}: ${realValue.toFixed(index === 1 ? 1 : 0)}`;
          }
        }
      },
    },
    scales: {
      r: {
        angleLines: { color: 'rgba(55, 65, 81, 0.5)' },
        grid: { color: 'rgba(55, 65, 81, 0.5)' },
        pointLabels: { color: '#9CA3AF', font: { size: 11 } },
        ticks: {
          display: false,
        },
        max: 100,
      },
    },
  };

  if (loading) {
    return (
      <div className="pt-24 pb-12 min-h-screen animate-fadeIn">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-shimmer h-96 bg-gradient-to-r from-dark-100 via-dark-200 to-dark-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 min-h-screen animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display font-bold text-3xl text-white mb-8">
          <span className="text-gradient bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
            {t('comparePlayers')}
          </span>
        </h1>

        {}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm text-gray-400 mb-2">{t('player1')}</label>
            <select
              value={player1Id}
              onChange={(e) => setPlayer1Id(e.target.value)}
              className="w-full bg-dark-100 border border-gray-700/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-600/40"
            >
              <option value="">{t('select')}</option>
              {allPlayers.map(p => (
                <option key={p.id} value={p.id}>{p.name} - {p.team}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">{t('player2')}</label>
            <select
              value={player2Id}
              onChange={(e) => setPlayer2Id(e.target.value)}
              className="w-full bg-dark-100 border border-gray-700/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-600/40"
            >
              <option value="">{t('select')}</option>
              {allPlayers.map(p => (
                <option key={p.id} value={p.id}>{p.name} - {p.team}</option>
              ))}
            </select>
          </div>
        </div>

        {player1 && player2 && (
          <>
            {}
            <div className="bg-dark-100 border border-gray-700/30 rounded-2xl p-6 mb-8 h-96">
              <Radar data={radarData} options={radarOptions} />
            </div>

            {}
            <div className="grid md:grid-cols-3 gap-6">
              {}
              <div className="bg-gradient-to-br from-gold-600/10 to-dark-100 border border-gold-600/30 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-6">
                  {player1.image_url ? (
                    <img
                      src={player1.image_url}
                      alt={player1.name}
                      className="w-16 h-16 rounded-full object-cover border border-gold-600/30"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-400/20 to-gold-600/20 border border-gold-600/30 flex items-center justify-center text-2xl">
                      {player1.teamLogo}
                    </div>
                  )}
                  <div>
                    <h3 className="font-display font-bold text-xl text-white">{player1.name}</h3>
                    <p className="text-gray-400 text-sm">{player1.team} • {player1.role}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <StatRow label="KDA" value={p1.kda.toFixed(2)} />
                  <StatRow label="CS/min" value={p1.csPerMin.toFixed(1)} />
                  <StatRow label="KP%" value={`${p1.kp}%`} />
                  <StatRow label="WR%" value={`${p1.wr}%`} highlight={p1.wr >= 60} />
                  <StatRow label="Partidas" value={player1.games} />
                </div>
              </div>

              {}
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-dark-200 border border-gray-700/30 flex items-center justify-center">
                  <span className="font-display font-black text-2xl text-gray-500">VS</span>
                </div>
              </div>

              {}
              <div className="bg-gradient-to-br from-accent-blue/10 to-dark-100 border border-accent-blue/30 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-6">
                  {player2.image_url ? (
                    <img
                      src={player2.image_url}
                      alt={player2.name}
                      className="w-16 h-16 rounded-full object-cover border border-accent-blue/30"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-blue/20 to-accent-blue/30 border border-accent-blue/30 flex items-center justify-center text-2xl">
                      {player2.teamLogo}
                    </div>
                  )}
                  <div>
                    <h3 className="font-display font-bold text-xl text-white">{player2.name}</h3>
                    <p className="text-gray-400 text-sm">{player2.team} • {player2.role}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <StatRow label="KDA" value={p2.kda.toFixed(2)} />
                  <StatRow label="CS/min" value={p2.csPerMin.toFixed(1)} />
                  <StatRow label="KP%" value={`${p2.kp}%`} />
                  <StatRow label="WR%" value={`${p2.wr}%`} highlight={p2.wr >= 60} />
                  <StatRow label="Partidas" value={player2.games} />
                </div>
              </div>
            </div>
          </>
        )}

        {!player1 && !player2 && (
          <div className="text-center py-16 text-gray-500">
            {t('selectTwoPlayers')}
          </div>
        )}
      </div>
    </div>
  );
}

function StatRow({ label, value, highlight }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-700/20 last:border-0">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className={`font-display font-bold ${highlight ? 'text-green-400' : 'text-white'}`}>
        {value}
      </span>
    </div>
  );
}
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export const utilRadarCharts = (playerStats, playerName, comparisonStats = null, comparisonName = null) => {
  const maxLimits = {
    Goals: 40,
    Assists: 30,
    Shots: 150,
    Dribbles: 100,
    Tackles: 100,
  };

  const datasets = [
    {
      label: playerName,
      data: [
        (playerStats.goals || 0) / maxLimits.Goals * 100,
        (playerStats.assists || 0) / maxLimits.Assists * 100,
        (playerStats.shots || 0) / maxLimits.Shots * 100,
        (playerStats.dribbleSuccess || 0) / maxLimits.Dribbles * 100,
        (playerStats.tackles || 0) / maxLimits.Tackles * 100,
      ],
      backgroundColor: "rgba(54, 162, 235, 0.40)",
      borderColor: "rgba(54, 162, 235, 0.6)",
      borderWidth: 2,
      pointBackgroundColor: "rgb(4, 173, 224)",
    },
  ];

  if (comparisonStats && comparisonName) {
    datasets.push({
      label: comparisonName,
      data: [
        (comparisonStats.goals || 0) / maxLimits.Goals * 100,
        (comparisonStats.assists || 0) / maxLimits.Assists * 100,
        (comparisonStats.shots || 0) / maxLimits.Shots * 100,
        (comparisonStats.dribbleSuccess || 0) / maxLimits.Dribbles * 100,
        (comparisonStats.tackles || 0) / maxLimits.Tackles * 100,
      ],
      backgroundColor: "rgba(255, 251, 20, 0.4)",
      borderColor: "rgba(193, 226, 6, 0.6)",
      borderWidth: 2,
      pointBackgroundColor: "rgb(251, 255, 0)",
    });
  }

  return {
    labels: ["Goals", "Assists", "Shots", "Dribbles", "Tackles"],
    datasets,
  };
};


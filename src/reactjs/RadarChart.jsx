import { Tooltip } from "chart.js";
import { Radar } from "react-chartjs-2";

export default function RadarChart({ chartData }) {
  const options = {
    maintainAspectRatio: false, 
    scales: {
      r: {
        angleLines: { color: "#888" }, 
        grid: { color: "#999" }, 
        pointLabels: { color: "#f0f0f0", font: { size: 12 } }, 
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          display: false, 
        },
      },
    },
    plugins: {
      legend: {
        display: false,
        labels: {
          color: "#f0f0f0", 
          font: { size: 12 },
        },
      },
      tooltip: {
        enabled: false,
      },
    },
    elements: {
      line: {
        borderWidth: 3, 
      },
      point: {
        radius: 5, 
        backgroundColor: "#fff", 
        borderColor: "#54a0ff",
      },
    },
  };

  return <Radar data={chartData} options={options} />;
}

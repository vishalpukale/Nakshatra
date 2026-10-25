import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,LogarithmicScale
} from "chart.js";

ChartJS.register(CategoryScale,LogarithmicScale, LinearScale, BarElement, Tooltip, Legend);

// ✅ Your function
function formatToShort(value) {
  if (value === null || value === undefined || value === "" || value === 0) return "--";

  const number = parseFloat(value);
  if (isNaN(number)) return "--";

  const absNumber = Math.abs(number);
  let formatted;

  if (absNumber >= 1_000_000_000_000) {
    formatted = (absNumber / 1_000_000_000_000).toFixed(2) + "T"; // Trillion
  } else if (absNumber >= 1_000_000_000) {
    formatted = (absNumber / 1_000_000_000).toFixed(2) + "B"; // Billion
  } else if (absNumber >= 1_000_000) {
    formatted = (absNumber / 1_000_000).toFixed(2) + "M"; // Million
  } else if (absNumber >= 1_000) {
    formatted = (absNumber / 1_000).toFixed(2) + "K"; // Thousand
  } else {
    formatted = absNumber.toFixed(2); // Regular number
  }

  // Add $ sign
  formatted = `${formatted}`;

  // Handle negative
  if (number < 0) return `(${formatted})`;

  return formatted;
}

const BarChart = ({ 
  dataSet, 
  chartTitle, 
  xAxisLabels,
  firstSeriesData,
  secondSeriesData,
  firstSeriesLabel,
  secondSeriesLabel,
  yAxisStepSize = 1,
  yAxisMaxValue = 5,
  useMillionFormat = false // 👈 condition flag
}) => {
  const staticData = {
    labels: xAxisLabels,
    datasets: [
      {
        label: firstSeriesLabel,
        data: firstSeriesData,
        backgroundColor: "#00C9A7",
        barPercentage: 0.6,
        borderRadius: 3,
        categoryPercentage: 0.6,
      },
      {
        label: secondSeriesLabel,
        data: secondSeriesData,
        backgroundColor: "#FF8682",
        barPercentage: 0.6,
        borderRadius: 3,
        categoryPercentage: 0.6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1f2937",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: (context) => {
            const rawValue = context.raw;
            return useMillionFormat
              ? `${context.dataset.label}: ${formatToShort(rawValue)}`
              : `${context.dataset.label}: ${rawValue}`;
          },
        },
      },
    },
    scales: {
      y: {
         type: "logarithmic",
        beginAtZero: true,
        max: yAxisMaxValue,
        ticks: {
          callback: function (value) {
            return useMillionFormat ? formatToShort(value) : value;
          },
          stepSize: yAxisStepSize,
          maxTicksLimit: 7,
          font: {
            size: window.innerWidth < 640 ? 10 : 12,
          },
        },
        grid: { 
          drawBorder: false, 
          color: "#f3f4f6",
          lineWidth: 1,
        },
        border: {
          display: false,
        },
      },
      x: {
        ticks: {
          font: {
            size: window.innerWidth < 640 ? 10 : 12,
          },
          maxRotation: window.innerWidth < 640 ? 45 : 0,
        },
        grid: { display: false },
        border: { display: false },
      },
    },
  };

  return (
    <div className="w-full ">
      {/* Header */}
      <div className="mb-3 sm:mb-4 md:mb-5">
        <span className="text-base text-[1.125rem] font-semibold text-gray-900 mb-1 sm:mb-2">
          {chartTitle}
        </span>
      </div>
      
      {/* Chart Container */}
      <div className="overflow-x-auto">
        <div className="h-40 sm:h-48 md:h-56 lg:h-64 min-w-[600px]">
          <Bar data={dataSet || staticData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default BarChart;

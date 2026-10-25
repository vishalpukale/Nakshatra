import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const CircularChart = ({ title, data, total = 0, useMillionFormat }) => {
  // 🔹 Handle dummy chart if no valid values
  const hasData = data && data.some((item) => item.value > 0);

  const pieChartColors = [
    "#3B82F6", // Blue - Strong primary
    "#EF4444", // Red - High contrast to blue
    "#10B981", // Green - Complements red
    "#F59E0B", // Orange - Warm contrast
    "#8B5CF6", // Purple - Cool balance
    "#06B6D4", // Cyan - Fresh contrast
    "#EC4899", // Pink - Vibrant accent
    "#84CC16", // Lime - Bright contrast
    "#F97316", // Orange Red - Warm variation
    "#6366F1", // Indigo - Deep cool

    "#14B8A6", // Teal - Mid contrast
    "#DC2626", // Deep Red - Strong accent
    "#7C3AED", // Deep Purple - Rich tone
    "#059669", // Emerald - Natural green
    "#D97706", // Amber - Warm mid-tone
    "#0284C7", // Sky Blue - Light contrast
    "#BE185D", // Deep Pink - Bold accent
    "#65A30D", // Green 600 - Earthy
    "#EA580C", // Orange 600 - Vibrant warm
    "#4F46E5", // Indigo 600 - Deep cool

    "#0891B2", // Light Blue - Fresh
    "#B91C1C", // Red 700 - Deep warm
    "#7E22CE", // Purple 700 - Royal
    "#047857", // Emerald 700 - Forest
    "#B45309", // Amber 700 - Golden
    "#0369A1", // Blue 700 - Ocean
    "#A21CAF", // Fuchsia 700 - Magenta
    "#4D7C0F", // Lime 700 - Natural
    "#C2410C", // Orange 700 - Rust
    "#3730A3", // Indigo 800 - Deep navy

    "#0E7490", // Cyan 700 - Teal blue
    "#991B1B", // Red 800 - Burgundy
    "#6B21A8", // Purple 800 - Deep violet
    "#065F46", // Emerald 800 - Deep forest
    "#92400E", // Amber 800 - Bronze
    "#1E40AF", // Blue 800 - Navy
    "#86198F", // Fuchsia 800 - Deep magenta
    "#365314", // Lime 800 - Dark olive
    "#9A3412", // Orange 800 - Burnt orange
    "#312E81", // Indigo 900 - Midnight

    "#164E63", // Cyan 800 - Deep teal
    "#7F1D1D", // Red 900 - Dark burgundy
    "#581C87", // Purple 900 - Royal purple
    "#064E3B", // Emerald 900 - Deep emerald
    "#78350F", // Amber 900 - Dark bronze
    "#1E3A8A", // Blue 900 - Dark navy
    "#701A75", // Fuchsia 900 - Plum
    "#1A2E05", // Lime 900 - Forest green
    "#7C2D12", // Orange 900 - Deep rust
    "#1E1B4B", // Indigo 950 - Almost black

    // Additional complementary colors for larger datasets
    "#FF6B6B", // Coral Red
    "#4ECDC4", // Turquoise
    "#45B7D1", // Sky Blue
    "#96CEB4", // Mint Green
    "#FFEAA7", // Light Yellow
    "#DDA0DD", // Plum
    "#98D8C8", // Seafoam
    "#F7DC6F", // Pale Gold
    "#BB8FCE", // Lavender
    "#85C1E9", // Light Blue

    "#F8C471", // Peach
    "#82E0AA", // Light Green
    "#F1948A", // Salmon
    "#AED6F1", // Powder Blue
    "#F9E79F", // Cream
    "#D7BDE2", // Light Purple
    "#A3E4D7", // Mint
    "#FAD7A0", // Beige
    "#D5A6BD", // Dusty Rose
    "#AED6F1", // Baby Blue

    "#E8DAEF", // Pale Lavender
    "#D1F2EB", // Pale Mint
    "#FCF3CF", // Ivory
    "#FADBD8", // Blush
    "#D6EAF8", // Ice Blue
    "#FEF9E7", // Cream White
    "#EBDEF0", // Light Lilac
    "#D0ECE7", // Pale Aqua
    "#FDF2E9", // Vanilla
    "#EAEDED", // Light Gray

    // Final neutrals and earth tones
    "#8D6E63", // Brown
    "#607D8B", // Blue Gray
    "#795548", // Deep Brown
    "#546E7A", // Steel Gray
    "#6D4C41", // Coffee
    "#455A64", // Dark Gray
    "#5D4037", // Chocolate
    "#37474F", // Charcoal
    "#4E342E", // Dark Chocolate
    "#263238", // Dark Slate

    // Muted pastels for final slots
    "#FFCDD2", // Light Pink
    "#F8BBD9", // Cotton Candy
    "#E1BEE7", // Pale Purple
    "#C5CAE9", // Light Indigo
    "#BBDEFB", // Pale Blue
    "#B2EBF2", // Light Cyan
    "#B2DFDB", // Pale Teal
    "#C8E6C9", // Light Green
    "#DCEDC8", // Pale Lime
    "#F0F4C3", // Light Yellow

    "#FFF9C4", // Pale Lemon
    "#FFECB3", // Light Amber
    "#FFE0B2", // Peach Cream
    "#FFCCBC", // Apricot
    "#D7CCC8", // Warm Gray
    "#CFD8DC", // Cool Gray
    "#ECEFF1", // Silver
    "#FAFAFA", // Off White
    "#F5F5F5", // Light Gray
    "#EEEEEE", // Pale Gray
  ];
  const chartData = {
    labels: hasData ? data.map((item) => item.label) : ["No Data"],
    datasets: [
      {
        data: hasData ? data.map((item) => item.value) : [1], // single slice dummy
        backgroundColor: hasData ? pieChartColors : ["#E5E7EB"], // gray-300 dummy
        borderWidth: 2,
      },
    ],
  };

  // 🔹 Always calculate total (even if 0)
  const computedTotal = hasData
    ? data.reduce((acc, item) => acc + item.value, 0)
    : 0;

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      padding: 10,
      bodySpacing: 6,
      boxPadding: 10,
      boxWidth: 12,
      boxHeight: 12,
      callbacks: {
        label: function (ctx) {
          const value = ctx.raw;

          // 👇 skip tooltip if value is 0
          if (value === 0) return "";

          const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
          const percent = total > 0 ? ((value / total) * 100).toFixed(0) : 0;

          const formattedValue = useMillionFormat
            ? formatToShort(value)
            : value;

          return [`${ctx.label}`, `${formattedValue} (${percent}%)`];
        },
      },
    },
  },
  cutout: "70%",
};

  const centerTextPlugin = {
    id: "centerText",
    beforeDraw: (chart, args, options) => {
      const {
        ctx,
        chartArea: { width, height, left, top },
      } = chart;
      ctx.save();

      const centerX = left + width / 2;
      const centerY = top + height / 2;

      ctx.font = "bold 18px Arial";
      ctx.fillStyle = "#111";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

     const displayTotal =
  options.total === 0
    ? "0"
    : useMillionFormat
    ? formatToShort(options.total || 0)
    : options.total || 0;

      ctx.fillText(displayTotal, centerX, centerY);

      ctx.restore();
    },
  };

  const legendItems = hasData ? data.slice(0, 3) : [];

function formatToShort(value) {
  if (value === null || value === undefined || value === "") return "--";

  const number = parseFloat(value);
  if (isNaN(number)) return "--";

  const absNumber = Math.abs(number);
  let formatted;

  if (absNumber >= 1_000_000_000_000) {
    formatted = (absNumber / 1_000_000_000_000).toFixed(2) + "T";
  } else if (absNumber >= 1_000_000_000) {
    formatted = (absNumber / 1_000_000_000).toFixed(2) + "B";
  } else if (absNumber >= 1_000_000) {
    formatted = (absNumber / 1_000_000).toFixed(2) + "M";
  } else if (absNumber >= 1_000) {
    formatted = (absNumber / 1_000).toFixed(2) + "K";
  } else {
    formatted = absNumber.toFixed(2);
  }

  // Add $ sign dynamically
  formatted = `$${formatted}`;

  if (number < 0) return `(${formatted})`;
  return formatted;
}
  return (
    <div className="flex h-full w-full max-w-md flex-wrap items-center justify-center gap-3 space-x-6 xl:flex-nowrap">
      {/* Chart */}
      <div className="relative m-auto h-36 w-36 md:h-27 lg:h-40 lg:w-40">
        <Doughnut
          data={chartData}
          options={{
            ...options,
            plugins: {
              ...options.plugins,
              centerText: { total: computedTotal },
            },
          }}
          plugins={[centerTextPlugin]}
        />
      </div>

      {/* Legend */}
      <div className="flex w-full flex-col space-y-2 text-sm min-h-[120px]">
        <h3 className="text-center font-semibold xl:text-left">{title}</h3>
        {legendItems.length > 0 ? (
          legendItems.map((item, idx) => {
            const percent =
              computedTotal > 0
                ? ((item.value / computedTotal) * 100).toFixed(0)
                : 0;

            const displayValue = useMillionFormat
              ? formatToShort(item.value)
              : item.value;

            return (
              <div
                key={idx}
                className="flex w-full flex-wrap items-center justify-between md:flex-nowrap"
              >
                <div className="flex items-center space-x-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{
                      backgroundColor:
                        chartData.datasets[0].backgroundColor[idx],
                    }}
                  />
                  <span className="text-gray-700">{item.label}</span>
                </div>
                <span className="text-gray-500">
                  {displayValue} ({percent}%)
                </span>
              </div>
            );
          })
        ) : (
          <span className="text-center text-gray-400 xl:text-left">
            No data available
          </span>
        )}
      </div>
    </div>
  );
};

export default CircularChart;

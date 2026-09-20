import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const colors = [
  "#10b981",
  "#06b6d4",
  "#f59e0b",
  "#f97316",
  "#ef4444",
];

function RiskDistributionChart({
  data,
}) {
  const chartData =
    data.filter(
      (item) =>
        item.count > 0,
    );

  return (
    <ResponsiveContainer
      width="100%"
      height={290}
    >
      <PieChart>
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="riskLevel"
          innerRadius={65}
          outerRadius={100}
          paddingAngle={3}
        >
          {chartData.map(
            (
              entry,
              index,
            ) => (
              <Cell
                key={
                  entry.riskLevel
                }
                fill={
                  colors[
                    index %
                      colors.length
                  ]
                }
              />
            ),
          )}
        </Pie>

        <Tooltip />

        <Legend
          verticalAlign="bottom"
          height={36}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default RiskDistributionChart;
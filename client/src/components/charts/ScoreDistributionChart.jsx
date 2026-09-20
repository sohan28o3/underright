import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function ScoreDistributionChart({
  data,
}) {
  return (
    <ResponsiveContainer
      width="100%"
      height={290}
    >
      <BarChart data={data}>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
        />

        <XAxis
          dataKey="range"
          tickLine={false}
          axisLine={false}
          fontSize={12}
        />

        <YAxis
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          fontSize={12}
        />

        <Tooltip />

        <Bar
          dataKey="count"
          fill="#0f172a"
          radius={[
            8,
            8,
            0,
            0,
          ]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default ScoreDistributionChart;
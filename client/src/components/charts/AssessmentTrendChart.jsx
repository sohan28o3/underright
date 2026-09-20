import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function AssessmentTrendChart({
  data,
}) {
  const formatted =
    data.map((item) => ({
      ...item,

      label:
        new Date(
          item.date,
        ).toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
          },
        ),
    }));

  return (
    <ResponsiveContainer
      width="100%"
      height={290}
    >
      <LineChart data={formatted}>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
        />

        <XAxis
          dataKey="label"
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

        <Line
          type="monotone"
          dataKey="count"
          stroke="#0f172a"
          strokeWidth={3}
          dot={{
            r: 4,
          }}
          activeDot={{
            r: 6,
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default AssessmentTrendChart;
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js"
import { Line, Bar, Pie } from "react-chartjs-2"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface ChartProps {
  data: number[]
  labels: string[]
  height?: number
}

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  }
}

export function LineChart({ data, labels, height = 300 }: ChartProps) {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        fill: true,
        tension: 0.4
      }
    ]
  }

  return (
    <div style={{ height }}>
      <Line data={chartData} options={defaultOptions} />
    </div>
  )
}

export function BarChart({ data, labels, height = 300 }: ChartProps) {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: "rgba(16, 185, 129, 0.8)",
        borderRadius: 4
      }
    ]
  }

  return (
    <div style={{ height }}>
      <Bar data={chartData} options={defaultOptions} />
    </div>
  )
}

export function PieChart({ data, labels, height = 300 }: ChartProps) {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: [
          "rgba(16, 185, 129, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(236, 72, 153, 0.8)",
          "rgba(245, 158, 11, 0.8)"
        ]
      }
    ]
  }

  const options = {
    ...defaultOptions,
    plugins: {
      ...defaultOptions.plugins,
      legend: {
        display: true,
        position: "bottom" as const
      }
    }
  }

  return (
    <div style={{ height }}>
      <Pie data={chartData} options={options} />
    </div>
  )
} 
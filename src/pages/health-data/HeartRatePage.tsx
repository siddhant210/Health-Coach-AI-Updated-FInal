// src/pages/HeartRatePage.tsx
import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

type HeartRateRecord = {
  id: number;
  created_at: string;
  value: number;
};

export default function HeartRatePage() {
  const [heartRateData, setHeartRateData] = useState<HeartRateRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'all'>('24h');
  const [currentHeartRate, setCurrentHeartRate] = useState<number | null>(null);

  useEffect(() => {
    fetchHeartRateData();
  }, [timeRange]);

  const fetchHeartRateData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Generate richer mock heart rate data based on timeRange
      const generateMock = (range: string) => {
        const data: HeartRateRecord[] = [];
        const now = new Date();
        let points = 0;
        if (range === '24h') points = 24; // hourly
        else if (range === '7d') points = 7 * 12; // 12 readings per day (~every 2h)
        else if (range === '30d') points = 30; // daily
        else points = 90; // fallback: 90 days

        for (let i = points - 1; i >= 0; i--) {
          const dt = new Date(now.getTime());
          if (range === '24h') dt.setHours(now.getHours() - i);
          else if (range === '7d') dt.setHours(now.getHours() - i * 2);
          else dt.setDate(now.getDate() - i);

          // synthetic variation
          const base = 70 + Math.round(6 * Math.sin(i / 3));
          const noise = Math.round((Math.random() - 0.5) * 8);
          const value = Math.max(45, Math.min(130, base + noise));

          data.push({
            id: data.length + 1,
            created_at: dt.toISOString(),
            value,
          });
        }

        return data;
      };

      const mockData = generateMock(timeRange);
      setHeartRateData(mockData);

      if (mockData && mockData.length > 0) {
        setCurrentHeartRate(mockData[mockData.length - 1].value);
      }

      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch heart rate data');
      setLoading(false);
    }
  };

  // Prepare chart data
  const chartData = {
    labels: heartRateData.map(item => new Date(item.created_at)), // Corrected column name
    datasets: [
      {
        label: 'Heart Rate (BPM)',
        data: heartRateData.map(item => item.value),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        pointRadius: 3,
        borderWidth: 2,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: timeRange === '24h' ? 'hour' : 'day',
          tooltipFormat: 'MMM d, yyyy h:mm a',
        },
        title: {
          display: true,
          text: 'Time'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Beats Per Minute (BPM)'
        },
        suggestedMin: 40,
        suggestedMax: 180
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.dataset.label}: ${context.raw} BPM`;
          }
        }
      }
    }
  };

  // Calculate statistics
  const averageHeartRate = heartRateData.length > 0 
    ? (heartRateData.reduce((sum, item) => sum + item.value, 0) / heartRateData.length).toFixed(1)
    : null;

  const maxHeartRate = heartRateData.length > 0 
    ? Math.max(...heartRateData.map(item => item.value))
    : null;

  const minHeartRate = heartRateData.length > 0 
    ? Math.min(...heartRateData.map(item => item.value))
    : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <p>Error loading heart rate data:</p>
        <p className="font-medium">{error}</p>
        <button 
          onClick={fetchHeartRateData}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Heart Rate Monitoring</h1>
      
      {/* Time range selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(['24h', '7d', '30d', 'all'] as const).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-md transition-colors ${
              timeRange === range
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {range === '24h' ? 'Last 24 Hours' : 
             range === '7d' ? 'Last 7 Days' : 
             range === '30d' ? 'Last 30 Days' : 
             'All Data'}
          </button>
        ))}
      </div>

      {/* Chart container */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="h-80">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Current" 
          value={currentHeartRate ? `${currentHeartRate} BPM` : '--'} 
          icon="❤️"
        />
        <StatCard 
          title="Average" 
          value={averageHeartRate ? `${averageHeartRate} BPM` : '--'} 
          icon="📊"
        />
        <StatCard 
          title="Maximum" 
          value={maxHeartRate ? `${maxHeartRate} BPM` : '--'} 
          icon="⬆️"
        />
        <StatCard 
          title="Minimum" 
          value={minHeartRate ? `${minHeartRate} BPM` : '--'} 
          icon="⬇️"
        />
      </div>

      {/* Data table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="text-xl font-semibold p-4 border-b">Recent Measurements</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Heart Rate (BPM)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {heartRateData.slice(-10).reverse().map((record) => (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(record.created_at).toLocaleString()} {/* Corrected column name */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={`px-2 py-1 rounded-full ${
                      record.value > 100 ? 'bg-red-100 text-red-800' : 
                      record.value < 60 ? 'bg-blue-100 text-blue-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      {record.value} BPM
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Stat card component
function StatCard({ title, value, icon }: { title: string; value: string; icon: string }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
      <div className="text-3xl mr-4">{icon}</div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
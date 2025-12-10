import { useEffect, useState } from 'react';
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
  Filler
} from 'chart.js';
import OwnerNav from '../../components/navbars/OwnerNav';
import '../../style/owner/owner.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface MonthlyRevenue {
  month_name: string;
  month_number: number;
  year: number;
  revenue: string;
  total_tickets: string;
}

interface Statistics {
  totalRevenue: number;
  totalTicketsSold: number;
  totalTheaters: number;
  totalMovies: number;
}

interface DashboardData {
  monthlyRevenue: MonthlyRevenue[];
  statistics: Statistics;
}

export default function OwnerDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const apiUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/owner/dashboard-stats`);

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const result = await response.json();

      if (result.success) {
        setDashboardData(result.data);
        setError(null);
      } else {
        throw new Error(result.message || 'Failed to load data');
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="owner-dashboard">
        <OwnerNav />
        <div className="dashboard-content">
          <div className="loading">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="owner-dashboard">
        <OwnerNav />
        <div className="dashboard-content">
          <div className="error">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="owner-dashboard">
        <OwnerNav />
        <div className="dashboard-content">
          <div className="error">No data available</div>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const chartData = {
    labels: dashboardData.monthlyRevenue.map(item => `${item.month_name} ${item.year}`),
    datasets: [
      {
        label: 'Revenue ($)',
        data: dashboardData.monthlyRevenue.map(item => parseFloat(item.revenue)),
        borderColor: '#00BCD4',
        backgroundColor: 'rgba(0, 188, 212, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#00BCD4',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#1C2541',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#00BCD4',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            return `Revenue: $${context.parsed.y.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#fff',
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#fff',
          font: {
            size: 11
          },
          callback: function(value: any) {
            return '$' + value;
          }
        },
        beginAtZero: true
      }
    }
  };

  const { statistics } = dashboardData;

  return (
    <div className="owner-dashboard">
      <OwnerNav />

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Statistics Cards Row */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">TOTAL TICKETS SOLD</div>
            <div className="stat-main">
              <div className="stat-number">{statistics.totalTicketsSold.toLocaleString()}</div>
            </div>
            <div className="stat-footer">All Time</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">TOTAL REVENUE</div>
            <div className="stat-main">
              <div className="stat-number">€{statistics.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div className="stat-footer">All Time</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">TOTAL THEATERS</div>
            <div className="stat-main">
              <div className="stat-number">{statistics.totalTheaters}</div>
            </div>
            <div className="stat-footer">Active</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">TOTAL MOVIES</div>
            <div className="stat-main">
              <div className="stat-number">{statistics.totalMovies}</div>
            </div>
            <div className="stat-footer">Available</div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="chart-section">
          <div className="chart-header">
            <h2>REVENUE OVERVIEW</h2>
            <p>Monthly Revenue Trend - Last 12 Months</p>
          </div>
          <div className="chart-container">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

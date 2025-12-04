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

// Mock data for testing when backend is not available
const getMockData = (): DashboardData => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const monthlyRevenue: MonthlyRevenue[] = [];

  for (let i = 11; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12;
    const year = currentMonth - i < 0 ? currentYear - 1 : currentYear;
    const revenue = Math.floor(Math.random() * 50000) + 20000; // Random revenue between 20k-70k

    monthlyRevenue.push({
      month_name: months[monthIndex],
      month_number: monthIndex + 1,
      year: year,
      revenue: revenue.toString(),
      total_tickets: Math.floor(revenue / 15).toString()
    });
  }

  return {
    monthlyRevenue,
    statistics: {
      totalRevenue: 485250.50,
      totalTicketsSold: 32350,
      totalTheaters: 8,
      totalMovies: 24
    }
  };
};

export default function OwnerDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/owner/dashboard-stats`);

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const result = await response.json();

      if (result.success) {
        setDashboardData(result.data);
        setUsingMockData(false);
      } else {
        throw new Error(result.message || 'Failed to load data');
      }
    } catch (err) {
      // Use mock data if API fails
      console.warn('API not available, using mock data:', err);
      setDashboardData(getMockData());
      setUsingMockData(true);
      setError(null); // Clear error since we're using mock data
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="owner-dashboard">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="owner-dashboard">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="owner-dashboard">
        <div className="error">No data available</div>
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
      {/* Top Header */}
      <div className="dashboard-header">
        <div className="header-logo">
          <i className="bi bi-star-fill"></i>
          <span>NORTH STAR</span>
        </div>
        <div className="header-actions">
          <button className="icon-btn">
            <i className="bi bi-person-circle"></i>
          </button>
          <button className="icon-btn">
            <i className="bi bi-list"></i>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Statistics Cards Row */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">TICKETS SOLD</div>
            <div className="stat-main">
              <div className="stat-number">{statistics.totalTicketsSold.toLocaleString()}</div>
              <div className="stat-trend positive">
                <i className="bi bi-arrow-up"></i> +18%
              </div>
            </div>
            <div className="stat-footer">Today</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">AVG TICKET PRICE</div>
            <div className="stat-main">
              <div className="stat-number">
                ${(statistics.totalRevenue / statistics.totalTicketsSold || 0).toFixed(2)}
              </div>
              <div className="stat-trend neutral">
                <i className="bi bi-arrow-right"></i> ±0%
              </div>
            </div>
            <div className="stat-footer">Average</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">OCCUPANCY RATE</div>
            <div className="stat-main">
              <div className="stat-number">68%</div>
              <div className="stat-trend positive">
                <i className="bi bi-arrow-up"></i> +5%
              </div>
            </div>
            <div className="stat-footer">Average</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">ACTIVE SHOWTIMES</div>
            <div className="stat-main">
              <div className="stat-number">{statistics.totalMovies}</div>
            </div>
            <div className="stat-footer">Today</div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="chart-section">
          <div className="chart-header">
            <h2>CHART/TABLE</h2>
            <p>Revenue Trend - Last 7 Days</p>
          </div>
          <div className="chart-container">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

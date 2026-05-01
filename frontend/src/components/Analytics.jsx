import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { FiCalendar, FiTrendingUp, FiTrendingDown, FiDollarSign, FiUsers, FiPackage, FiShoppingBag } from 'react-icons/fi';
import { API_URL } from '../config';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

const Analytics = ({ orders, users, wines }) => {
  const [timeRange, setTimeRange] = useState('week');
  const [analyticsData, setAnalyticsData] = useState({
    revenueData: [],
    orderData: [],
    topProducts: [],
    categoryDistribution: [],
    dailyStats: []
  });
  const [wineCategories, setWineCategories] = useState({});

  // Fetch wine categories from database
  useEffect(() => {
    const fetchWineCategories = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const categories = ['reds', 'whites', 'rose', 'sparkling'];
        const categoryMap = {};
        
        for (const cat of categories) {
          const response = await fetch(`${API_URL}/wines/${cat}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await response.json();
          if (data.data) {
            data.data.forEach(wine => {
              categoryMap[wine._id] = cat;
              categoryMap[wine.wine] = cat;
            });
          }
        }
        setWineCategories(categoryMap);
      } catch (error) {
        console.error('Error fetching wine categories:', error);
      }
    };
    
    fetchWineCategories();
  }, []);

  useEffect(() => {
    processAnalyticsData();
  }, [orders, timeRange, wineCategories]);

  const getDateRange = () => {
    const now = new Date();
    switch (timeRange) {
      case 'week':
        return { start: new Date(now.setDate(now.getDate() - 7)), end: new Date() };
      case 'month':
        return { start: new Date(now.setMonth(now.getMonth() - 1)), end: new Date() };
      case 'year':
        return { start: new Date(now.setFullYear(now.getFullYear() - 1)), end: new Date() };
      default:
        return { start: new Date(now.setDate(now.getDate() - 7)), end: new Date() };
    }
  };

  const getCategoryFromWine = (wineId, wineName) => {
    // First try by wine ID
    if (wineCategories[wineId]) return wineCategories[wineId];
    // Then try by wine name
    if (wineCategories[wineName]) return wineCategories[wineName];
    // Default to 'reds'
    return 'reds';
  };

  const processAnalyticsData = () => {
    const { start } = getDateRange();
    const filteredOrders = orders.filter(o => new Date(o.createdAt) >= start && o.status !== 'cancelled');
    
    // Revenue by day
    const revenueByDay = {};
    const ordersByDay = {};
    
    filteredOrders.forEach(order => {
      const date = new Date(order.createdAt).toLocaleDateString();
      revenueByDay[date] = (revenueByDay[date] || 0) + (order.total || 0);
      ordersByDay[date] = (ordersByDay[date] || 0) + 1;
    });
    
    const dates = Object.keys(revenueByDay).slice(-7);
    const revenueValues = dates.map(d => revenueByDay[d] || 0);
    const orderValues = dates.map(d => ordersByDay[d] || 0);
    
    // Top selling products
    const productSales = {};
    filteredOrders.forEach(order => {
      order.items?.forEach(item => {
        productSales[item.wine] = (productSales[item.wine] || 0) + (item.quantity || 0);
      });
    });
    
    const topProducts = Object.entries(productSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, sales]) => ({ name, sales }));
    
    // Category distribution - FIXED: Get from wineCategories
    const categoryCount = {
      'Red Wines': 0,
      'White Wines': 0,
      'Rosé Wines': 0,
      'Sparkling Wines': 0
    };
    
    filteredOrders.forEach(order => {
      order.items?.forEach(item => {
        const wineCategory = getCategoryFromWine(item.wineId, item.wine);
        
        let categoryName = 'Sparkling Wines';
        if (wineCategory === 'reds') categoryName = 'Red Wines';
        else if (wineCategory === 'whites') categoryName = 'White Wines';
        else if (wineCategory === 'rose') categoryName = 'Rosé Wines';
        else if (wineCategory === 'sparkling') categoryName = 'Sparkling Wines';
        
        categoryCount[categoryName] += (item.quantity || 0);
      });
    });
    
    setAnalyticsData({
      revenueData: { labels: dates, values: revenueValues },
      orderData: { labels: dates, values: orderValues },
      topProducts,
      categoryDistribution: categoryCount,
      totalRevenue: filteredOrders.reduce((sum, o) => sum + (o.total || 0), 0),
      totalOrders: filteredOrders.length,
      averageOrderValue: filteredOrders.length > 0 ? 
        (filteredOrders.reduce((sum, o) => sum + (o.total || 0), 0) / filteredOrders.length).toFixed(2) : 0
    });
  };

  const revenueChartData = {
    labels: analyticsData.revenueData?.labels || [],
    datasets: [{
      label: 'Revenue ($)',
      data: analyticsData.revenueData?.values || [],
      backgroundColor: 'rgba(197, 160, 89, 0.5)',
      borderColor: '#C5A059',
      borderWidth: 2,
      fill: true,
      tension: 0.4
    }]
  };

  const ordersChartData = {
    labels: analyticsData.orderData?.labels || [],
    datasets: [{
      label: 'Number of Orders',
      data: analyticsData.orderData?.values || [],
      backgroundColor: 'rgba(114, 47, 55, 0.5)',
      borderColor: '#722F37',
      borderWidth: 2,
      fill: true,
      tension: 0.4
    }]
  };

  const categoryChartData = {
    labels: Object.keys(analyticsData.categoryDistribution || {}),
    datasets: [{
      data: Object.values(analyticsData.categoryDistribution || {}),
      backgroundColor: ['#C5A059', '#722F37', '#9b59b6', '#3498db'],
      borderWidth: 0,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#ccc' } },
      tooltip: {
        backgroundColor: '#1a1a1a',
        titleColor: '#C5A059',
        bodyColor: '#ccc',
        borderColor: '#2a2a2a',
        borderWidth: 1
      }
    },
    scales: {
      y: { grid: { color: '#2a2a2a' }, ticks: { color: '#888' } },
      x: { grid: { color: '#2a2a2a' }, ticks: { color: '#888' } }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#ccc', padding: 10 } },
      tooltip: {
        backgroundColor: '#1a1a1a',
        titleColor: '#C5A059',
        bodyColor: '#ccc'
      }
    }
  };

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h2><FiTrendingUp /> Sales Analytics</h2>
        <div className="time-range-selector">
          <button className={timeRange === 'week' ? 'active' : ''} onClick={() => setTimeRange('week')}>Last 7 Days</button>
          <button className={timeRange === 'month' ? 'active' : ''} onClick={() => setTimeRange('month')}>Last 30 Days</button>
          <button className={timeRange === 'year' ? 'active' : ''} onClick={() => setTimeRange('year')}>Last 12 Months</button>
        </div>
      </div>

      <div className="analytics-stats-grid">
        <div className="analytics-stat-card">
          <div className="stat-icon revenue"><FiDollarSign size={24} /></div>
          <div className="stat-info">
            <span className="stat-label">Total Revenue</span>
            <span className="stat-value">${analyticsData.totalRevenue?.toFixed(2) || '0.00'}</span>
          </div>
        </div>
        <div className="analytics-stat-card">
          <div className="stat-icon orders"><FiShoppingBag size={24} /></div>
          <div className="stat-info">
            <span className="stat-label">Total Orders</span>
            <span className="stat-value">{analyticsData.totalOrders || 0}</span>
          </div>
        </div>
        <div className="analytics-stat-card">
          <div className="stat-icon avg"><FiTrendingUp size={24} /></div>
          <div className="stat-info">
            <span className="stat-label">Avg Order Value</span>
            <span className="stat-value">${analyticsData.averageOrderValue || '0.00'}</span>
          </div>
        </div>
        <div className="analytics-stat-card">
          <div className="stat-icon users"><FiUsers size={24} /></div>
          <div className="stat-info">
            <span className="stat-label">Active Users</span>
            <span className="stat-value">{users?.length || 0}</span>
          </div>
        </div>
      </div>

      <div className="analytics-charts-grid">
        <div className="chart-card">
          <h3>Revenue Trend</h3>
          <div className="chart-container"><Bar data={revenueChartData} options={chartOptions} /></div>
        </div>
        <div className="chart-card">
          <h3>Orders Trend</h3>
          <div className="chart-container"><Line data={ordersChartData} options={chartOptions} /></div>
        </div>
        <div className="chart-card">
          <h3>Category Distribution</h3>
          <div className="chart-container doughnut-container"><Doughnut data={categoryChartData} options={doughnutOptions} /></div>
        </div>
        <div className="chart-card">
          <h3>Top Selling Wines</h3>
          <div className="top-products-list">
            {analyticsData.topProducts?.length > 0 ? (
              analyticsData.topProducts.map((product, index) => (
                <div key={index} className="top-product-item">
                  <span className="rank">#{index + 1}</span>
                  <span className="product-name">{product.name}</span>
                  <span className="product-sales">{product.sales} sold</span>
                </div>
              ))
            ) : <p className="no-data">No sales data available</p>}
          </div>
        </div>
      </div>

      <div className="quick-stats">
        <div className="quick-stat-item">
          <FiPackage size={20} />
          <div><span>{wines?.length || 0}</span><small>Total Products</small></div>
        </div>
        <div className="quick-stat-item">
          <FiTrendingUp size={20} />
          <div><span>{orders?.filter(o => o.status === 'delivered').length || 0}</span><small>Completed Orders</small></div>
        </div>
        <div className="quick-stat-item">
          <FiTrendingDown size={20} />
          <div><span>{orders?.filter(o => o.status === 'cancelled').length || 0}</span><small>Cancelled Orders</small></div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
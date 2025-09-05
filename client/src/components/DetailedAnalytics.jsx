
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DetailedAnalytics = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('monthly');
  const [region, setRegion] = useState('all');

  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line
  }, [timeRange, region]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/government/analytics', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setAnalytics(data);
      setLoading(false);
      setError('');
    } catch (err) {
      setError('Failed to fetch analytics');
      setLoading(false);
    }
  };

  if (loading) {
    return (
  <div className="min-h-screen flex items-center justify-center bg-black text-white dark:bg-black text-white">
  <span className="text-white text-xl">Loading analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
  <div className="min-h-screen flex items-center justify-center bg-black text-white dark:bg-black text-white">
  <div className="bg-red-900 border border-red-400 text-white px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
  <div className="min-h-screen p-6 animate-fadeIn bg-black text-white dark:bg-black text-white">
  <h1 className="text-3xl font-bold mb-4 text-white">Detailed Analytics</h1>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setTimeRange('weekly')}
            className={`px-4 py-2 rounded-lg transition duration-300 ${
              timeRange === 'weekly' 
                ? 'bg-gradient-primary text-light-green' 
                : 'bg-card-green text-green hover:bg-deep-green'
            }`}
          >
            Weekly
          </button>
          <button 
            onClick={() => setTimeRange('monthly')}
            className={`px-4 py-2 rounded-lg transition duration-300 ${
              timeRange === 'monthly' 
                ? 'bg-gradient-primary text-light-green' 
                : 'bg-card-green text-green hover:bg-deep-green'
            }`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setTimeRange('yearly')}
            className={`px-4 py-2 rounded-lg transition duration-300 ${
              timeRange === 'yearly' 
                ? 'bg-gradient-primary text-light-green' 
                : 'bg-card-green text-green hover:bg-deep-green'
            }`}
          >
            Yearly
          </button>
        </div>
        <div className="flex gap-2">
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="px-4 py-2 border border-green rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300 bg-card-green text-light-green"
          >
            <option value="all">All Regions</option>
            <option value="north">North Region</option>
            <option value="south">South Region</option>
            <option value="east">East Region</option>
            <option value="west">West Region</option>
          </select>
          <button className="bg-gradient-primary hover:bg-deep-green text-light-green font-medium py-2 px-4 rounded-lg transition duration-300">
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="p-6 rounded-2xl shadow-lg bg-white text-black dark:bg-card-green dark:text-light-green">
          <h2 className="text-xl font-bold mb-2 text-green">Land Usage</h2>
          <p className="text-gray-800 dark:text-light-green">{analytics?.landUsage}% of land is currently in use.</p>
        </div>
        <div className="p-6 rounded-2xl shadow-lg bg-white text-black dark:bg-card-green dark:text-light-green">
          <h2 className="text-xl font-bold mb-2 text-green">Equipment Efficiency</h2>
          <p className="text-gray-800 dark:text-light-green">{analytics?.equipmentEfficiency}% equipment efficiency rate.</p>
        </div>
        <div className="p-6 rounded-2xl shadow-lg bg-white text-black dark:bg-card-green dark:text-light-green">
          <h2 className="text-xl font-bold mb-2 text-green">Subsidy Utilization</h2>
          <p className="text-gray-800 dark:text-light-green">{analytics?.subsidyUtilization}% of subsidies utilized.</p>
        </div>
        <div className="p-6 rounded-2xl shadow-lg bg-white text-black dark:bg-card-green dark:text-light-green">
          <h2 className="text-xl font-bold mb-2 text-green">Sustainability Score</h2>
          <p className="text-gray-800 dark:text-light-green">{analytics?.sustainabilityScore}/100 sustainability score.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-primary text-light-green p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-medium mb-2">Total Farmers</h3>
          <p className="text-3xl font-bold">{analytics?.totalFarmers || 0}</p>
          <p className="text-green text-sm mt-2">↑ 12% from last period</p>
        </div>
        <div className="bg-card-green text-green p-6 rounded-2xl shadow-lg dark:bg-card-green dark:text-green">
          <h3 className="text-lg font-medium mb-2">Total Land Parcels</h3>
          <p className="text-3xl font-bold">{analytics?.totalLands || 0}</p>
          <p className="text-light-green text-sm mt-2">↑ 8% from last period</p>
        </div>
        <div className="bg-card-green text-green p-6 rounded-2xl shadow-lg dark:bg-card-green dark:text-green">
          <h3 className="text-lg font-medium mb-2">Total Area</h3>
          <p className="text-3xl font-bold">{analytics?.totalLandArea || 0} acres</p>
          <p className="text-light-green text-sm mt-2">↑ 5% from last period</p>
        </div>
        <div className="bg-card-green text-green p-6 rounded-2xl shadow-lg dark:bg-card-green dark:text-green">
          <h3 className="text-lg font-medium mb-2">Avg Sustainability</h3>
          <p className="text-3xl font-bold">
            {analytics?.sustainabilityScores?.length > 0 
              ? Math.round(analytics.sustainabilityScores.reduce((acc, score) => acc + score.count, 0) / analytics.sustainabilityScores.length)
              : 0}%
          </p>
          <p className="text-light-green text-sm mt-2">↑ 3% from last period</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-card-green p-6 rounded-2xl shadow-lg dark:bg-card-green dark:text-light-green">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-light-green">Sustainability Score Distribution</h2>
            <button className="text-green hover:text-light-green font-medium">
              View Details →
            </button>
          </div>
          <div className="h-80 flex items-end justify-between pt-8">
            {analytics?.sustainabilityScores?.map((score, index) => (
              <div key={index} className="flex flex-col items-center flex-1 px-2">
                <div
                  className="w-full bg-gradient-primary rounded-t-lg"
                  style={{ height: `${(score.count / Math.max(...analytics.sustainabilityScores.map(s => s.count))) * 250}px` }}
                ></div>
                <span className="mt-2 text-green font-medium">{score._id}</span>
                <span className="text-light-green text-sm">{score.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card-green p-6 rounded-2xl shadow-lg dark:bg-card-green dark:text-light-green">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-light-green">Soil Type Distribution</h2>
            <button className="text-green hover:text-light-green font-medium">
              View Details →
            </button>
          </div>
          <div className="h-80 space-y-4">
            {analytics?.soilDistribution?.map((soil, index) => (
              <div key={index} className="flex items-center">
                <div className="w-32 text-green">{soil._id}</div>
                <div className="flex-1 ml-4">
                  <div className="h-6 bg-deep-green rounded-full overflow-hidden dark:bg-deep-green">
                    <div
                      className="h-full bg-gradient-primary rounded-full"
                      style={{ width: `${(soil.count / Math.max(...analytics.soilDistribution.map(s => s.count))) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-12 text-right text-light-green font-medium">{soil.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card-green p-6 rounded-2xl shadow-lg dark:bg-card-green dark:text-light-green">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-light-green">Regional Sustainability Trends</h2>
            <button className="text-green hover:text-light-green font-medium">
              View Details →
            </button>
          </div>
          <div className="h-80">
            <div className="flex h-full items-end space-x-2">
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gradient-primary rounded-t-lg" style={{ height: '60%' }}></div>
                <span className="mt-2 text-green">North</span>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gradient-primary rounded-t-lg" style={{ height: '45%' }}></div>
                <span className="mt-2 text-green">South</span>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gradient-primary rounded-t-lg" style={{ height: '78%' }}></div>
                <span className="mt-2 text-green">East</span>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gradient-primary rounded-t-lg" style={{ height: '52%' }}></div>
                <span className="mt-2 text-green">West</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-card-green p-6 rounded-2xl shadow-lg dark:bg-card-green dark:text-light-green">
          <h2 className="text-2xl font-bold text-light-green mb-4">Policy Effectiveness</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-green">Sustainable Farming Incentive</span>
                <span className="font-medium text-light-green">85%</span>
              </div>
              <div className="h-3 bg-deep-green rounded-full overflow-hidden dark:bg-deep-green">
                <div className="h-full bg-gradient-primary rounded-full" style={{ width: '85%' }}></div>
              </div>
              <p className="text-light-green text-sm mt-2">↑ 12% adoption increase</p>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-green">Water Conservation Initiative</span>
                <span className="font-medium text-light-green">72%</span>
              </div>
              <div className="h-3 bg-deep-green rounded-full overflow-hidden dark:bg-deep-green">
                <div className="h-full bg-gradient-primary rounded-full" style={{ width: '72%' }}></div>
              </div>
              <p className="text-light-green text-sm mt-2">↑ 18% water usage</p>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-green">Soil Health Program</span>
                <span className="font-medium text-light-green">91%</span>
              </div>
              <div className="h-3 bg-deep-green rounded-full overflow-hidden dark:bg-deep-green">
                <div className="h-full bg-gradient-primary rounded-full" style={{ width: '91%' }}></div>
              </div>
              <p className="text-light-green text-sm mt-2">↑ 22% organic matter</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <button
          onClick={() => navigate('/analytics')}
          className="bg-gradient-primary hover:bg-deep-green text-light-green font-medium py-2 px-4 rounded-lg transition duration-300"
        >
          Back to Analytics
        </button>
      </div>
    </div>
  );
};

export default DetailedAnalytics;
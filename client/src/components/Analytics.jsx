import React, { useState, useEffect } from 'react';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('monthly');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/government/analytics', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setAnalytics(data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
  <div className="animate-fadeIn min-h-screen p-4 bg-green-50 text-green-900">
      <div className="mb-8">
  <h1 className="text-3xl font-bold mb-2 text-green-800">Analytics Dashboard</h1>
  <p className="text-green-700">Comprehensive insights into regional sustainability metrics</p>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
  <div className="flex space-x-2">
          <button 
            onClick={() => setTimeRange('weekly')}
            className={`px-4 py-2 rounded-lg transition duration-300 ${
              timeRange === 'weekly' 
                ? 'bg-green-500 text-white' 
                : 'bg-green-100 text-green-900 hover:bg-green-200'
            }`}
          >
            Weekly
          </button>
          <button 
            onClick={() => setTimeRange('monthly')}
            className={`px-4 py-2 rounded-lg transition duration-300 ${
              timeRange === 'monthly' 
                ? 'bg-green-500 text-white' 
                : 'bg-green-100 text-green-900 hover:bg-green-200'
            }`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setTimeRange('yearly')}
            className={`px-4 py-2 rounded-lg transition duration-300 ${
              timeRange === 'yearly' 
                ? 'bg-green-500 text-white' 
                : 'bg-green-100 text-green-900 hover:bg-green-200'
            }`}
          >
            Yearly
          </button>
        </div>
        <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300">
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="p-6 rounded-2xl bg-green-100 text-green-900">
          <h3 className="text-lg font-medium mb-2">Total Farmers</h3>
          <p className="text-3xl font-bold">{analytics?.totalFarmers || 0}</p>
          <p className="text-green text-sm mt-2">↑ 12% from last period</p>
        </div>
  <div className="p-6 rounded-2xl bg-green-100 text-green-900">
          <h3 className="text-lg font-medium mb-2">Total Farmers</h3>
          <p className="text-3xl font-bold">{analytics?.totalFarmers || 0}</p>
          <p className="text-green text-sm mt-2">↑ 12% from last period</p>
        </div>
  <div className="p-6 rounded-2xl bg-white text-green-900">
          <h3 className="text-lg font-medium mb-2">Total Land Parcels</h3>
          <p className="text-3xl font-bold">{analytics?.totalLands || 0}</p>
          <p className="text-light-green text-sm mt-2">↑ 8% from last period</p>
        </div>
  <div className="p-6 rounded-2xl bg-white text-green-900">
          <h3 className="text-lg font-medium mb-2">Total Area</h3>
          <p className="text-3xl font-bold">{analytics?.totalLandArea || 0} acres</p>
          <p className="text-light-green text-sm mt-2">↑ 5% from last period</p>
        </div>
  <div className="p-6 rounded-2xl bg-white text-green-900">
          <h3 className="text-lg font-medium mb-2">Avg Sustainability</h3>
          <p className="text-3xl font-bold">
            {analytics?.sustainabilityScores?.length > 0
              ? Math.round(analytics.sustainabilityScores.reduce((acc, score) => acc + score.count, 0) / analytics.sustainabilityScores.length)
              : 0}%
          </p>
          <p className="text-light-green text-sm mt-2">↑ 3% from last period</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white text-green-900">
          <h2 className="text-2xl font-bold mb-4">Sustainability Score Distribution</h2>
          {analytics?.sustainabilityScores && analytics.sustainabilityScores.length > 0 ? (
            <div className="h-80 flex items-end justify-between pt-8">
              {analytics.sustainabilityScores.map((score, idx) => {
                // score._id is the score range or value, score.count is the number
                const maxCount = Math.max(...analytics.sustainabilityScores.map(s => s.count));
                const barHeight = (score.count / maxCount) * 220;
                return (
                  <div key={idx} className="flex flex-col items-center flex-1 px-2 group">
                    <div 
                      className="w-full bg-gradient-primary rounded-t-lg transition-all duration-300 group-hover:bg-green-500"
                      style={{ height: `${barHeight}px` }}
                      title={`Score: ${score._id}, Parcels: ${score.count}`}
                    ></div>
                    <span className="mt-2 text-green font-medium">{score._id}</span>
                    <span className="text-xs text-gray-500">{score.count}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-gray-500">No sustainability score data available.</div>
          )}
          {/* Breakdown by range */}
          {analytics?.sustainabilityScores && analytics.sustainabilityScores.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-bold mb-2">Score Range Breakdown</h3>
              <div className="flex flex-wrap gap-4">
                {(() => {
                  // Group scores by range (0-20, 21-40, ...)
                  const ranges = [
                    { label: '0-20%', min: 0, max: 20 },
                    { label: '21-40%', min: 21, max: 40 },
                    { label: '41-60%', min: 41, max: 60 },
                    { label: '61-80%', min: 61, max: 80 },
                    { label: '81-100%', min: 81, max: 100 }
                  ];
                  const rangeCounts = ranges.map(r => ({
                    ...r,
                    count: analytics.sustainabilityScores.filter(s => {
                      const val = typeof s._id === 'number' ? s._id : parseInt(s._id);
                      return val >= r.min && val <= r.max;
                    }).reduce((acc, s) => acc + s.count, 0)
                  }));
                  return rangeCounts.map((r, i) => (
                    <div key={i} className="flex flex-col items-center bg-green-100 rounded-lg px-4 py-2">
                      <span className="font-bold text-green-900">{r.label}</span>
                      <span className="text-2xl font-bold text-green-700">{r.count}</span>
                      <span className="text-xs text-gray-500">parcels</span>
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}
        </div>
  <div className="p-6 rounded-2xl bg-white text-green-900">
          <h2 className="text-2xl font-bold mb-4">Policy Effectiveness</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-green">Sustainable Farming Incentive</span>
                <span className="font-medium text-light-green">85%</span>
              </div>
              <div className="h-2 bg-deep-green rounded-full overflow-hidden">
                <div className="h-full bg-gradient-primary rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-green">Water Conservation Initiative</span>
                <span className="font-medium text-light-green">72%</span>
              </div>
              <div className="h-2 bg-deep-green rounded-full overflow-hidden">
                <div className="h-full bg-gradient-primary rounded-full" style={{ width: '72%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-green">Soil Health Program</span>
                <span className="font-medium text-light-green">91%</span>
              </div>
              <div className="h-2 bg-deep-green rounded-full overflow-hidden">
                <div className="h-full bg-gradient-primary rounded-full" style={{ width: '91%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white text-green-900">
          <h2 className="text-2xl font-bold mb-4">Regional Distribution</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-32 text-green">North Region</div>
              <div className="flex-1 ml-4">
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden dark:bg-deep-green">
                  <div className="h-full bg-gradient-primary rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div className="w-10 text-right font-medium text-black dark:text-light-green">65%</div>
            </div>
            <div className="flex items-center">
              <div className="w-32 text-green">South Region</div>
              <div className="flex-1 ml-4">
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden dark:bg-deep-green">
                  <div className="h-full bg-gradient-primary rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div className="w-10 text-right font-medium text-black dark:text-light-green">45%</div>
            </div>
            <div className="flex items-center">
              <div className="w-32 text-green">East Region</div>
              <div className="flex-1 ml-4">
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden dark:bg-deep-green">
                  <div className="h-full bg-gradient-primary rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              <div className="w-10 text-right font-medium text-black dark:text-light-green">78%</div>
            </div>
            <div className="flex items-center">
              <div className="w-32 text-green">West Region</div>
              <div className="flex-1 ml-4">
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden dark:bg-deep-green">
                  <div className="h-full bg-gradient-primary rounded-full" style={{ width: '52%' }}></div>
                </div>
              </div>
              <div className="w-10 text-right font-medium text-black dark:text-light-green">52%</div>
            </div>
          </div>
        </div>
  <div className="p-6 rounded-2xl bg-white text-green-900">
          <h2 className="text-2xl font-bold mb-4">Recent Recommendations</h2>
          <div className="space-y-4">
            <div className="p-4 bg-green-100 rounded-lg border-l-4 border-green-500">
              <h3 className="font-bold text-green">Increase Water Efficiency</h3>
              <p className="text-gray-800 text-sm mt-2 dark:text-light-green">Implement drip irrigation systems in the South Region to reduce water usage by 30%</p>
            </div>
            <div className="p-4 bg-green-100 rounded-lg border-l-4 border-green-500">
              <h3 className="font-bold text-green">Soil Health Initiative</h3>
              <p className="text-gray-800 text-sm mt-2 dark:text-light-green">Promote cover cropping to improve soil organic matter in the North Region</p>
            </div>
            <div className="p-4 bg-green-100 rounded-lg border-l-4 border-green-500">
              <h3 className="font-bold text-green">Policy Adjustment</h3>
              <p className="text-gray-800 text-sm mt-2 dark:text-light-green">Extend the Sustainable Farming Incentive Program to include livestock farmers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { BuildingOfficeIcon, DocumentTextIcon, CurrencyDollarIcon, UserGroupIcon, CalendarIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Tooltip, BarChart, XAxis, YAxis, CartesianGrid, Bar } from 'recharts';

const GovernmentPortal = () => {
  const { user } = useAuth();
  const { governmentData, analyticsData, fetchGovernmentData, fetchAnalyticsData } = useData();
  useEffect(() => {
    fetchGovernmentData();
    fetchAnalyticsData();
  }, [fetchGovernmentData, fetchAnalyticsData]);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Government Portal</h1>
          <p className="text-gray-600">Welcome, {user?.name || 'Official'}</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <CalendarIcon className="w-4 h-4" />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>
      {/* Government Dashboard Features */}
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Departments</p>
              <p className="text-2xl font-bold text-gray-900">{governmentData.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500">
              <UserGroupIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Policies</p>
              <p className="text-2xl font-bold text-gray-900">{governmentData.reduce((sum, d) => sum + (d.policies || 0), 0)}</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-500">
              <DocumentTextIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Subsidies</p>
              <p className="text-2xl font-bold text-gray-900">{governmentData.reduce((sum, d) => sum + (d.activeSubsidies || 0), 0)}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-500">
              <CurrencyDollarIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Regions</p>
              <p className="text-2xl font-bold text-gray-900">{(analyticsData.regionalData && analyticsData.regionalData.length) || 0}</p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-500">
              <ChartBarIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Crop Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Crop Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={Object.entries(analyticsData.cropDistribution || {}).map(([name, value]) => ({ name, value }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(Object.entries(analyticsData.cropDistribution || {})).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={["#22c55e", "#3b82f6", "#8b5cf6", "#f59e0b"][index % 4]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Regional Land Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Land Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.regionalData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="landArea" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Recent Activity */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {/* Example: Show recent department/policy/subsidy updates */}
          {governmentData.slice(0, 5).map(dep => (
            <div key={dep.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <UserGroupIcon className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{dep.department} Updated</p>
                <p className="text-sm text-gray-600">Policies: {dep.policies}, Subsidies: {dep.activeSubsidies}</p>
                <div className="flex items-center mt-1 text-xs text-gray-500">
                  <span>{dep.contact}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Quick Actions */}
      <div className="card mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center justify-center p-4 border-2 border-green-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors">
            <BuildingOfficeIcon className="w-6 h-6 text-green-600 mr-2" />
            <span className="font-medium text-green-700">Add Department</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-blue-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
            <UserGroupIcon className="w-6 h-6 text-blue-600 mr-2" />
            <span className="font-medium text-blue-700">Register Farmer</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-purple-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors">
            <UserGroupIcon className="w-6 h-6 text-purple-600 mr-2" />
            <span className="font-medium text-purple-700">Contact Farmers</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-emerald-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors">
            <ChartBarIcon className="w-6 h-6 text-emerald-600 mr-2" />
            <span className="font-medium text-emerald-700">Generate Report</span>
          </button>
        </div>
      </div>
      {/* Government Functionalities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Department Management */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Management</h3>
          <p className="text-gray-600 mb-4">Add, view, and manage government departments.</p>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <h4 className="font-medium">Agriculture Department</h4>
                <p className="text-sm text-gray-600">12 officials</p>
              </div>
              <button className="btn-secondary text-sm">Manage</button>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <h4 className="font-medium">Rural Development</h4>
                <p className="text-sm text-gray-600">8 officials</p>
              </div>
              <button className="btn-secondary text-sm">Manage</button>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <h4 className="font-medium">Environmental Protection</h4>
                <p className="text-sm text-gray-600">5 officials</p>
              </div>
              <button className="btn-secondary text-sm">Manage</button>
            </div>
          </div>
          <button className="btn-primary w-full mt-4">Add New Department</button>
        </div>
        {/* Policy Management */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Policy Management</h3>
          <p className="text-gray-600 mb-4">Create, edit, and review agricultural policies.</p>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <h4 className="font-medium">Agricultural Subsidy Program 2024</h4>
                <p className="text-sm text-gray-600">Active - Expires Dec 31, 2024</p>
              </div>
              <button className="btn-secondary text-sm">Edit</button>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <h4 className="font-medium">Water Conservation Initiative</h4>
                <p className="text-sm text-gray-600">Active - Expires Feb 28, 2025</p>
              </div>
              <button className="btn-secondary text-sm">Edit</button>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <h4 className="font-medium">Organic Farming Certification</h4>
                <p className="text-sm text-gray-600">Planning - Starts Jun 1, 2024</p>
              </div>
              <button className="btn-secondary text-sm">Edit</button>
            </div>
          </div>
          <button className="btn-primary w-full mt-4">Create New Policy</button>
        </div>
        {/* Subsidy Management */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Subsidy Management</h3>
          <p className="text-gray-600 mb-4">Track and manage subsidies for farmers.</p>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <h4 className="font-medium">Seed Subsidy</h4>
                <p className="text-sm text-gray-600">500 applicants - Deadline Apr 30</p>
              </div>
              <button className="btn-secondary text-sm">Review</button>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <h4 className="font-medium">Equipment Loan</h4>
                <p className="text-sm text-gray-600">320 applicants - Deadline May 15</p>
              </div>
              <button className="btn-secondary text-sm">Review</button>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <h4 className="font-medium">Irrigation System Grant</h4>
                <p className="text-sm text-gray-600">180 applicants - Deadline Jun 30</p>
              </div>
              <button className="btn-secondary text-sm">Review</button>
            </div>
          </div>
          <button className="btn-primary w-full mt-4">Create New Subsidy</button>
        </div>
        {/* Regional Analytics */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Analytics</h3>
          <p className="text-gray-600 mb-4">View analytics and reports by region.</p>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded">
              <h4 className="font-medium mb-2">Northern Region</h4>
              <div className="flex justify-between text-sm">
                <span>Farmers: 120</span>
                <span>Land: 2,450 acres</span>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <h4 className="font-medium mb-2">Southern Region</h4>
              <div className="flex justify-between text-sm">
                <span>Farmers: 95</span>
                <span>Land: 1,870 acres</span>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <h4 className="font-medium mb-2">Eastern Region</h4>
              <div className="flex justify-between text-sm">
                <span>Farmers: 142</span>
                <span>Land: 3,120 acres</span>
              </div>
            </div>
          </div>
          <button className="btn-primary w-full mt-4">View Detailed Report</button>
        </div>
        {/* Support */}
        <div className="card lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Support</h3>
          <p className="text-gray-600 mb-4">Manage support requests from farmers and other users.</p>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <h4 className="font-medium">Subsidy Application Query</h4>
                <p className="text-sm text-gray-600">From John Smith - Jan 15, 2024</p>
              </div>
              <button className="btn-secondary text-sm">Respond</button>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <h4 className="font-medium">Land Registration Issue</h4>
                <p className="text-sm text-gray-600">From Mary Johnson - Jan 14, 2024</p>
              </div>
              <button className="btn-secondary text-sm">Respond</button>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <h4 className="font-medium">Equipment Loan Status</h4>
                <p className="text-sm text-gray-600">From Robert Brown - Jan 13, 2024</p>
              </div>
              <button className="btn-secondary text-sm">Respond</button>
            </div>
          </div>
          <button className="btn-primary w-full mt-4">View All Requests</button>
        </div>
      </div>
    </div>
  );
};

export default GovernmentPortal;
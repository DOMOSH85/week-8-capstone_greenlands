import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { governmentAPI } from '../utils/api';
import SubsidyManagement from './SubsidyManagement';
import Messaging from './Messaging';


const GovernmentDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [policies, setPolicies] = useState([]);
  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [policyForm, setPolicyForm] = useState({ title: '', description: '', status: 'Draft', effectiveDate: '' });
  const [policyLoading, setPolicyLoading] = useState(false);
  const [policyError, setPolicyError] = useState('');
  const [editPolicyId, setEditPolicyId] = useState(null);
  const [notifyMessage, setNotifyMessage] = useState('');
  const policiesSectionRef = useRef(null);

  useEffect(() => {
    fetchAnalytics();
    fetchPolicies();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const data = await governmentAPI.getAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  const fetchPolicies = async () => {
    try {
      const data = await governmentAPI.getPolicies();
      setPolicies(data);
    } catch (err) {
      setPolicyError('Failed to fetch policies');
    }
  };

  const handlePolicyInput = (e) => {
    setPolicyForm({ ...policyForm, [e.target.name]: e.target.value });
  };

  const handleCreateOrEditPolicy = async (e) => {
    e.preventDefault();
    setPolicyLoading(true);
    setPolicyError('');
    try {
      if (editPolicyId) {
        await governmentAPI.updatePolicy(editPolicyId, policyForm);
      } else {
        await governmentAPI.createPolicy(policyForm);
      }
      setPolicyModalOpen(false);
      setPolicyForm({ title: '', description: '', status: 'Draft', effectiveDate: '' });
      setEditPolicyId(null);
      fetchPolicies();
      setTimeout(() => {
        if (policiesSectionRef.current) {
          policiesSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    } catch (err) {
      setPolicyError(editPolicyId ? 'Failed to update policy' : 'Failed to create policy');
    } finally {
      setPolicyLoading(false);
    }
  };

  const handleEditPolicy = (policy) => {
    setEditPolicyId(policy._id);
    setPolicyForm({
      title: policy.title,
      description: policy.description,
      status: policy.status,
      effectiveDate: policy.effectiveDate ? policy.effectiveDate.substring(0, 10) : ''
    });
    setPolicyModalOpen(true);
  };

  const handleDeletePolicy = async (id) => {
    if (!window.confirm('Are you sure you want to delete this policy?')) return;
    setPolicyLoading(true);
    setPolicyError('');
    try {
      await governmentAPI.deletePolicy(id);
      fetchPolicies();
    } catch (err) {
      setPolicyError('Failed to delete policy');
    } finally {
      setPolicyLoading(false);
    }
  };

  const handleNotifyPolicy = async (id) => {
    setNotifyMessage('');
    try {
      const res = await governmentAPI.notifyPolicy(id);
      setNotifyMessage(res.message || 'Notification sent!');
      setTimeout(() => setNotifyMessage(''), 3000);
    } catch (err) {
      setNotifyMessage('Failed to send notification');
      setTimeout(() => setNotifyMessage(''), 3000);
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
  <div className="animate-fadeIn min-h-screen bg-green-50 text-green-900">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-green-800">Government Dashboard</h1>
        <p className="text-green-700">Monitor regional sustainability and policy effectiveness</p>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="p-6 rounded-2xl bg-white text-green-700">
          <h3 className="text-lg font-medium mb-2">Total Farmers</h3>
          <p className="text-3xl font-bold">{analytics?.totalFarmers || 0}</p>
        </div>
  <div className="p-6 rounded-2xl bg-green-100 text-green-800">
          <h3 className="text-lg font-medium mb-2">Total Land Parcels</h3>
          <p className="text-3xl font-bold">{analytics?.totalLands || 0}</p>
        </div>
  <div className="p-6 rounded-2xl bg-green-100 text-green-800">
          <h3 className="text-lg font-medium mb-2">Total Area</h3>
          <p className="text-3xl font-bold">{analytics?.totalLandArea || 0} acres</p>
        </div>
  <div className="p-6 rounded-2xl bg-green-100 text-green-800">
          <h3 className="text-lg font-medium mb-2">Avg Sustainability</h3>
          <p className="text-3xl font-bold">
            {analytics?.sustainabilityScores?.length > 0 
              ? Math.round(analytics.sustainabilityScores.reduce((acc, score) => acc + score.count, 0) / analytics.sustainabilityScores.length)
              : 0}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white text-green-900">
          <h2 className="text-2xl font-bold mb-4">Sustainability Score Distribution</h2>
          <div className="h-64 flex items-end justify-between pt-8">
            {analytics?.sustainabilityScores?.map((score, index) => (
              <div key={index} className="flex flex-col items-center flex-1 px-2">
                <div 
                  className="w-full bg-gradient-primary rounded-t-lg"
                  style={{ height: `${(score.count / Math.max(...analytics.sustainabilityScores.map(s => s.count))) * 200}px` }}
                ></div>
                <span className="mt-2 text-gray-700 font-medium">{score._id}</span>
                <span className="text-gray-500 text-sm">{score.count}</span>
              </div>
            ))}
          </div>
        </div>
        
  <div className="bg-white p-6 rounded-2xl">
          <h2 className="text-2xl font-bold text-text-color mb-4">Soil Type Distribution</h2>
          <div className="space-y-4">
            {analytics?.soilDistribution?.map((soil, index) => (
              <div key={index} className="flex items-center">
                <div className="w-32 text-text-color">{soil._id}</div>
                <div className="flex-1 ml-4">
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                      style={{ width: `${(soil.count / Math.max(...analytics.soilDistribution.map(s => s.count))) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-10 text-right text-text-color font-medium">{soil.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div className="bg-white p-6 rounded-2xl" ref={policiesSectionRef}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-text-color">Recent Policies</h2>
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
              onClick={() => setPolicyModalOpen(true)}
            >
              Create Policy
            </button>
          </div>
          {policyError && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{policyError}</div>
          )}
          <div className="space-y-4">
            {policies.length === 0 && (
              <div className="text-gray-500">No policies found.</div>
            )}
            {policies.map((policy) => (
              <div key={policy._id} className="rounded-lg p-4 transition duration-300 bg-green-50">
                <h3 className="font-bold text-text-color">{policy.title}</h3>
                <p className="text-text-color text-sm mt-2">{policy.description}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${policy.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {policy.status}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {policy.effectiveDate ? `Effective: ${new Date(policy.effectiveDate).toLocaleDateString()}` : 'No date'}
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded"
                    onClick={() => handleEditPolicy(policy)}
                  >Edit</button>
                  <button
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded"
                    onClick={() => handleDeletePolicy(policy._id)}
                  >Delete</button>
                  <button
                    className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-xs rounded"
                    onClick={() => handleNotifyPolicy(policy._id)}
                  >Notify</button>
                </div>
              </div>
            ))}
            {notifyMessage && (
              <div className="mt-2 text-green-700 font-medium">{notifyMessage}</div>
            )}
          </div>
          {/* Modal for creating/editing policy */}
          {policyModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-green-900 bg-opacity-20">
              <div className="bg-white p-8 rounded-2xl w-full max-w-md relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-black"
                  onClick={() => { setPolicyModalOpen(false); setEditPolicyId(null); }}
                >
                  &times;
                </button>
                <h3 className="text-xl font-bold mb-4 text-text-color">{editPolicyId ? 'Edit Policy' : 'Create Policy'}</h3>
                <form onSubmit={handleCreateOrEditPolicy}>
                  <div className="mb-4">
                    <label className="block text-text-color font-medium mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={policyForm.title}
                      onChange={handlePolicyInput}
                      className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-green-50"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-text-color font-medium mb-1">Description</label>
                    <textarea
                      name="description"
                      value={policyForm.description}
                      onChange={handlePolicyInput}
                      className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-green-50"
                      required
                      rows="3"
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <label className="block text-text-color font-medium mb-1">Status</label>
                    <select
                      name="status"
                      value={policyForm.status}
                      onChange={handlePolicyInput}
                      className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-green-50"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Active">Active</option>
                    </select>
                  </div>
                  <div className="mb-6">
                    <label className="block text-text-color font-medium mb-1">Effective Date</label>
                    <input
                      type="date"
                      name="effectiveDate"
                      value={policyForm.effectiveDate}
                      onChange={handlePolicyInput}
                      className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-green-50"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
                    disabled={policyLoading}
                  >
                    {policyLoading ? (editPolicyId ? 'Saving...' : 'Creating...') : (editPolicyId ? 'Save Changes' : 'Create Policy')}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
        
  <div className="bg-white p-6 rounded-2xl">
          <h2 className="text-2xl font-bold text-text-color mb-4">Recent Reports</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-lg mr-4">
                <span className="text-blue-600">📊</span>
              </div>
              <div>
                <h3 className="font-medium text-text-color">Quarterly Sustainability Report</h3>
                <p className="text-text-color text-sm">Regional analysis of sustainability metrics</p>
                <p className="text-gray-500 text-xs mt-1">Updated: 2 days ago</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-green-100 p-2 rounded-lg mr-4">
                <span className="text-green-600">🌱</span>
              </div>
              <div>
                <h3 className="font-medium text-text-color">Soil Health Assessment</h3>
                <p className="text-text-color text-sm">Comprehensive soil quality analysis</p>
                <p className="text-gray-500 text-xs mt-1">Updated: 1 week ago</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-purple-100 p-2 rounded-lg mr-4">
                <span className="text-purple-600">💧</span>
              </div>
              <div>
                <h3 className="font-medium text-text-color">Water Usage Report</h3>
                <p className="text-text-color text-sm">Regional water consumption patterns</p>
                <p className="text-gray-500 text-xs mt-1">Updated: 3 weeks ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Subsidy Management Section */}
      <div className="mt-8">
        <SubsidyManagement />
      </div>
      
      {/* Messaging Section */}
      <div className="mt-8">
        <Messaging userType="government" />
      </div>
    </div>
  );
};

export default GovernmentDashboard;
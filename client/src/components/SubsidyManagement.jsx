// ...existing code...

import React, { useState, useEffect } from 'react';
import { governmentAPI, subsidyAPI } from '../utils/api';

const SubsidyManagement = () => {
  const [subsidies, setSubsidies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSubsidy, setEditingSubsidy] = useState(null);
  const [subsidyData, setSubsidyData] = useState({ name: '', description: '', amount: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchSubsidies();
  }, []);

  const fetchSubsidies = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await governmentAPI.getAllSubsidies ? await governmentAPI.getAllSubsidies() : await subsidyAPI.getAllSubsidies();
      setSubsidies(data);
    } catch (err) {
      setError('Failed to fetch subsidies');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setSubsidyData({ ...subsidyData, [e.target.name]: e.target.value });
  };

  const handleCreateSubsidy = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError('');
    try {
      await governmentAPI.createSubsidy(subsidyData);
      setShowCreateForm(false);
      setSubsidyData({ name: '', description: '', amount: '' });
      fetchSubsidies();
    } catch (err) {
      setError('Failed to create subsidy');
    } finally {
      setCreating(false);
    }
  };

  // Approve subsidy
  const handleApproveSubsidy = async (id) => {
    setError('');
    try {
      await governmentAPI.updateSubsidy(id, { status: 'approved' });
      fetchSubsidies();
    } catch (err) {
      setError('Failed to approve subsidy');
    }
  };

  // Reject subsidy
  const handleRejectSubsidy = async (id) => {
    setError('');
    try {
      await governmentAPI.updateSubsidy(id, { status: 'rejected' });
      fetchSubsidies();
    } catch (err) {
      setError('Failed to reject subsidy');
    }
  };
  return (
  <div className="max-w-5xl mx-auto p-6 min-h-screen bg-green-50 text-green-900">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-green-800">Subsidy Management</h1>
        <p className="text-green-700">Manage and approve government subsidies</p>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <button
        className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300 mb-4"
        onClick={() => setShowCreateForm(!showCreateForm)}
      >
        {showCreateForm ? 'Cancel' : 'Create Subsidy'}
      </button>

      {showCreateForm && (
        <form onSubmit={handleCreateSubsidy} className="p-6 rounded-2xl mb-8 bg-white text-green-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={subsidyData.name}
              onChange={handleChange}
              placeholder="Subsidy Name"
              className="p-3 rounded-lg bg-green-100 text-green-900 placeholder-green-700 focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
              required
            />
            <input
              type="text"
              name="description"
              value={subsidyData.description}
              onChange={handleChange}
              placeholder="Description"
              className="p-3 rounded-lg bg-green-100 text-green-900 placeholder-green-700 focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
              required
            />
            <input
              type="number"
              name="amount"
              value={subsidyData.amount}
              onChange={handleChange}
              placeholder="Amount"
              className="p-3 rounded-lg bg-green-100 text-green-900 placeholder-green-700 focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
            disabled={creating}
          >
            {creating ? 'Creating...' : 'Create Subsidy'}
          </button>
        </form>
      )}

  <div className="p-6 rounded-2xl bg-white text-green-900">
        <h2 className="text-2xl font-bold mb-4">Subsidies</h2>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : subsidies.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🌱</div>
            <h3 className="text-xl font-medium mb-2 text-green-800">No subsidies available</h3>
            <p className="mb-4 text-green-700">Create a new subsidy to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-green-100">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-green-100">
                {subsidies.map((subsidy) => (
                  <tr key={subsidy._id} className="hover:bg-green-50 transition duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-green-900">{subsidy.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-green-700">{subsidy.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-green-700">KES {subsidy.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        subsidy.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : subsidy.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {subsidy.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {subsidy.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApproveSubsidy(subsidy._id)}
                            className="bg-green-500 hover:bg-green-600 text-white font-medium py-1 px-3 rounded-lg mr-2 transition duration-300"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectSubsidy(subsidy._id)}
                            className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-3 rounded-lg transition duration-300"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default SubsidyManagement;
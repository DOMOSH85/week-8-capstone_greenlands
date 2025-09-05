import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { subsidyAPI } from '../utils/api';

const SubsidyApplication = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [subsidyData, setSubsidyData] = useState({
    name: '',
    description: '',
    amount: ''
  });

  const handleChange = (e) => {
    setSubsidyData({
      ...subsidyData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await subsidyAPI.applyForSubsidy(subsidyData);
      setSuccess(true);
      setSubsidyData({
        name: '',
        description: '',
        amount: ''
      });
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to submit subsidy application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-green-600 hover:text-green-800 font-medium mb-4 transition duration-300"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-text-color mb-2">Apply for Subsidy</h1>
        <p className="text-text-color">Submit your application for government agricultural subsidies</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          Subsidy application submitted successfully!
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-text-color font-medium mb-2">
              Subsidy Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={subsidyData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300 text-text-color"
              placeholder="Enter subsidy name"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-text-color font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={subsidyData.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300 text-text-color"
              placeholder="Describe your subsidy request"
            ></textarea>
          </div>

          <div>
            <label htmlFor="amount" className="block text-text-color font-medium mb-2">
              Requested Amount (KES)
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={subsidyData.amount}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300 text-text-color"
              placeholder="Enter requested amount"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition duration-300 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 bg-blue-50 p-6 rounded-2xl border-l-4 border-blue-400">
        <h3 className="font-bold text-text-color mb-2">Subsidy Application Tips</h3>
        <ul className="list-disc pl-5 space-y-1 text-text-color">
          <li>Provide detailed information about your farming activities</li>
          <li>Include specific use cases for the requested funds</li>
          <li>Applications are typically processed within 7-14 business days</li>
          <li>You can check the status of your application in the Subsidy Management section</li>
        </ul>
      </div>
    </div>
  );
};

export default SubsidyApplication;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { landAPI } from '../utils/api';

const LandDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [land, setLand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCropForm, setShowCropForm] = useState(false);
  const [showWaterForm, setShowWaterForm] = useState(false);
  const [showFertilizerForm, setShowFertilizerForm] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [cropData, setCropData] = useState({
    name: '',
    plantingDate: '',
    harvestDate: '',
    yield: ''
  });
  const [waterData, setWaterData] = useState({
    date: '',
    amount: ''
  });
  const [fertilizerData, setFertilizerData] = useState({
    date: '',
    type: '',
    amount: ''
  });
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    fetchLand();
  }, [id]);

  const fetchLand = async () => {
    try {
      const data = await landAPI.getLand(id);
      setLand(data);
    } catch (err) {
      setError('Failed to fetch land details');
    } finally {
      setLoading(false);
    }
  };

  const handleCropSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data = await landAPI.addCrop(id, cropData);
      setLand(data);
      setShowCropForm(false);
      setCropData({
        name: '',
        plantingDate: '',
        harvestDate: '',
        yield: ''
      });
    } catch (err) {
      setError('Failed to add crop');
    }
  };

  const handleWaterSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data = await landAPI.addWaterUsage(id, waterData);
      setLand(data);
      setShowWaterForm(false);
      setWaterData({
        date: '',
        amount: ''
      });
    } catch (err) {
      setError('Failed to add water usage');
    }
  };

  const handleFertilizerSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data = await landAPI.addFertilizerUsage(id, fertilizerData);
      setLand(data);
      setShowFertilizerForm(false);
      setFertilizerData({
        date: '',
        type: '',
        amount: ''
      });
    } catch (err) {
      setError('Failed to add fertilizer usage');
    }
  };

  const handleGenerateReport = async () => {
    try {
      const data = await landAPI.generateLandReport(id);
      setReportData(data);
      setShowReport(true);
    } catch (err) {
      setError('Failed to generate report');
    }
  };

  const onCropChange = (e) => {
    setCropData({ ...cropData, [e.target.name]: e.target.value });
  };

  const onWaterChange = (e) => {
    setWaterData({ ...waterData, [e.target.name]: e.target.value });
  };

  const onFertilizerChange = (e) => {
    setFertilizerData({ ...fertilizerData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
        {error}
      </div>
    );
  }

  if (!land) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-700">Land not found</h3>
        <button 
          onClick={() => navigate('/land')}
          className="mt-4 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
        >
          Back to Land Management
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <button
          onClick={() => navigate('/land')}
          className="flex items-center text-green-600 hover:text-green-800 font-medium mb-4 transition duration-300"
        >
          ← Back to Land Management
        </button>
        <h1 className="text-3xl font-bold text-text-color mb-2">{land.name}</h1>
        <p className="text-text-color">Detailed view of your land parcel</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-text-color">{land.name}</h2>
              <p className="text-text-color">{land.location?.address || 'Location not specified'}</p>
            </div>
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {land.soilType}
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-text-color">Size</p>
              <p className="text-2xl font-bold text-text-color">{land.size} acres</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-text-color">Sustainability</p>
              <p className="text-2xl font-bold text-text-color">{land.sustainabilityScore}%</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-text-color">Crops</p>
              <p className="text-2xl font-bold text-text-color">{land.crops?.length || 0}</p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-text-color">Water Used</p>
              <p className="text-2xl font-bold text-text-color">
                {land.waterUsage?.reduce((acc, w) => acc + w.amount, 0) || 0}L
              </p>
            </div>
          </div>
          
          <div className="h-64 bg-gray-100 rounded-lg mb-6 flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl mb-4">🌍</div>
              <p className="text-text-color">Land Map Visualization</p>
              <p className="text-gray-500 text-sm mt-2">Satellite imagery and GIS data would be displayed here</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold text-text-color mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => setShowCropForm(!showCropForm)}
                className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition duration-300"
              >
                Add Crop
              </button>
              <button
                onClick={() => setShowWaterForm(!showWaterForm)}
                className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition duration-300"
              >
                Record Water Usage
              </button>
              <button
                onClick={() => setShowFertilizerForm(!showFertilizerForm)}
                className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition duration-300"
              >
                Add Fertilizer
              </button>
              <button
                onClick={handleGenerateReport}
                className="w-full text-left p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition duration-300"
              >
                Generate Report
              </button>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold text-text-color mb-4">Sustainability Tips</h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                <h4 className="font-bold text-text-color">Crop Rotation</h4>
                <p className="text-text-color text-sm mt-1">Rotate crops every season to maintain soil health</p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <h4 className="font-bold text-text-color">Water Conservation</h4>
                <p className="text-text-color text-sm mt-1">Use drip irrigation to reduce water usage by 30%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCropForm && (
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 animate-fadeIn">
          <h3 className="text-xl font-bold text-text-color mb-4">Add New Crop</h3>
          <form onSubmit={handleCropSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-text-color font-medium mb-2">Crop Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={cropData.name}
                onChange={onCropChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300 text-text-color"
                placeholder="Enter crop name"
              />
            </div>
            
            <div>
              <label htmlFor="plantingDate" className="block text-text-color font-medium mb-2">Planting Date</label>
              <input
                type="date"
                id="plantingDate"
                name="plantingDate"
                value={cropData.plantingDate}
                onChange={onCropChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300 text-text-color"
              />
            </div>
            
            <div>
              <label htmlFor="harvestDate" className="block text-text-color font-medium mb-2">Harvest Date</label>
              <input
                type="date"
                id="harvestDate"
                name="harvestDate"
                value={cropData.harvestDate}
                onChange={onCropChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300 text-text-color"
              />
            </div>
            
            <div>
              <label htmlFor="yield" className="block text-text-color font-medium mb-2">Expected Yield (tons/hectare)</label>
              <input
                type="number"
                id="yield"
                name="yield"
                value={cropData.yield}
                onChange={onCropChange}
                required
                min="0"
                step="0.1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300 text-text-color"
                placeholder="Enter expected yield"
              />
            </div>
            
            <div className="md:col-span-2 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowCropForm(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition duration-300"
              >
                Add Crop
              </button>
            </div>
          </form>
        </div>
      )}

      {showWaterForm && (
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 animate-fadeIn">
          <h3 className="text-xl font-bold text-text-color mb-4">Record Water Usage</h3>
          <form onSubmit={handleWaterSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="date" className="block text-text-color font-medium mb-2">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={waterData.date}
                onChange={onWaterChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300 text-text-color"
              />
            </div>
            
            <div>
              <label htmlFor="amount" className="block text-text-color font-medium mb-2">Amount (liters)</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={waterData.amount}
                onChange={onWaterChange}
                required
                min="0"
                step="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300 text-text-color"
                placeholder="Enter amount in liters"
              />
            </div>
            
            <div className="md:col-span-2 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowWaterForm(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition duration-300"
              >
                Record Water Usage
              </button>
            </div>
          </form>
        </div>
      )}

      {showFertilizerForm && (
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 animate-fadeIn">
          <h3 className="text-xl font-bold text-text-color mb-4">Add Fertilizer Usage</h3>
          <form onSubmit={handleFertilizerSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fertilizerDate" className="block text-text-color font-medium mb-2">Date</label>
              <input
                type="date"
                id="fertilizerDate"
                name="date"
                value={fertilizerData.date}
                onChange={onFertilizerChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300 text-text-color"
              />
            </div>
            
            <div>
              <label htmlFor="type" className="block text-text-color font-medium mb-2">Fertilizer Type</label>
              <input
                type="text"
                id="type"
                name="type"
                value={fertilizerData.type}
                onChange={onFertilizerChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300 text-text-color"
                placeholder="Enter fertilizer type"
              />
            </div>
            
            <div>
              <label htmlFor="fertilizerAmount" className="block text-text-color font-medium mb-2">Amount (kg)</label>
              <input
                type="number"
                id="fertilizerAmount"
                name="amount"
                value={fertilizerData.amount}
                onChange={onFertilizerChange}
                required
                min="0"
                step="0.1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300 text-text-color"
                placeholder="Enter amount in kg"
              />
            </div>
            
            <div className="md:col-span-2 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowFertilizerForm(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition duration-300"
              >
                Add Fertilizer Usage
              </button>
            </div>
          </form>
        </div>
      )}

      {showReport && reportData && (
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 animate-fadeIn">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold text-text-color mb-2">Land Report</h3>
              <p className="text-text-color">Generated on {new Date(reportData.reportDate).toLocaleDateString()}</p>
            </div>
            <button
              onClick={() => setShowReport(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-text-color mb-3">Land Information</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-text-color">Name:</span>
                  <span className="font-medium">{reportData.land.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-color">Size:</span>
                  <span className="font-medium">{reportData.land.size} acres</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-color">Soil Type:</span>
                  <span className="font-medium">{reportData.land.soilType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-color">Sustainability Score:</span>
                  <span className="font-medium">{reportData.land.sustainabilityScore}%</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-text-color mb-3">Usage Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-text-color">Total Water Used:</span>
                  <span className="font-medium">{reportData.totalWaterUsed}L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-color">Total Fertilizer Used:</span>
                  <span className="font-medium">{reportData.totalFertilizerUsed}kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-color">Total Pesticide Used:</span>
                  <span className="font-medium">{reportData.totalPesticideUsed}L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-color">Crops Planted:</span>
                  <span className="font-medium">{reportData.crops?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="font-bold text-text-color mb-3">Farmer Information</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-text-color">Name:</span>
                <span className="font-medium">{reportData.farmer.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-color">Email:</span>
                <span className="font-medium">{reportData.farmer.email}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-text-color mb-4">Crop History</h2>
        {land.crops?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 font-medium text-text-color">Crop</th>
                  <th className="pb-3 font-medium text-text-color">Planting Date</th>
                  <th className="pb-3 font-medium text-text-color">Harvest Date</th>
                  <th className="pb-3 font-medium text-text-color">Yield</th>
                </tr>
              </thead>
              <tbody>
                {land.crops.map((crop, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 font-medium text-text-color">{crop.name}</td>
                    <td className="py-4 text-text-color">{new Date(crop.plantingDate).toLocaleDateString()}</td>
                    <td className="py-4 text-text-color">{new Date(crop.harvestDate).toLocaleDateString()}</td>
                    <td className="py-4 text-text-color">{crop.yield} tons/hectare</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-text-color">No crop history yet. Add your first crop to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandDetail;
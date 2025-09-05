import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { landAPI } from '../utils/api';


const ITEMS_PER_PAGE = 6;

const LandManagement = () => {
  const [lands, setLands] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    size: '',
    location: {
      address: ''
    },
    soilType: 'loamy'
  });
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    fetchLands();
  }, []);

  const fetchLands = async () => {
    try {
      const data = await landAPI.getLands();
      setLands(data);
    } catch (err) {
      setError('Failed to fetch lands');
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onLocationChange = (e) => {
    setFormData({
      ...formData,
      location: {
        ...formData.location,
        [e.target.name]: e.target.value
      }
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // Edit mode
        const updated = await landAPI.updateLand(editId, formData);
        setLands(lands.map(l => l._id === editId ? updated : l));
        setEditId(null);
      } else {
        // Create mode
        const data = await landAPI.createLand(formData);
        setLands([...lands, data]);
        // If new item causes a new page, go to last page
        if ((lands.length + 1) > currentPage * ITEMS_PER_PAGE) {
          setCurrentPage(Math.ceil((lands.length + 1) / ITEMS_PER_PAGE));
        }
      }
      setShowForm(false);
      setFormData({
        name: '',
        size: '',
        location: {
          address: ''
        },
        soilType: 'loamy'
      });
    } catch (err) {
      setError(editId ? 'Failed to update land parcel' : 'Failed to create land parcel');
    }
  };

  const onEdit = (land) => {
    setEditId(land._id);
    setFormData({
      name: land.name,
      size: land.size,
      location: { address: land.location?.address || '' },
      soilType: land.soilType || 'loamy',
    });
    setShowForm(true);
  };

  const onDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this land parcel?')) return;
    try {
      await landAPI.deleteLand(id);
      setLands(lands.filter(l => l._id !== id));
    } catch (err) {
      setError('Failed to delete land parcel');
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
    <div className="animate-fadeIn px-2 md:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-color mb-2">Land Management</h1>
        <p className="text-text-color">Register and manage your land parcels</p>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-6 animate-shake">
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl mb-8" style={{boxShadow: '0 2px 16px 0 rgba(34,197,94,0.07)'}}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-text-color">Your Land Parcels</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
          >
            {showForm ? 'Cancel' : 'Add New Land'}
          </button>
        </div>
        {showForm && (
          <form onSubmit={onSubmit} className="mb-8 p-6 bg-gray-50 rounded-xl animate-fadeIn">
            <h3 className="text-xl font-bold text-text-color mb-4">{editId ? 'Edit Land Parcel' : 'Add New Land Parcel'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-text-color font-medium mb-2">Land Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={onChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300 text-text-color"
                  placeholder="Enter land name"
                />
              </div>
              <div>
                <label htmlFor="size" className="block text-text-color font-medium mb-2">Size (acres)</label>
                <input
                  type="number"
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={onChange}
                  required
                  min="0"
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300 text-text-color"
                  placeholder="Enter size in acres"
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-text-color font-medium mb-2">Location</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.location.address}
                  onChange={onLocationChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300 text-text-color"
                  placeholder="Enter location address"
                />
              </div>
              <div>
                <label htmlFor="soilType" className="block text-text-color font-medium mb-2">Soil Type</label>
                <select
                  id="soilType"
                  name="soilType"
                  value={formData.soilType}
                  onChange={onChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300 text-text-color"
                >
                  <option value="clay">Clay</option>
                  <option value="sandy">Sandy</option>
                  <option value="silty">Silty</option>
                  <option value="peaty">Peaty</option>
                  <option value="chalky">Chalky</option>
                  <option value="loamy">Loamy</option>
                </select>
              </div>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition duration-300"
              >
                {editId ? 'Update Land Parcel' : 'Add Land Parcel'}
              </button>
            </div>
          </form>
        )}
  {lands.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🌱</div>
            <h3 className="text-xl font-medium text-text-color mb-2">No land parcels yet</h3>
            <p className="text-text-color mb-4">Get started by adding your first land parcel</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
            >
              Add Land Parcel
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lands
                .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
                .map((land) => (
                  <div
                    key={land._id}
                    className="rounded-xl p-6 hover:shadow-lg transition duration-300 bg-white"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-text-color">{land.name}</h3>
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {land.soilType}
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-text-color">Size:</span>
                        <span className="font-medium">{land.size} acres</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-color">Location:</span>
                        <span className="font-medium">{land.location?.address || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-color">Crops:</span>
                        <span className="font-medium">{land.crops?.length || 0} planted</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-color">Sustainability:</span>
                        <span className="font-medium">{land.sustainabilityScore}%</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex gap-4">
                      <button
                        onClick={() => navigate(`/land/${land._id}`)}
                        className="text-green-600 hover:text-green-800 font-medium text-sm"
                      >
                        View Details →
                      </button>
                      <button
                        onClick={() => onEdit(land)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(land._id)}
                        className="text-red-600 hover:text-red-800 font-medium text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
            {/* Pagination Controls */}
            <div className="flex justify-center mt-8">
              <nav className="inline-flex -space-x-px">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-l-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-100 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Prev
                </button>
                {Array.from({ length: Math.ceil(lands.length / ITEMS_PER_PAGE) }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-2 border-t border-b border-gray-300 bg-white text-gray-700 hover:bg-green-100 ${currentPage === i + 1 ? 'bg-green-200 font-bold' : ''}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(Math.ceil(lands.length / ITEMS_PER_PAGE), p + 1))}
                  disabled={currentPage === Math.ceil(lands.length / ITEMS_PER_PAGE) || lands.length === 0}
                  className={`px-3 py-2 rounded-r-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-100 ${currentPage === Math.ceil(lands.length / ITEMS_PER_PAGE) || lands.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Next
                </button>
              </nav>
            </div>
          </>
        )}
      </div>
      <div className="bg-white p-6 rounded-2xl" style={{boxShadow: '0 2px 16px 0 rgba(34,197,94,0.07)'}}>
        <h2 className="text-2xl font-bold text-text-color mb-4">Land Management Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
            <h3 className="font-bold text-text-color">Soil Testing</h3>
            <p className="text-text-color text-sm mt-2">Regular soil testing helps maintain optimal nutrient levels</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <h3 className="font-bold text-text-color">Water Management</h3>
            <p className="text-text-color text-sm mt-2">Implement efficient irrigation systems to conserve water</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
            <h3 className="font-bold text-text-color">Crop Rotation</h3>
            <p className="text-text-color text-sm mt-2">Rotate crops to prevent soil depletion and pest buildup</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandManagement;
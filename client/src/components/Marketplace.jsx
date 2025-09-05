import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../App';
// Helper to get full image URL
const getImageUrl = (img) => {
  if (img.startsWith('/uploads/')) {
    const backend = import.meta.env.PROD
      ? (import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || window.location.origin)
      : 'http://localhost:5000';
    return backend + img;
  }
  return img;
};
import { marketplaceAPI } from '../utils/api';

const MARKETPLACE_TYPES = [
  { value: 'produce', label: 'Farm Produce' },
  { value: 'land-sale', label: 'Land for Sale' },
  { value: 'land-lease', label: 'Land for Lease' },
  { value: 'equipment-sale', label: 'Equipment for Sale' },
  { value: 'equipment-lease', label: 'Equipment for Lease' }
];

const Marketplace = () => {
  const [items, setItems] = useState([]);
  const { user } = useContext(AuthContext);
  const [previewImg, setPreviewImg] = useState(null);
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await marketplaceAPI.deleteItem(id);
      fetchItems();
    } catch (err) {
      setError('Failed to delete item');
    }
  };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'produce',
    price: '',
    unit: '',
  });
  const [images, setImages] = useState([]);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await marketplaceAPI.getItems();
      setItems(data);
    } catch (err) {
      setError('Failed to fetch marketplace items');
    } finally {
      setLoading(false);
    }
  };


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError('');
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      images.forEach((img) => {
        formData.append('images', img);
      });
      await marketplaceAPI.createItem(formData, true);
      setShowForm(false);
      setForm({ title: '', description: '', type: 'produce', price: '', unit: '' });
      setImages([]);
      fetchItems();
    } catch (err) {
      setError('Failed to create item');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen bg-green-50 text-green-900">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-green-800">Marketplace</h1>
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add Listing'}
        </button>
      </div>
      {error && <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}
      {showForm && (
        <form onSubmit={handleCreate} className="p-6 rounded-2xl mb-8 bg-white text-green-900" encType="multipart/form-data">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Title"
              className="p-3 rounded-lg bg-green-100 text-green-900 placeholder-green-700 focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
              required
            />
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="p-3 rounded-lg bg-green-100 text-green-900 focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
              required
            >
              {MARKETPLACE_TYPES.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              className="p-3 rounded-lg bg-green-100 text-green-900 placeholder-green-700 focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
              required
            />
            <input
              type="text"
              name="unit"
              value={form.unit}
              onChange={handleChange}
              placeholder="Unit (e.g. kg, acre, per day)"
              className="p-3 rounded-lg bg-green-100 text-green-900 placeholder-green-700 focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
            />
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="col-span-2 p-3 rounded-lg bg-green-100 text-green-900 focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
            />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="col-span-2 p-3 rounded-lg bg-green-100 text-green-900 placeholder-green-700 focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
              required
              rows={3}
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
            disabled={creating}
          >
            {creating ? 'Adding...' : 'Add Listing'}
          </button>
        </form>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-5xl mb-4">🛒</div>
            <h3 className="text-xl font-medium mb-2 text-green-800">No listings yet</h3>
            <p className="mb-4 text-green-700">Add a new item to get started</p>
          </div>
        ) : (
          items.map(item => (
            <div key={item._id} className="rounded-xl p-6 bg-white shadow hover:shadow-lg transition duration-300 flex flex-col">
              <div className="mb-2 flex justify-between items-center">
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 font-semibold">
                  {MARKETPLACE_TYPES.find(t => t.value === item.type)?.label || item.type}
                </span>
                <span className="text-xs text-gray-500">{item.status}</span>
              </div>
              <h3 className="text-xl font-bold text-green-900 mb-1">{item.title}</h3>
              <p className="text-green-800 text-sm mb-2 flex-1">{item.description}</p>
              <div className="mt-2">
                <span className="font-bold text-green-700">KES {item.price}</span>
                {item.unit && <span className="ml-2 text-xs text-gray-600">per {item.unit}</span>}
              </div>
              {item.images && item.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {item.images.map((img, idx) => {
                    const url = getImageUrl(img);
                    return (
                      <img
                        key={idx}
                        src={url}
                        alt="Listing"
                        className="w-20 h-20 object-cover rounded cursor-pointer hover:opacity-80"
                        onClick={() => setPreviewImg(url)}
                      />
                    );
                  })}
                </div>
              )}
              <div className="mt-2 text-xs text-gray-500">Posted by: {item.postedBy?.name || 'User'} ({item.postedBy?.role || 'N/A'})</div>
              {user && item.postedBy && user._id === item.postedBy._id && (
                <button
                  className="mt-2 bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded self-end"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete Listing
                </button>
              )}
      {/* Image Preview Modal */}
      {previewImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={() => setPreviewImg(null)}>
          <img src={previewImg} alt="Preview" className="max-w-2xl max-h-[80vh] rounded-lg shadow-lg border-4 border-white" />
        </div>
      )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Marketplace;

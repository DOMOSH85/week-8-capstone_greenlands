import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../App';
import { authAPI } from '../utils/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'farmer',
    location: '',
    farmSize: '',
    department: '',
    phoneNumber: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const { name, email, password, role, location, farmSize, department, phoneNumber } = formData;
  
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const data = await authAPI.register({
        name,
        email,
        password,
        role,
        location: role === 'farmer' ? location : undefined,
        farmSize: role === 'farmer' ? farmSize : undefined,
        department: role === 'government' ? department : undefined,
        phoneNumber
      });
      
      login(data, data.token);
      if (data.role === 'farmer') {
        navigate('/dashboard');
      } else if (data.role === 'government') {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto animate-fadeIn">
      <div className="bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-8 text-text-color">Join Greenlands</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 animate-shake font-medium">
            {error}
          </div>
        )}
        
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-text-color font-medium mb-2">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={onChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300 text-text-color"
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-text-color font-medium mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={onChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300 text-text-color"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-text-color font-medium mb-2">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={onChange}
                required
                minLength="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300 text-text-color"
                placeholder="Create a password"
              />
            </div>
            
            <div>
              <label htmlFor="phoneNumber" className="block text-text-color font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={phoneNumber}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300 text-text-color"
                placeholder="Enter your phone number"
              />
            </div>
            
            <div>
              <label htmlFor="role" className="block text-text-color font-medium mb-2">Role</label>
              <select
                id="role"
                name="role"
                value={role}
                onChange={onChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300 text-text-color"
              >
                <option value="farmer">Farmer</option>
                <option value="government">Government Official</option>
              </select>
            </div>
            
            {role === 'farmer' ? (
              <>
                <div>
                  <label htmlFor="location" className="block text-text-color font-medium mb-2">Farm Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={location}
                    onChange={onChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300 text-text-color"
                    placeholder="Enter your farm location"
                  />
                </div>
                
                <div>
                  <label htmlFor="farmSize" className="block text-text-color font-medium mb-2">Farm Size (acres)</label>
                  <input
                    type="number"
                    id="farmSize"
                    name="farmSize"
                    value={farmSize}
                    onChange={onChange}
                    required
                    min="0"
                    step="0.1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300 text-text-color"
                    placeholder="Enter farm size in acres"
                  />
                </div>
              </>
            ) : (
              <div>
                <label htmlFor="department" className="block text-text-color font-medium mb-2">Department</label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={department}
                  onChange={onChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300 text-text-color"
                  placeholder="Enter your department"
                />
              </div>
            )}
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:from-green-600 hover:to-blue-700 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-text-color">
            Already have an account?{' '}
            <Link to="/login" className="text-green-600 hover:text-green-800 font-medium transition duration-300 underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
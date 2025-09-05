import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
  <div className="min-h-screen bg-green-50 animate-fadeIn">
      {/* Hero Section */}
      <section className="text-center py-20 bg-transparent text-green-700 mb-16">
        <div className="px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-bounceIn">
          Sustainable Land Management
        </h1>
        <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto animate-fadeInUp">
          Empowering farmers and governments with technology for a greener future
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {!user ? (
            <>
              <Link
                to="/register"
                className="bg-white text-green-700 hover:bg-green-100 font-bold py-3 px-8 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="bg-green-100 text-green-700 hover:bg-green-200 font-bold py-3 px-8 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105"
              >
                Login
              </Link>
            </>
          ) : (
            <Link
              to="/dashboard"
              className="bg-white text-green-700 hover:bg-green-100 font-bold py-3 px-8 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      </div>
    </section>
    {/* Features Section */}
    <section className="py-16">
      <div className="px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-green-800">Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <button
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-2 text-left w-full focus:outline-none"
            onClick={() => navigate('/features/land-monitoring')}
          >
            <div className="text-5xl mb-6 text-green-500">🌱</div>
            <h3 className="text-2xl font-bold mb-4 text-green-800">Land Monitoring</h3>
            <p className="text-green-700">
              Monitor soil health, water usage, and crop growth in real time using smart sensors and data dashboards.
            </p>
          </button>
          <button
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-2 text-left w-full focus:outline-none"
            onClick={() => navigate('/features/analytics-dashboard')}
          >
            <div className="text-5xl mb-6 text-blue-500">📊</div>
            <h3 className="text-2xl font-bold mb-4 text-green-800">Analytics Dashboard</h3>
            <p className="text-green-700">
              Visualize sustainability trends, land usage, and policy impact with interactive analytics for smarter decisions.
            </p>
          </button>
          <button
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-2 text-left w-full focus:outline-none"
            onClick={() => navigate('/features/collaborative-platform')}
          >
            <div className="text-5xl mb-6 text-purple-500">🤝</div>
            <h3 className="text-2xl font-bold mb-4 text-green-800">Collaborative Platform</h3>
            <p className="text-green-700">
              Connect farmers and government for seamless communication, resource sharing, and policy feedback.
            </p>
          </button>
          <button
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-2 text-left w-full focus:outline-none"
            onClick={() => navigate('/features/remote-sensing-iot')}
          >
            <div className="text-5xl mb-6 text-yellow-500">🛰️</div>
            <h3 className="text-2xl font-bold mb-4 text-green-800">Remote Sensing & IoT</h3>
            <p className="text-green-700">
              Harness satellite imagery and IoT devices for precision agriculture and sustainable land management.
            </p>
          </button>
          <button
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-2 text-left w-full focus:outline-none"
            onClick={() => navigate('/features/ai-insights')}
          >
            <div className="text-5xl mb-6 text-pink-500">🤖</div>
            <h3 className="text-2xl font-bold mb-4 text-green-800">AI-Powered Insights</h3>
            <p className="text-green-700">
              Receive smart, actionable recommendations for land use and sustainability powered by machine learning.
            </p>
          </button>
          <button
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-2 text-left w-full focus:outline-none"
            onClick={() => navigate('/features/marketplace')}
          >
            <div className="text-5xl mb-6 text-orange-500">🛒</div>
            <h3 className="text-2xl font-bold mb-4 text-green-800">Marketplace</h3>
            <p className="text-green-700">
              Buy and sell farm produce, land, and equipment. Farmers and government can list items for sale or lease.
            </p>
            <Link to="/marketplace" className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-lg transition duration-300">Visit Marketplace</Link>
          </button>
        </div>
      </div>
    </section>
    {/* How It Works Section */}
    <section className="py-16 bg-green-100">
      <div className="px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-green-800">How It Works</h2>
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-center flex-1">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 animate-pulse">
              1
            </div>
            <h3 className="text-2xl font-bold mb-4 text-green-800">Register</h3>
            <p className="text-green-700">
              Farmers and government officials create accounts tailored to their roles.
            </p>
          </div>
                    
          <div className="text-center flex-1">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 animate-pulse">
              2
            </div>
            <h3 className="text-2xl font-bold mb-4 text-green-800">Monitor</h3>
            <p className="text-green-700">
              Track land usage, sustainability metrics, and environmental impact.
            </p>
          </div>
                    
          <div className="text-center flex-1">
            <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 animate-pulse">
              3
            </div>
            <h3 className="text-2xl font-bold mb-4 text-green-800">Collaborate</h3>
            <p className="text-green-700">
              Share insights and work together for sustainable land management.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
  );
};

export default Home;
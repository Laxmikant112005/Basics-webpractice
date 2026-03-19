import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { engineerAPI } from '../services/api';

const EarningsDashboard = ({ engineerId }) => {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const response = await engineerAPI.getEarnings(engineerId);
        setEarnings(response.data);
      } catch (err) {
        setError('Failed to load earnings data');
      } finally {
        setLoading(false);
      }
    };

    if (engineerId) {
      fetchEarnings();
    }
  }, [engineerId]);

  if (loading) return <div>Loading earnings...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Earnings Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6 rounded-xl">
          <h3 className="text-lg font-semibold">Total Earnings</h3>
          <p className="text-3xl font-bold mt-2">₹{earnings?.totalEarnings?.toLocaleString() || 0}</p>
        </div>
        <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6 rounded-xl">
          <h3 className="text-lg font-semibold">Completed Projects</h3>
          <p className="text-3xl font-bold mt-2">{earnings?.completedProjects || 0}</p>
        </div>
        <div className="bg-gradient-to-r from-purple-400 to-purple-600 text-white p-6 rounded-xl">
          <h3 className="text-lg font-semibold">Avg per Project</h3>
          <p className="text-3xl font-bold mt-2">
            {earnings?.completedProjects > 0 
              ? `₹${Math.round((earnings.totalEarnings / earnings.completedProjects) || 0).toLocaleString()}` 
              : '₹0'
            }
          </p>
        </div>
      </div>
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
        <p className="text-gray-600">Recent payments and project updates will appear here.</p>
      </div>
    </div>
  );
};

export default EarningsDashboard;

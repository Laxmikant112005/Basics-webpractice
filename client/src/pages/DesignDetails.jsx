// Enhanced DesignDetails with 3D Viewer
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { DesignCard, ModelViewer } from '../components';
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const DesignDetails = () => {
  const { id } = useParams();
  const { get } = useApi(`/designs`);
  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDesign = async () => {
      setLoading(true);
      try {
        const response = await get(id);
        setDesign(response.data);
      } catch (error) {
        console.error('Error fetching design:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDesign();
  }, [id, get]);

  if (loading) {
    return <div>Loading design...</div>;
  }

  if (!design) {
    return <div>Design not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to="/designs" className="flex items-center text-blue-600 hover:text-blue-800 font-medium mb-4">
            <FaArrowLeft className="mr-2" />
            Back to Designs
          </Link>
          <div className="flex items-start justify-between gap-8">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{design.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  {design.specifications?.type || 'N/A'}
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  {design.specifications?.style || 'N/A'}
                </span>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                  {design.specifications?.floors} Floors
                </span>
                <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
                  {design.specifications?.totalArea} sqft
                </span>
              </div>
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center">
                  <span className="text-2xl">₹</span>
                  <span className="text-4xl font-bold text-gray-900">
                    {design.specifications?.estimatedCost?.toLocaleString()}
                  </span>
                </div>
                <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all">
                  Book Consultation
                </button>
              </div>
            </div>
            <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <img src={design.files?.images[0]?.thumbnailUrl || '/api/placeholder/128/128'} alt={design.title} className="w-20 h-20 rounded-xl shadow-lg" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* 3D Viewer */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold text-gray-900">3D Visualization</h2>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 text-sm rounded-xl font-medium">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm0 3a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L9.586 8H4a1 1 0 100 2z" clipRule="evenodd" />
                </svg>
                Interactive
              </div>
            </div>
            <ModelViewer 
              modelUrl={design.files?.model3d?.url}
              floorPlanImage={design.files?.floorPlans?.[0]?.url || design.files?.images?.[0]?.url}
              className="h-[500px] w-full"
            />
            <div className="grid md:grid-cols-3 gap-4">
              <button className="md:col-span-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-4 px-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all">
                Save to My Designs
              </button>
              <button 
                onClick={handleFindEngineers}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white py-4 px-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                🔍 Find Engineers
              </button>
            </div>
          </div>

          {/* Engineers Discovery Section */}
          {showEngineers && (
            <div className="mt-8 p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Nearby Engineers for This Design</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {engineers.slice(0, 6).map(engineer => (
                  <div key={engineer.id} className="group bg-gradient-to-br from-slate-50 to-blue-50 p-6 rounded-2xl hover:shadow-2xl hover:-translate-y-2 transition-all border hover:border-blue-200">
                    <div className="flex items-start gap-4 mb-4">
                      <img 
                        src={engineer.avatar || '/api/placeholder/80/80'} 
                        alt={engineer.firstName}
                        className="w-16 h-16 rounded-2xl object-cover shadow-lg ring-2 ring-white/50"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-gray-900 mb-1">
                          {engineer.firstName} {engineer.lastName}
                        </h4>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-lg ${i < Math.floor(engineer.engineerProfile.rating.average) ? 'text-amber-400' : 'text-gray-300'} `}>
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">({engineer.engineerProfile.rating.count} reviews)</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {engineer.engineerProfile.experience}+ years | ₹{engineer.engineerProfile.pricePerSqft?.toLocaleString()}/sqft
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mb-4 flex-wrap">
                      {engineer.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-white/80 text-xs font-semibold text-gray-800 rounded-full shadow-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-xl font-semibold transition-all group-hover:shadow-lg">
                        View Profile
                      </button>
                      <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-all group-hover:shadow-lg">
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          

          {/* Details Panel */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Specifications</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">Plot Size</label>
                  <p className="text-xl font-bold text-gray-900">{design.specifications?.totalArea} sqft</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">BHK Type</label>
                  <p className="text-xl font-bold text-gray-900">{design.specifications?.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">Style</label>
                  <p className="text-xl font-bold text-gray-900">{design.specifications?.style}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">Facing</label>
                  <p className="text-xl font-bold text-gray-900">{design.specifications?.facing || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Description</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {design.description}
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Engineer Details</h3>
              <div className="flex gap-6 p-6 bg-white rounded-2xl shadow-lg">
                <img 
                  src={design.engineerId?.avatar || '/api/placeholder/80/80'} 
                  alt={design.engineerId?.firstName}
                  className="w-24 h-24 rounded-2xl object-cover shadow-lg ring-4 ring-white"
                />
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-900 mb-1">
                    {design.engineerId?.firstName} {design.engineerId?.lastName}
                  </h4>
                  <p className="text-2xl font-bold text-emerald-600 mb-2">
                    {design.engineerId?.engineerProfile?.rating?.average || 0} ★
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    {design.engineerId?.engineerProfile?.experience} years experience
                  </p>
                  <div className="flex gap-2 text-sm">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                      Verified
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {design.engineerId?.engineerProfile?.specializations?.[0] || 'Architecture'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignDetails;


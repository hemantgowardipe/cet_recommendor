import { useState, useEffect } from "react";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar
} from 'recharts';
import AdmissionPredictor from "./components/AdmissionPredictor";
import SeatTypesInfo from "./components/SeatTypesInfo";
import { Search, MapPin, BookOpen, TrendingUp, Download, X, Filter, Eye, Sparkles, BarChart3, ArrowRight, Users, Award, Clock, Info } from 'lucide-react';

function App() {
  const [percentile, setPercentile] = useState("");
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [seatTypeFilter, setSeatTypeFilter] = useState([]);
  const [branchFilter, setBranchFilter] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [cityOptions, setCityOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [trendsData, setTrendsData] = useState([]);
  const [showTrends, setShowTrends] = useState(false);
  const [seatTypeOptions, setSeatTypeOptions] = useState([]);
  const [selectedSeatTypes, setSelectedSeatTypes] = useState([]);
  const [showTrendModal, setShowTrendModal] = useState(false);
  const [trendCollege, setTrendCollege] = useState("");
  const [trendBranch, setTrendBranch] = useState("");
  const [trendData, setTrendData] = useState([]);
  const [activeTab, setActiveTab] = useState('search');
  const [showPredictionModal, setShowPredictionModal] = useState(false);


  // Function to fetch trend 
  const fetchBranchTrends = async () => {
    try {
      const response = await fetch("http://localhost:5000/branch-trends");
      const data = await response.json();
      setTrendsData(data);
      setShowTrends(true);
    } catch (err) {
      setError("Failed to fetch branch trends.");
    }
  };

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await fetch("http://localhost:5000/filters");
        const data = await response.json();
        setCityOptions(data.cities);
        setBranchOptions(data.branches);
        setSeatTypeOptions(data.seat_types);
      } catch (err) {
        console.error("Failed to fetch filters:", err);
      }
    };
    fetchFilters();
  }, []);

  // Filtering logic
  const filteredData = chartData.filter(item =>
    (seatTypeFilter.length === 0 || seatTypeFilter.includes(item.seat_type)) &&
    (branchFilter.length === 0 || branchFilter.includes(item.branch))
  );

  const getColor = (index) => {
    const colors = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#8b5cf6"];
    return colors[index % colors.length];
  };

  const exportChart = () => {
    const chart = document.getElementById("chartContainer");
    if (chart) {
      console.log("Export functionality would be implemented here");
    }
  };

  const handleMultiSelect = (e, setter) => {
    const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
    setter(selected);
  };

  const handleSubmit = async () => {
    if (!percentile) return;
    
    setLoading(true);
    setError("");
    setResults([]);

    try {
      const response = await fetch("http://localhost:5000/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          percentile: parseFloat(percentile),
          cities: selectedCities,
          branches: selectedBranches,
          seat_types: selectedSeatTypes,
          score_type: "MHT-CET"
        }),
      });

      if (!response.ok) {
        throw new Error("Server returned an error.");
      }

      const data = await response.json();
      setResults(data);
      setActiveTab('results');
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  
  const fetchCollegeStats = async (collegeName, branch = null, percentile = null) => {
    try {
      let url = `http://localhost:5000/college-stats?college=${encodeURIComponent(collegeName)}`;

      if (branch) url += `&branch=${encodeURIComponent(branch)}`;
      if (percentile) url += `&percentile=${percentile}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Could not fetch stats.");
      const data = await response.json();
      setChartData(data);
      setSelectedCollege(collegeName);

      setSeatTypeFilter([...new Set(data.map(item => item.seat_type))]);
      setBranchFilter([...new Set(data.map(item => item.branch))]);

    } catch (err) {
      setError("Error fetching chart data.");
    }
  };

  const handleFetchBranchTrends = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `http://localhost:5000/branch-trend?college=${encodeURIComponent(trendCollege)}&branch=${encodeURIComponent(trendBranch)}`
      );
      if (!res.ok) throw new Error("Failed to fetch trend data");

      const data = await res.json();
      setTrendData(data);
    } catch (err) {
      console.error("Trend fetch error:", err);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">{`Branch: ${label}`}</p>
          <p className="text-indigo-600">{`Percentile: ${payload[0].value}`}</p>
          <p className="text-gray-600">{`Seat Type: ${payload[0].payload.seat_type}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 font-sans">CET College Recommender</h1>
                <p className="text-sm text-gray-500">Find your perfect college match</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('search')}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === 'search' 
                    ? 'bg-indigo-100 text-indigo-700 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Search className="w-4 h-4 inline mr-2" />
                Search
              </button>
              <button
                onClick={() => setActiveTab('trends')}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === 'trends' 
                    ? 'bg-indigo-100 text-indigo-700 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Branch Trends
              </button>
              {results.length > 0 && (
                <button
                  onClick={() => setActiveTab('results')}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === 'results' 
                      ? 'bg-indigo-100 text-indigo-700 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <BookOpen className="w-4 h-4 inline mr-2" />
                  Results ({results.length})
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Tab */}
        {activeTab === 'search' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6">
                <Award className="w-4 h-4" />
                AI-Powered College Recommendations
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Find Your <span className="text-transparent bg-clip-text font-mono bg-gradient-to-r from-indigo-600 to-purple-600">Perfect College</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto font-serif">
                Get personalized college recommendations based on your CET percentile, preferred cities, and branches.
              </p>
            </div>
            <button
                className="fixed top-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded shadow-md hover:bg-indigo-700 z-50"
                onClick={() => setShowPredictionModal(true)}
              >
                Predict Admission
              </button>
              {showPredictionModal && (
                <AdmissionPredictor onClose={() => setShowPredictionModal(false)} />
              )}

            {/* Enhanced Form */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Search className="w-6 h-6" />
                  College Search Parameters
                </h3>
                <p className="text-indigo-100 mt-2">Fill in your details to get personalized recommendations</p>
              </div>

              <div className="p-8">
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Percentile Input */}
                    <div className="group">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                        <div className="p-1 bg-indigo-100 rounded-lg">
                          <TrendingUp className="w-4 h-4 text-indigo-600" />
                        </div>
                        CET Percentile
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={percentile}
                          onChange={(e) => setPercentile(e.target.value)}
                          step="0.01"
                          min="0"
                          max="100"
                          required
                          placeholder="Enter your CET percentile (0-100)"
                          className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-800 text-lg group-hover:border-gray-300"
                        />
                        <div className="absolute right-4 top-4 text-gray-400 text-lg font-semibold">%</div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        Enter your actual CET percentile for accurate recommendations
                      </p>
                    </div>

                    {/* Seat Types */}
                    <div className="group">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                        <div className="p-1 bg-purple-100 rounded-lg">
                          <Users className="w-4 h-4 text-purple-600" />
                        </div>
                        Seat Categories
                      </label>
                      <div className="relative">
                        <select 
                          multiple 
                          value={selectedSeatTypes} 
                          onChange={(e) =>
                            setSelectedSeatTypes(Array.from(e.target.selectedOptions).map(o => o.value))
                          }
                          className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-800 min-h-[120px] group-hover:border-gray-300"
                        >
                          {seatTypeOptions.map((type) => (
                            <option key={type} value={type} className="py-2">{type}</option>
                          ))}
                        </select>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        Hold Ctrl/Cmd to select multiple categories
                      </p>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Cities Selection */}
                    <div className="group">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                        <div className="p-1 bg-green-100 rounded-lg">
                          <MapPin className="w-4 h-4 text-green-600" />
                        </div>
                        Preferred Cities
                      </label>
                      <select 
                        multiple 
                        value={selectedCities} 
                        onChange={(e) => handleMultiSelect(e, setSelectedCities)}
                        className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-800 min-h-[120px] group-hover:border-gray-300"
                      >
                        {cityOptions.map((city) => (
                          <option key={city} value={city} className="py-2">{city}</option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        Select cities where you'd prefer to study
                      </p>
                    </div>

                    {/* Branches Selection */}
                    <div className="group">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                        <div className="p-1 bg-orange-100 rounded-lg">
                          <BookOpen className="w-4 h-4 text-orange-600" />
                        </div>
                        Engineering Branches
                      </label>
                      <select 
                        multiple 
                        value={selectedBranches} 
                        onChange={(e) => handleMultiSelect(e, setSelectedBranches)}
                        className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-800 min-h-[120px] group-hover:border-gray-300"
                      >
                        {branchOptions.map((branch) => (
                          <option key={branch} value={branch} className="py-2">{branch}</option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        Choose your preferred engineering branches
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-10 flex justify-center">
                  <button 
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading || !percentile}
                    className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none transition-all duration-200 flex items-center gap-3 text-lg"
                  >
                    {loading ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Finding Perfect Matches...
                      </>
                    ) : (
                      <>
                        <Search className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                        Find My Colleges
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-xl">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <X className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Branch Trends Tab */}
        {activeTab === 'trends' && (
          <div className="space-y-8">
            <div className="text-center py-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6">
                <BarChart3 className="w-4 h-4" />
                Historical Data Analysis
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Branch <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Admission Trends</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Analyze historical admission trends for specific colleges and branches
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <BarChart3 className="w-6 h-6" />
                  Search Branch Trends
                </h3>
                <p className="text-indigo-100 mt-2">Enter college and branch details to view historical trends</p>
              </div>

              <div className="p-8">
                <form onSubmit={handleFetchBranchTrends} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                        <div className="p-1 bg-indigo-100 rounded-lg">
                          <BookOpen className="w-4 h-4 text-indigo-600" />
                        </div>
                        College Name
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={trendCollege}
                        onChange={(e) => setTrendCollege(e.target.value)}
                        placeholder="Enter exact college name"
                        className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-800 group-hover:border-gray-300"
                        required
                      />
                    </div>

                    <div className="group">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                        <div className="p-1 bg-purple-100 rounded-lg">
                          <TrendingUp className="w-4 h-4 text-purple-600" />
                        </div>
                        Branch Name
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={trendBranch}
                        onChange={(e) => setTrendBranch(e.target.value)}
                        placeholder="Enter exact branch name"
                        className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-800 group-hover:border-gray-300"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-center pt-4">
                    <button
                      type="submit"
                      className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-3 text-lg"
                    >
                      <BarChart3 className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                      Generate Trend Analysis
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                  </div>
                </form>

                {/* Trend Chart */}
                {trendData.length > 0 && (
                  <div className="mt-12 p-6 bg-gray-50 rounded-2xl">
                    <div className="mb-6">
                      <h4 className="text-xl font-bold text-gray-900 mb-2">
                        Trend Analysis: {trendCollege} - {trendBranch}
                      </h4>
                      <p className="text-gray-600">Historical admission percentile trends over the years</p>
                    </div>
                    
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis 
                            dataKey="year" 
                            fontSize={12}
                            stroke="#6b7280"
                            tick={{ fill: '#6b7280' }}
                          />
                          <YAxis 
                            fontSize={12}
                            stroke="#6b7280"
                            tick={{ fill: '#6b7280' }}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'white',
                              border: '1px solid #e5e7eb',
                              borderRadius: '12px',
                              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                          <Legend />
                          <Bar 
                            dataKey="average_percentile" 
                            fill="#6366f1" 
                            radius={[4, 4, 0, 0]}
                            name="Average Percentile"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && results.length > 0 && (
          <div className="space-y-8">
            <div className="text-center py-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">
                <Award className="w-4 h-4" />
                {results.length} Colleges Found
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Perfect Matches</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Based on your {percentile}% CET percentile, here are your recommended colleges
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <BookOpen className="w-6 h-6" />
                  Recommended Colleges
                </h3>
                <p className="text-indigo-100 mt-2">Click "View Analytics" to see detailed admission statistics</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">College Details</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Branch</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Min Percentile</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {results.map((row, index) => (
                      <tr key={index} className="hover:bg-indigo-50/50 transition-colors duration-200">
                        <td className="px-6 py-6">
                          <div>
                            <div className="font-semibold text-gray-900 text-base mb-1">{row.college_name}</div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              {row.city_guess}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="text-sm font-medium text-gray-900">{row.branch}</div>
                        </td>
                        <td className="px-6 py-6">
                          <span className="inline-flex px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
                            {row.seat_type}
                          </span>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-gray-900">{row.min.toFixed(2)}%</span>
                            {parseFloat(percentile) >= row.min && (
                              <span className="inline-flex px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                Eligible
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-6 text-center">
                          <button 
                            onClick={() => fetchCollegeStats(row.college_name, row.branch, row.min.toFixed(2))}
                            className="group px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-medium rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2 mx-auto"
                          >
                            <Eye className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                            View Analytics
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* College Analytics Modal */}
        {selectedCollege && chartData.length > 0 && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
              {/* Modal Header */}
              <div className="px-8 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <TrendingUp className="w-6 h-6" />
                    College Analytics Dashboard
                  </h2>
                  <p className="text-indigo-100 mt-1">{selectedCollege}</p>
                </div>
                <button 
                  onClick={() => setSelectedCollege(null)}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors duration-200 group"
                >
                  <X className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto max-h-[calc(95vh-100px)]">
                {/* Analytics Controls */}
                <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Analytics Controls</h3>
                    <div className="flex-1"></div>
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                        showFilters 
                          ? 'bg-indigo-100 text-indigo-700 shadow-sm' 
                          : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Filter className="w-4 h-4" />
                      {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>
                    
                    <button 
                      onClick={exportChart}
                      className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl flex items-center gap-2 transition-all duration-200 transform hover:scale-105"
                    >
                      <Download className="w-4 h-4" />
                      Export Chart
                    </button>

                    <button
                      onClick={() => fetchCollegeStats(selectedCollege)}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition-all duration-200"
                    >
                      Reset View
                    </button>
                  </div>

                  {/* Advanced Filters */}
                  {showFilters && (
                    <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Filter by Seat Types:</label>
                        <div className="relative">
                          <select 
                            multiple 
                            value={seatTypeFilter}
                            onChange={(e) => setSeatTypeFilter(Array.from(e.target.selectedOptions).map(o => o.value))}
                            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm min-h-[100px]"
                          >
                            {[...new Set(chartData.map(d => d.seat_type))].map((type, i) => (
                              <option key={i} value={type} className="py-1">{type}</option>
                            ))}
                          </select>
                        </div>
                        <p className="text-xs text-gray-500">Hold Ctrl/Cmd to select multiple</p>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Filter by Branches:</label>
                        <div className="relative">
                          <select 
                            multiple 
                            value={branchFilter}
                            onChange={(e) => setBranchFilter(Array.from(e.target.selectedOptions).map(o => o.value))}
                            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm min-h-[100px]"
                          >
                            {[...new Set(chartData.map(d => d.branch))].map((branch, i) => (
                              <option key={i} value={branch} className="py-1">{branch}</option>
                            ))}
                          </select>
                        </div>
                        <p className="text-xs text-gray-500">Hold Ctrl/Cmd to select multiple</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Statistics Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-100 rounded-xl">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Total Data Points</h4>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{filteredData.length}</p>
                    <p className="text-sm text-gray-600">Admission records analyzed</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-green-100 rounded-xl">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Avg Percentile</h4>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      {filteredData.length > 0 ? (filteredData.reduce((sum, item) => sum + item.percentile, 0) / filteredData.length).toFixed(1) : 0}%
                    </p>
                    <p className="text-sm text-gray-600">Across all branches</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-purple-100 rounded-xl">
                        <BookOpen className="w-5 h-5 text-purple-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Branches</h4>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">{[...new Set(filteredData.map(d => d.branch))].length}</p>
                    <p className="text-sm text-gray-600">Available options</p>
                  </div>
                </div>

                {/* Enhanced Chart */}
                <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900">Admission Percentile Distribution</h4>
                    <p className="text-sm text-gray-600 mt-1">Branch-wise percentile requirements across different seat categories</p>
                  </div>
                  
                  <div id="chartContainer" className="p-6">
                    <ResponsiveContainer width="100%" height={600}>
                      <ScatterChart margin={{ top: 20, right: 20, bottom: 100, left: 20 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                              <XAxis 
                                type="category" 
                                dataKey="branch" 
                                angle={-45} 
                                textAnchor="end" 
                                interval={0} 
                                height={120}
                                fontSize={12}
                                stroke="#6b7280"
                              />
                              <YAxis 
                                type="number" 
                                dataKey="percentile" 
                                domain={[0, 100]} 
                                fontSize={12}
                                stroke="#6b7280"
                              />
                              <Tooltip />
                              <Legend />
                              {[...new Set(filteredData.map(d => d.seat_type))].map((type, i) => (
                                <Scatter
                                  key={type}
                                  name={type}
                                  data={filteredData.filter(d => d.seat_type === type)}
                                  fill={getColor(i)}
                                />
                              ))}
                            </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );  
}

export default App;
import { useState, useEffect } from "react";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar
} from 'recharts';
import AdmissionPredictor from "./components/AdmissionPredictor";
import SeatTypesInfo from "./components/SeatTypesInfo";
import { 
  Search, MapPin, BookOpen, TrendingUp, Download, X, Filter, Eye, Sparkles, 
  BarChart3, ArrowRight, Users, Award, Clock, Info, ChevronDown, Star,
  Building, GraduationCap, Target, AlertCircle, CheckCircle
} from 'lucide-react';

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
  const [showSeatTypesModal, setShowSeatTypesModal] = useState(false);

  // Function to fetch trend 
  const fetchBranchTrends = async () => {
    try {
      const response = await fetch("https://cet-recommendor.onrender.com/branch-trends");
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
        const response = await fetch("https://cet-recommendor.onrender.com/filters");
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
    const colors = ["#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];
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
      const response = await fetch("https://cet-recommendor.onrender.com/recommend", {
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
      let url = `https://cet-recommendor.onrender.com/college-stats?college=${encodeURIComponent(collegeName)}`;

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
        `https://cet-recommendor.onrender.com/branch-trend?college=${encodeURIComponent(trendCollege)}&branch=${encodeURIComponent(trendBranch)}`
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
        <div className="bg-white/95 backdrop-blur-md p-3 rounded-lg shadow-lg border border-gray-200/80">
          <p className="font-medium text-gray-900 text-sm">{`Branch: ${label}`}</p>
          <p className="text-blue-600 font-medium text-sm">{`Percentile: ${payload[0].value}`}</p>
          <p className="text-gray-500 text-xs">{`Seat Type: ${payload[0].payload.seat_type}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-white font-['Inter',_system-ui,_-apple-system,_'Segoe_UI',_sans-serif]">
      {/* Clean Navigation Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Simple Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  CET Recommender
                </h1>
              </div>
            </div>
            
            {/* Clean Navigation */}
            <div className="hidden md:flex items-center gap-1">
              <button
                onClick={() => setActiveTab('search')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'search' 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Search
              </button>
              <button
                onClick={() => setActiveTab('trends')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'trends' 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Analytics
              </button>
              {results.length > 0 && (
                <button
                  onClick={() => setActiveTab('results')}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors relative ${
                    activeTab === 'results' 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Results
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                    {results.length}
                  </span>
                </button>
              )}
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <select 
                value={activeTab} 
                onChange={(e) => setActiveTab(e.target.value)}
                className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="search">Search</option>
                <option value="trends">Analytics</option>
                {results.length > 0 && <option value="results">Results ({results.length})</option>}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2">
        <button
          onClick={() => setShowPredictionModal(true)}
          className="group bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
        >
          <Target className="w-5 h-5" />
          <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Predict Admission
          </div>
        </button>
        <button
          onClick={() => setShowSeatTypesModal(true)}
          className="group bg-gray-900 hover:bg-black text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
        >
          <Info className="w-5 h-5" />
          <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Seat Types Info
          </div>
        </button>
      </div>

      {/* Modals */}
      {showPredictionModal && (
        <AdmissionPredictor onClose={() => setShowPredictionModal(false)} />
      )}
      {showSeatTypesModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Seat Types Information</h2>
              <button 
                onClick={() => setShowSeatTypesModal(false)}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <SeatTypesInfo />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search Tab */}
        {activeTab === 'search' && (
          <div className="space-y-12">
            {/* Clean Hero Section */}
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                AI-Powered Recommendations
              </div>
              <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4 tracking-tight leading-tight"
                   style={{ fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif", fontWeight: 600 }}>
                Find your ideal college
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Get personalized engineering college recommendations based on your CET percentile and preferences.
              </p>
              
              {/* Clean Stats */}
              <div className="flex justify-center items-center gap-8 mt-8 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-medium text-gray-900" style={{ fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif" }}>1000+</div>
                  <div className="text-gray-500">Colleges</div>
                </div>
                <div className="w-px h-8 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-2xl font-medium text-gray-900" style={{ fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif" }}>50+</div>
                  <div className="text-gray-500">Branches</div>
                </div>
                <div className="w-px h-8 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-2xl font-medium text-gray-900" style={{ fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif" }}>100%</div>
                  <div className="text-gray-500">Accurate</div>
                </div>
              </div>
            </div>

            {/* Clean Search Form */}
            <div className="bg-white border border-gray-200 rounded-xl">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Search Colleges</h3>
                <p className="text-gray-600 text-sm mt-1">Enter your details to find matching colleges</p>
              </div>

              <div className="p-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Percentile Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        CET Percentile <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={percentile}
                        onChange={(e) => setPercentile(e.target.value)}
                        step="0.01"
                        min="0"
                        max="100"
                        required
                        placeholder="Enter your CET percentile"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter your actual CET percentile for accurate recommendations
                      </p>
                    </div>

                    {/* Seat Types */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Seat Categories
                      </label>
                      <select 
                        multiple 
                        value={selectedSeatTypes} 
                        onChange={(e) =>
                          setSelectedSeatTypes(Array.from(e.target.selectedOptions).map(o => o.value))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                      >
                        {seatTypeOptions.map((type) => (
                          <option key={type} value={type} className="py-1">{type}</option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Cities */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Preferred Cities
                      </label>
                      <select 
                        multiple 
                        value={selectedCities} 
                        onChange={(e) => handleMultiSelect(e, setSelectedCities)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                      >
                        {cityOptions.map((city) => (
                          <option key={city} value={city} className="py-1">{city}</option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Choose cities where you'd like to study</p>
                    </div>

                    {/* Branches */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Engineering Branches
                      </label>
                      <select 
                        multiple 
                        value={selectedBranches} 
                        onChange={(e) => handleMultiSelect(e, setSelectedBranches)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                      >
                        {branchOptions.map((branch) => (
                          <option key={branch} value={branch} className="py-1">{branch}</option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Select your preferred specializations</p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8 flex justify-center">
                  <button 
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading || !percentile}
                    className="px-6 py-3 bg-black hover:bg-gray-900 disabled:bg-gray-400 text-white font-medium rounded-md transition-colors duration-200 flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Finding matches...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        Find Colleges
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-md">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'trends' && (
          <div className="space-y-8">
            <div className="text-center py-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium mb-4">
                <BarChart3 className="w-4 h-4" />
                Historical Data
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Branch Analytics</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Analyze historical admission trends for specific colleges and branches
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Trend Analysis</h3>
                <p className="text-gray-600 text-sm mt-1">Get admission patterns for specific college-branch combinations</p>
              </div>

              <div className="p-6">
                <form onSubmit={handleFetchBranchTrends} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        College Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={trendCollege}
                        onChange={(e) => setTrendCollege(e.target.value)}
                        placeholder="Enter exact college name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Branch Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={trendBranch}
                        onChange={(e) => setTrendBranch(e.target.value)}
                        placeholder="Enter exact branch name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-black hover:bg-gray-900 text-white font-medium rounded-md transition-colors duration-200 flex items-center gap-2"
                    >
                      <BarChart3 className="w-4 h-4" />
                      Generate Analysis
                    </button>
                  </div>
                </form>

                {/* Trend Chart */}
                {trendData.length > 0 && (
                  <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">
                        {trendCollege} - {trendBranch}
                      </h4>
                      <p className="text-gray-600 text-sm">Historical admission percentile trends</p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis 
                            dataKey="year" 
                            fontSize={12}
                            stroke="#64748b"
                          />
                          <YAxis 
                            fontSize={12}
                            stroke="#64748b"
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'white',
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px',
                              fontSize: '12px'
                            }}
                          />
                          <Bar 
                            dataKey="average_percentile" 
                            fill="#0ea5e9"
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
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
                <Award className="w-4 h-4" />
                {results.length} matches found
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Your College Matches</h2>
              <p className="text-lg text-gray-600">
                Based on your {percentile}% CET percentile
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recommended Colleges</h3>
                <p className="text-gray-600 text-sm mt-1">Click "View Analytics" for detailed insights</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">College</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Branch</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Category</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Min Percentile</th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {results.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{row.college_name}</div>
                            <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                              <MapPin className="w-3 h-3" />
                              {row.city_guess}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-block bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">
                            {row.branch}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                            {row.seat_type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">{row.min.toFixed(2)}%</span>
                            {parseFloat(percentile) >= row.min ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                                <CheckCircle className="w-3 h-3" />
                                Eligible
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">
                                <Clock className="w-3 h-3" />
                                Reach
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button 
                            onClick={() => fetchCollegeStats(row.college_name, row.branch, row.min.toFixed(2))}
                            className="px-3 py-1.5 bg-black hover:bg-gray-900 text-white text-xs font-medium rounded-md transition-colors duration-200 flex items-center gap-1 mx-auto"
                          >
                            <Eye className="w-3 h-3" />
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Analytics Dashboard</h2>
                  <p className="text-sm text-gray-600 mt-1">{selectedCollege}</p>
                </div>
                <button 
                  onClick={() => setSelectedCollege(null)}
                  className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(95vh-80px)]">
                {/* Controls */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <h3 className="text-base font-semibold text-gray-900">Controls</h3>
                    <div className="flex-1"></div>
                    
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                        showFilters 
                          ? 'bg-gray-900 text-white' 
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Filter className="w-3 h-3 inline mr-1" />
                      {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>
                    
                    <button 
                      onClick={exportChart}
                      className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-md transition-colors"
                    >
                      <Download className="w-3 h-3 inline mr-1" />
                      Export
                    </button>

                    <button
                      onClick={() => fetchCollegeStats(selectedCollege)}
                      className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-medium rounded-md transition-colors"
                    >
                      Reset
                    </button>
                  </div>

                  {/* Filters */}
                  {showFilters && (
                    <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Filter by Seat Types:
                        </label>
                        <select 
                          multiple 
                          value={seatTypeFilter}
                          onChange={(e) => setSeatTypeFilter(Array.from(e.target.selectedOptions).map(o => o.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs h-24"
                        >
                          {[...new Set(chartData.map(d => d.seat_type))].map((type, i) => (
                            <option key={i} value={type} className="py-1">{type}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Filter by Branches:
                        </label>
                        <select 
                          multiple 
                          value={branchFilter}
                          onChange={(e) => setBranchFilter(Array.from(e.target.selectedOptions).map(o => o.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs h-24"
                        >
                          {[...new Set(chartData.map(d => d.branch))].map((branch, i) => (
                            <option key={i} value={branch} className="py-1">{branch}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="w-4 h-4 text-blue-600" />
                      <h4 className="font-medium text-gray-900 text-sm">Total Records</h4>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{filteredData.length}</p>
                    <p className="text-xs text-gray-600">Data points</p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <h4 className="font-medium text-gray-900 text-sm">Avg Percentile</h4>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      {filteredData.length > 0 ? (filteredData.reduce((sum, item) => sum + item.percentile, 0) / filteredData.length).toFixed(1) : 0}%
                    </p>
                    <p className="text-xs text-gray-600">Across branches</p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4 text-purple-600" />
                      <h4 className="font-medium text-gray-900 text-sm">Branches</h4>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">{[...new Set(filteredData.map(d => d.branch))].length}</p>
                    <p className="text-xs text-gray-600">Available</p>
                  </div>
                </div>

                {/* Chart */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <h4 className="text-base font-semibold text-gray-900">Admission Percentile Distribution</h4>
                    <p className="text-xs text-gray-600 mt-1">Branch-wise percentile requirements across seat categories</p>
                  </div>
                  
                  <div id="chartContainer" className="p-4">
                    <ResponsiveContainer width="100%" height={500}>
                      <ScatterChart margin={{ top: 20, right: 30, bottom: 80, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis 
                          type="category" 
                          dataKey="branch" 
                          angle={-45} 
                          textAnchor="end" 
                          interval={0} 
                          height={100}
                          fontSize={11}
                          stroke="#64748b"
                        />
                        <YAxis 
                          type="number" 
                          dataKey="percentile" 
                          domain={[0, 100]} 
                          fontSize={11}
                          stroke="#64748b"
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend 
                          wrapperStyle={{
                            fontSize: '12px'
                          }}
                        />
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
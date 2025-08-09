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
        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-gray-200">
          <p className="font-semibold text-gray-800 mb-1">{`Branch: ${label}`}</p>
          <p className="text-indigo-600 font-medium">{`Percentile: ${payload[0].value}`}</p>
          <p className="text-gray-600 text-sm">{`Seat Type: ${payload[0].payload.seat_type}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Navigation Header */}
      <div className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-gray-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="p-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-lg">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Star className="w-2.5 h-2.5 text-yellow-800" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
                  CET College Recommender
                </h1>
                <p className="text-sm text-gray-600 font-medium">Smart AI-powered college recommendations</p>
              </div>
            </div>
            
            {/* Navigation Tabs */}
            <div className="hidden md:flex items-center gap-2 bg-gray-100/80 p-2 rounded-2xl">
              <button
                onClick={() => setActiveTab('search')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                  activeTab === 'search' 
                    ? 'bg-white text-indigo-700 shadow-md scale-105' 
                    : 'text-gray-600 hover:bg-white/60 hover:text-gray-800'
                }`}
              >
                <Search className="w-4 h-4" />
                Search Colleges
              </button>
              <button
                onClick={() => setActiveTab('trends')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                  activeTab === 'trends' 
                    ? 'bg-white text-indigo-700 shadow-md scale-105' 
                    : 'text-gray-600 hover:bg-white/60 hover:text-gray-800'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </button>
              {results.length > 0 && (
                <button
                  onClick={() => setActiveTab('results')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 relative ${
                    activeTab === 'results' 
                      ? 'bg-white text-indigo-700 shadow-md scale-105' 
                      : 'text-gray-600 hover:bg-white/60 hover:text-gray-800'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  Results
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {results.length}
                  </span>
                </button>
              )}
            </div>

            {/* Mobile Navigation Dropdown */}
            <div className="md:hidden">
              <select 
                value={activeTab} 
                onChange={(e) => setActiveTab(e.target.value)}
                className="px-4 py-2 bg-white/90 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        <button
          onClick={() => setShowPredictionModal(true)}
          className="group bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
        >
          <Target className="w-6 h-6" />
          <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Predict Admission
          </div>
        </button>
        <button
          onClick={() => setShowSeatTypesModal(true)}
          className="group bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
        >
          <Info className="w-6 h-6" />
          <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Seat Types Info
          </div>
        </button>
      </div>

      {/* Modals */}
      {showPredictionModal && (
        <AdmissionPredictor onClose={() => setShowPredictionModal(false)} />
      )}
      {showSeatTypesModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
            <div className="px-8 py-6 bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Info className="w-6 h-6" />
                Seat Types Information
              </h2>
              <button 
                onClick={() => setShowSeatTypesModal(false)}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors duration-200"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            <div className="p-8 overflow-y-auto max-h-[calc(95vh-100px)]">
              <SeatTypesInfo />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Tab */}
        {activeTab === 'search' && (
          <div className="space-y-10">
            {/* Enhanced Hero Section */}
            <div className="text-center py-16">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full text-sm font-semibold mb-8 shadow-md">
                <Sparkles className="w-5 h-5" />
                Powered by Advanced AI Analytics
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Find Your 
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mt-2">
                  Dream College
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Discover the perfect engineering college match based on your CET percentile, 
                preferred locations, and academic interests with our intelligent recommendation system.
              </p>
              
              {/* Stats */}
              <div className="flex justify-center items-center gap-8 mt-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600">1K+</div>
                  <div className="text-gray-600 text-sm">Colleges Analyzed</div>
                </div>
                <div className="w-px h-12 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">50+</div>
                  <div className="text-gray-600 text-sm">Engineering Branches</div>
                </div>
                <div className="w-px h-12 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-600">100%</div>
                  <div className="text-gray-600 text-sm">Accurate Results</div>
                </div>
              </div>
            </div>

            {/* Enhanced Search Form */}
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">College Search</h3>
                    <p className="text-indigo-100 text-lg">Enter your details to discover your perfect college matches</p>
                  </div>
                  <div className="hidden md:block">
                    <div className="p-4 bg-white/20 rounded-2xl">
                      <Search className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-10">
                <div className="grid lg:grid-cols-2 gap-10">
                  {/* Left Column */}
                  <div className="space-y-8">
                    {/* Percentile Input */}
                    <div className="group">
                      <label className="flex items-center gap-3 text-base font-bold text-gray-700 mb-4">
                        <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-md">
                          <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        CET Percentile
                        <span className="text-red-500 text-lg">*</span>
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
                          placeholder="Enter your CET percentile"
                          className="w-full px-6 py-5 bg-gray-50 border-3 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300 text-gray-800 text-xl font-semibold group-hover:border-gray-300 shadow-sm"
                        />
                        <div className="absolute right-6 top-5 text-gray-400 text-xl font-bold">%</div>
                      </div>
                      <div className="flex items-start gap-2 mt-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                        <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-blue-700">
                          Enter your actual CET percentile for the most accurate college recommendations
                        </p>
                      </div>
                    </div>

                    {/* Seat Types */}
                    <div className="group">
                      <label className="flex items-center gap-3 text-base font-bold text-gray-700 mb-4">
                        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-md">
                          <Users className="w-5 h-5 text-white" />
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
                          className="w-full px-6 py-4 bg-gray-50 border-3 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300 text-gray-800 min-h-[140px] group-hover:border-gray-300 shadow-sm"
                        >
                          {seatTypeOptions.map((type) => (
                            <option key={type} value={type} className="py-3 text-lg">{type}</option>
                          ))}
                        </select>
                        <div className="absolute top-4 right-4 pointer-events-none">
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <p className="text-sm text-gray-600">Hold Ctrl/Cmd to select multiple categories</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-8">
                    {/* Cities Selection */}
                    <div className="group">
                      <label className="flex items-center gap-3 text-base font-bold text-gray-700 mb-4">
                        <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-md">
                          <MapPin className="w-5 h-5 text-white" />
                        </div>
                        Preferred Cities
                      </label>
                      <div className="relative">
                        <select 
                          multiple 
                          value={selectedCities} 
                          onChange={(e) => handleMultiSelect(e, setSelectedCities)}
                          className="w-full px-6 py-4 bg-gray-50 border-3 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300 text-gray-800 min-h-[140px] group-hover:border-gray-300 shadow-sm"
                        >
                          {cityOptions.map((city) => (
                            <option key={city} value={city} className="py-3 text-lg">{city}</option>
                          ))}
                        </select>
                        <div className="absolute top-4 right-4 pointer-events-none">
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <Building className="w-4 h-4 text-green-600" />
                        <p className="text-sm text-gray-600">Choose cities where you'd like to study</p>
                      </div>
                    </div>

                    {/* Branches Selection */}
                    <div className="group">
                      <label className="flex items-center gap-3 text-base font-bold text-gray-700 mb-4">
                        <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-md">
                          <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        Engineering Branches
                      </label>
                      <div className="relative">
                        <select 
                          multiple 
                          value={selectedBranches} 
                          onChange={(e) => handleMultiSelect(e, setSelectedBranches)}
                          className="w-full px-6 py-4 bg-gray-50 border-3 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300 text-gray-800 min-h-[140px] group-hover:border-gray-300 shadow-sm"
                        >
                          {branchOptions.map((branch) => (
                            <option key={branch} value={branch} className="py-3 text-lg">{branch}</option>
                          ))}
                        </select>
                        <div className="absolute top-4 right-4 pointer-events-none">
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <GraduationCap className="w-4 h-4 text-orange-600" />
                        <p className="text-sm text-gray-600">Select your preferred engineering specializations</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Submit Button */}
                <div className="mt-12 flex justify-center">
                  <button 
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading || !percentile}
                    className="group relative px-12 py-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:transform-none transition-all duration-300 flex items-center gap-4 text-xl overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    
                    {loading ? (
                      <>
                        <div className="w-7 h-7 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Finding Perfect Matches...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-7 h-7 group-hover:scale-110 transition-transform duration-200" />
                        <span>Find My Dream Colleges</span>
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-200" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Enhanced Error Message */}
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 p-6 rounded-2xl shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-red-100 rounded-xl">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-red-800 text-lg">Oops! Something went wrong</h4>
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Branch Trends Tab */}
        {activeTab === 'trends' && (
          <div className="space-y-10">
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full text-sm font-semibold mb-8 shadow-md">
                <BarChart3 className="w-5 h-5" />
                Historical Data Insights
              </div>
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                Branch <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Analytics</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Dive deep into historical admission trends and make informed decisions about your college choices
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">Trend Analysis</h3>
                    <p className="text-indigo-100 text-lg">Analyze admission patterns for specific colleges and branches</p>
                  </div>
                  <div className="hidden md:block">
                    <div className="p-4 bg-white/20 rounded-2xl">
                      <BarChart3 className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-10">
                <form onSubmit={handleFetchBranchTrends} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="group">
                      <label className="flex items-center gap-3 text-base font-bold text-gray-700 mb-4">
                        <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-md">
                          <Building className="w-5 h-5 text-white" />
                        </div>
                        College Name
                        <span className="text-red-500 text-lg">*</span>
                      </label>
                      <input
                        type="text"
                        value={trendCollege}
                        onChange={(e) => setTrendCollege(e.target.value)}
                        placeholder="Enter exact college name"
                        className="w-full px-6 py-5 bg-gray-50 border-3 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300 text-gray-800 text-lg group-hover:border-gray-300 shadow-sm"
                        required
                      />
                    </div>

                    <div className="group">
                      <label className="flex items-center gap-3 text-base font-bold text-gray-700 mb-4">
                        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-md">
                          <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        Branch Name
                        <span className="text-red-500 text-lg">*</span>
                      </label>
                      <input
                        type="text"
                        value={trendBranch}
                        onChange={(e) => setTrendBranch(e.target.value)}
                        placeholder="Enter exact branch name"
                        className="w-full px-6 py-5 bg-gray-50 border-3 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300 text-gray-800 text-lg group-hover:border-gray-300 shadow-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-center pt-6">
                    <button
                      type="submit"
                      className="group relative px-12 py-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-4 text-xl overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      
                      <BarChart3 className="w-7 h-7 group-hover:scale-110 transition-transform duration-200" />
                      <span>Generate Trend Analysis</span>
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-200" />
                    </button>
                  </div>
                </form>

                {/* Enhanced Trend Chart */}
                {trendData.length > 0 && (
                  <div className="mt-12 p-8 bg-gradient-to-br from-gray-50 to-indigo-50 rounded-3xl shadow-inner border border-gray-200">
                    <div className="mb-8">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl shadow-lg">
                          <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-2xl font-bold text-gray-900">
                            Trend Analysis: {trendCollege}
                          </h4>
                          <p className="text-lg text-indigo-600 font-semibold">{trendBranch}</p>
                        </div>
                      </div>
                      <p className="text-gray-600 text-lg">Historical admission percentile trends over the years</p>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
                      <ResponsiveContainer width="100%" height={500}>
                        <BarChart data={trendData} margin={{ top: 30, right: 30, left: 30, bottom: 30 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis 
                            dataKey="year" 
                            fontSize={14}
                            fontWeight="600"
                            stroke="#6b7280"
                            tick={{ fill: '#6b7280' }}
                          />
                          <YAxis 
                            fontSize={14}
                            fontWeight="600"
                            stroke="#6b7280"
                            tick={{ fill: '#6b7280' }}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'white',
                              border: '2px solid #e5e7eb',
                              borderRadius: '16px',
                              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                              fontSize: '14px',
                              fontWeight: '600'
                            }}
                          />
                          <Legend 
                            wrapperStyle={{
                              fontSize: '14px',
                              fontWeight: '600'
                            }}
                          />
                          <Bar 
                            dataKey="average_percentile" 
                            fill="#6366f1"
                            radius={[8, 8, 0, 0]}
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

        {/* Enhanced Results Tab */}
        {activeTab === 'results' && results.length > 0 && (
          <div className="space-y-10">
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-sm font-semibold mb-8 shadow-md">
                <Award className="w-5 h-5" />
                {results.length} Perfect Matches Found
              </div>
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Dream Colleges</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Based on your <span className="font-bold text-indigo-600">{percentile}%</span> CET percentile, 
                here are your perfectly matched engineering colleges
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">Recommended Colleges</h3>
                    <p className="text-indigo-100 text-lg">Click "View Analytics" to explore detailed admission insights</p>
                  </div>
                  <div className="hidden md:block">
                    <div className="p-4 bg-white/20 rounded-2xl">
                      <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-indigo-50">
                      <tr>
                        <th className="px-8 py-6 text-left text-base font-bold text-gray-900">College Information</th>
                        <th className="px-8 py-6 text-left text-base font-bold text-gray-900">Branch</th>
                        <th className="px-8 py-6 text-left text-base font-bold text-gray-900">Category</th>
                        <th className="px-8 py-6 text-left text-base font-bold text-gray-900">Required Percentile</th>
                        <th className="px-8 py-6 text-center text-base font-bold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-gray-100">
                      {results.map((row, index) => (
                        <tr key={index} className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 group">
                          <td className="px-8 py-8">
                            <div className="flex items-start gap-4">
                              <div className="p-3 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                                <Building className="w-6 h-6 text-indigo-600" />
                              </div>
                              <div>
                                <div className="font-bold text-gray-900 text-lg mb-2">{row.college_name}</div>
                                <div className="flex items-center gap-2 text-gray-600">
                                  <MapPin className="w-4 h-4 text-gray-400" />
                                  <span className="font-medium">{row.city_guess}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-8">
                            <div className="text-base font-semibold text-gray-900 bg-gray-100 px-4 py-2 rounded-xl">
                              {row.branch}
                            </div>
                          </td>
                          <td className="px-8 py-8">
                            <span className="inline-flex px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 rounded-full text-sm font-bold shadow-sm">
                              {row.seat_type}
                            </span>
                          </td>
                          <td className="px-8 py-8">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl font-bold text-gray-900">{row.min.toFixed(2)}%</span>
                              {parseFloat(percentile) >= row.min ? (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full text-sm font-bold shadow-sm">
                                  <CheckCircle className="w-4 h-4" />
                                  Eligible
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 rounded-full text-sm font-bold shadow-sm">
                                  <Clock className="w-4 h-4" />
                                  Stretch
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-8 py-8 text-center">
                            <button 
                              onClick={() => fetchCollegeStats(row.college_name, row.branch, row.min.toFixed(2))}
                              className="group/btn relative px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center gap-2 mx-auto overflow-hidden"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500"></div>
                              
                              <Eye className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-200" />
                              <span>View Analytics</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced College Analytics Modal */}
        {selectedCollege && chartData.length > 0 && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
              {/* Enhanced Modal Header */}
              <div className="px-8 py-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Analytics Dashboard</h2>
                    <p className="text-indigo-100 text-lg font-medium mt-1">{selectedCollege}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCollege(null)}
                  className="p-3 bg-white/20 hover:bg-white/30 rounded-2xl transition-colors duration-200 group"
                >
                  <X className="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-200" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto max-h-[calc(95vh-120px)]">
                {/* Enhanced Analytics Controls */}
                <div className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-3xl p-8 mb-10 border border-gray-200 shadow-inner">
                  <div className="flex flex-wrap items-center gap-6 mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
                        <Filter className="w-6 h-6 text-white" />
                      </div>
                      Analytics Controls
                    </h3>
                    <div className="flex-1"></div>
                    
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center gap-3 shadow-md ${
                        showFilters 
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg scale-105' 
                          : 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                      }`}
                    >
                      <Filter className="w-5 h-5" />
                      {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>
                    
                    <button 
                      onClick={exportChart}
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl flex items-center gap-3 transition-all duration-300 transform hover:scale-105 font-bold shadow-lg"
                    >
                      <Download className="w-5 h-5" />
                      Export Chart
                    </button>

                    <button
                      onClick={() => fetchCollegeStats(selectedCollege)}
                      className="px-6 py-3 bg-white border-2 border-gray-300 rounded-2xl hover:bg-gray-50 text-gray-700 font-bold transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      Reset View
                    </button>
                  </div>

                  {/* Enhanced Advanced Filters */}
                  {showFilters && (
                    <div className="grid md:grid-cols-2 gap-8 pt-8 border-t-2 border-gray-200">
                      <div className="space-y-4">
                        <label className="text-base font-bold text-gray-700 flex items-center gap-2">
                          <Users className="w-5 h-5 text-indigo-600" />
                          Filter by Seat Types:
                        </label>
                        <div className="relative">
                          <select 
                            multiple 
                            value={seatTypeFilter}
                            onChange={(e) => setSeatTypeFilter(Array.from(e.target.selectedOptions).map(o => o.value))}
                            className="w-full px-6 py-4 bg-white border-3 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300 text-base min-h-[120px] shadow-sm"
                          >
                            {[...new Set(chartData.map(d => d.seat_type))].map((type, i) => (
                              <option key={i} value={type} className="py-2 text-base">{type}</option>
                            ))}
                          </select>
                          <div className="absolute top-4 right-4 pointer-events-none">
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <label className="text-base font-bold text-gray-700 flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-purple-600" />
                          Filter by Branches:
                        </label>
                        <div className="relative">
                          <select 
                            multiple 
                            value={branchFilter}
                            onChange={(e) => setBranchFilter(Array.from(e.target.selectedOptions).map(o => o.value))}
                            className="w-full px-6 py-4 bg-white border-3 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300 text-base min-h-[120px] shadow-sm"
                          >
                            {[...new Set(chartData.map(d => d.branch))].map((branch, i) => (
                              <option key={i} value={branch} className="py-2 text-base">{branch}</option>
                            ))}
                          </select>
                          <div className="absolute top-4 right-4 pointer-events-none">
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Enhanced Statistics Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-3xl border-2 border-blue-200 shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl shadow-md">
                        <BarChart3 className="w-7 h-7 text-white" />
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg">Total Records</h4>
                    </div>
                    <p className="text-4xl font-bold text-blue-600 mb-2">{filteredData.length}</p>
                    <p className="text-base text-gray-600 font-medium">Admission data points</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-8 rounded-3xl border-2 border-green-200 shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-md">
                        <TrendingUp className="w-7 h-7 text-white" />
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg">Avg Percentile</h4>
                    </div>
                    <p className="text-4xl font-bold text-green-600 mb-2">
                      {filteredData.length > 0 ? (filteredData.reduce((sum, item) => sum + item.percentile, 0) / filteredData.length).toFixed(1) : 0}%
                    </p>
                    <p className="text-base text-gray-600 font-medium">Across all branches</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-8 rounded-3xl border-2 border-purple-200 shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-md">
                        <BookOpen className="w-7 h-7 text-white" />
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg">Branches</h4>
                    </div>
                    <p className="text-4xl font-bold text-purple-600 mb-2">{[...new Set(filteredData.map(d => d.branch))].length}</p>
                    <p className="text-base text-gray-600 font-medium">Available options</p>
                  </div>
                </div>

                {/* Enhanced Chart */}
                <div className="bg-white rounded-3xl border-3 border-gray-200 overflow-hidden shadow-xl">
                  <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-indigo-50 border-b-2 border-gray-200">
                    <h4 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
                        <BarChart3 className="w-6 h-6 text-white" />
                      </div>
                      Admission Percentile Distribution
                    </h4>
                    <p className="text-base text-gray-600 mt-2 font-medium">Branch-wise percentile requirements across different seat categories</p>
                  </div>
                  
                  <div id="chartContainer" className="p-8">
                    <ResponsiveContainer width="100%" height={700}>
                      <ScatterChart margin={{ top: 30, right: 30, bottom: 120, left: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeWidth={2} />
                        <XAxis 
                          type="category" 
                          dataKey="branch" 
                          angle={-45} 
                          textAnchor="end" 
                          interval={0} 
                          height={140}
                          fontSize={13}
                          fontWeight="600"
                          stroke="#6b7280"
                        />
                        <YAxis 
                          type="number" 
                          dataKey="percentile" 
                          domain={[0, 100]} 
                          fontSize={13}
                          fontWeight="600"
                          stroke="#6b7280"
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend 
                          wrapperStyle={{
                            fontSize: '14px',
                            fontWeight: '600'
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
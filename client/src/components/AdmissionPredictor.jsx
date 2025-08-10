import { useState } from "react";
import { X, Target, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export default function AdmissionPredictor({ onClose }) {
  const [percentile, setPercentile] = useState("");
  const [rank, setRank] = useState("");
  const [branch, setBranch] = useState("");
  const [seatType, setSeatType] = useState("");
  const [category, setCategory] = useState("");
  const [scoreType, setScoreType] = useState("");
  const [gender, setGender] = useState("");
  const [predictedCollege, setPredictedCollege] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePredictAdmission = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://cet-recommendor.onrender.com/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          percentile,
          rank,
          branch,
          seat_type: seatType,
          category,
          score_type: scoreType,
          gender,
        }),
      });

      const result = await response.json();
      if (result.predicted_college) {
        setPredictedCollege(result.predicted_college);
      } else {
        setPredictedCollege("Prediction failed: " + (result.error || "Unknown error"));
      }
    } catch (err) {
      setPredictedCollege("Error: Could not reach the server.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-['Inter',_system-ui,_-apple-system,_'Segoe_UI',_sans-serif]">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-medium text-gray-900" style={{ fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
              Admission Predictor
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Percentile <span className="text-red-500">*</span>
              </label>
              <input
                placeholder="Enter your percentile"
                type="number"
                value={percentile}
                onChange={(e) => setPercentile(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                style={{ fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif" }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Rank
              </label>
              <input
                placeholder="Enter your rank"
                type="number"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                style={{ fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif" }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Branch <span className="text-red-500">*</span>
              </label>
              <input
                placeholder="e.g., Computer Engineering"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                style={{ fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif" }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Seat Type <span className="text-red-500">*</span>
              </label>
              <input
                placeholder="e.g., GOPEN, GOBC, GST"
                value={seatType}
                onChange={(e) => setSeatType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                style={{ fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif" }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                style={{ fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif" }}
              >
                <option value="">Select category</option>
                <option value="open">Open</option>
                <option value="obc">OBC</option>
                <option value="sc">SC</option>
                <option value="st">ST</option>
                <option value="ews">EWS</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Score Type
              </label>
              <select
                value={scoreType}
                onChange={(e) => setScoreType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                style={{ fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif" }}
              >
                <option value="">Select score type</option>
                <option value="MHT-CET">MHT-CET</option>
                <option value="JEE">JEE</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                style={{ fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif" }}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          {/* Result */}
          {predictedCollege && (
            <div className={`mt-6 p-4 rounded-lg border ${
              predictedCollege.includes("Error") || predictedCollege.includes("failed")
                ? "bg-red-50 border-red-200"
                : "bg-green-50 border-green-200"
            }`}>
              <div className="flex items-start gap-3">
                {predictedCollege.includes("Error") || predictedCollege.includes("failed") ? (
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <h4 className={`font-medium text-sm ${
                    predictedCollege.includes("Error") || predictedCollege.includes("failed")
                      ? "text-red-900"
                      : "text-green-900"
                  }`}>
                    {predictedCollege.includes("Error") || predictedCollege.includes("failed")
                      ? "Prediction Failed"
                      : "Predicted College"
                    }
                  </h4>
                  <p className={`text-sm mt-1 ${
                    predictedCollege.includes("Error") || predictedCollege.includes("failed")
                      ? "text-red-700"
                      : "text-green-700"
                  }`} style={{ fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
                    {predictedCollege}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            style={{ fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif" }}
          >
            Cancel
          </button>
          <button
            onClick={handlePredictAdmission}
            disabled={loading || !percentile || !branch || !seatType}
            className="px-4 py-2 bg-black hover:bg-gray-900 disabled:bg-gray-400 text-white text-sm font-medium rounded-md transition-colors duration-200 flex items-center gap-2 min-w-[100px] justify-center"
            style={{ fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif" }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Predicting...
              </>
            ) : (
              <>
                <Target className="w-4 h-4" />
                Predict
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
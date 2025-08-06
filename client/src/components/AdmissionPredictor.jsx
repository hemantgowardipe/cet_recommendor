import { useState } from "react";

export default function AdmissionPredictor({ onClose }) {
  const [percentile, setPercentile] = useState("");
  const [rank, setRank] = useState("");
  const [branch, setBranch] = useState("");
  const [seatType, setSeatType] = useState("");
  const [category, setCategory] = useState("");
  const [scoreType, setScoreType] = useState("");
  const [gender, setGender] = useState("");
  const [predictedCollege, setPredictedCollege] = useState("");

  const handlePredictAdmission = async () => {
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
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg space-y-4 shadow-xl">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Admission Prediction</h2>

        <input placeholder="Percentile" type="number" value={percentile} onChange={(e) => setPercentile(e.target.value)} className="w-full border border-gray-300 p-2 rounded" />
        <input placeholder="Rank" type="number" value={rank} onChange={(e) => setRank(e.target.value)} className="w-full border border-gray-300 p-2 rounded" />
        <input placeholder="Branch" value={branch} onChange={(e) => setBranch(e.target.value)} className="w-full border border-gray-300 p-2 rounded" />
        <input placeholder="Seat Type (e.g., GOPEN)" value={seatType} onChange={(e) => setSeatType(e.target.value)} className="w-full border border-gray-300 p-2 rounded" />
        <input placeholder="Category (e.g., open, obc)" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-gray-300 p-2 rounded" />
        <input placeholder="Score Type (e.g., MHT-CET)" value={scoreType} onChange={(e) => setScoreType(e.target.value)} className="w-full border border-gray-300 p-2 rounded" />
        <input placeholder="Gender (male/female)" value={gender} onChange={(e) => setGender(e.target.value)} className="w-full border border-gray-300 p-2 rounded" />

        <div className="flex justify-between mt-4">
          <button
            onClick={handlePredictAdmission}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Predict
          </button>
          <button
            onClick={onClose}
            className="text-red-500 font-semibold"
          >
            Cancel
          </button>
        </div>

        {predictedCollege && (
          <div className="mt-4 p-3 bg-green-100 text-green-800 rounded">
            Predicted College: <strong>{predictedCollege}</strong>
          </div>
        )}
      </div>
    </div>
  );
}

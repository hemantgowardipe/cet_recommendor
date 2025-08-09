from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Load the dataset
DATA_PATH = os.path.join("data", "kaggle_pivot_min_descending.csv")
df = pd.read_csv(DATA_PATH)

# Add city column from college_name
df["city_guess"] = df["college_name"].str.extract(r",\s*([^,]+)$")

@app.route('/')
def home():
    return "CET College Recommender API is running."

@app.route('/recommend', methods=['POST'])
def recommend_colleges():
    data = request.get_json()

    try:
        percentile = float(data.get("percentile"))
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid or missing percentile value."}), 400

    # Optional filters
    selected_cities = data.get("cities", [])
    selected_branches = data.get("branches", [])
    seat_types = data.get("seat_types", [])
    category = data.get("category", "").strip().lower()
    score_type = data.get("score_type", "MHT-CET")

    # Start filtering
    filtered_df = df[df["min"] <= percentile]

    if selected_cities:
        filtered_df = filtered_df[filtered_df["city_guess"].isin(selected_cities)]

    if selected_branches:
        filtered_df = filtered_df[filtered_df["branch"].isin(selected_branches)]

    if score_type:
        filtered_df = filtered_df[filtered_df["score_type"].str.lower() == score_type.lower()]
    
    if seat_types:
        filtered_df = filtered_df[filtered_df["seat_type"].isin(seat_types)]

    # You can later map category to seat_type if needed

    # Sort and limit results
    results = filtered_df[["college_name", "branch", "seat_type", "min", "city_guess"]].sort_values(
        by="min", ascending=False
    )

    return jsonify(results.to_dict(orient="records"))

@app.route('/filters', methods=['GET'])
def get_filters():
    unique_cities = sorted(df["city_guess"].dropna().unique().tolist())
    unique_branches = sorted(df["branch"].dropna().unique().tolist())
    unique_seat_types = sorted(df["seat_type"].dropna().unique().tolist())

    return jsonify({
        "cities": unique_cities,
        "branches": unique_branches,
        "seat_types": unique_seat_types  # ✅ for dynamic category filter
    })


@app.route('/college-stats', methods=['GET'])
def college_stats():
    import pandas as pd

    college_name = request.args.get("college")
    branch = request.args.get("branch")
    percentile = request.args.get("percentile")

    if not college_name:
        return jsonify({"error": "College name is required."}), 400

    sw_path = os.path.join("data", "kaggle_sw_raw.csv")
    sw_df = pd.read_csv(sw_path)

    # Filter by college
    college_data = sw_df[sw_df["college_name"] == college_name]

    # Optional: Filter by branch
    if branch:
        college_data = college_data[college_data["branch"] == branch]

    # Optional: Filter by percentile threshold (e.g., ±5%)
    if percentile:
        try:
            percentile = float(percentile)
            college_data = college_data[
                (college_data["percentile"] >= percentile - 5) &
                (college_data["percentile"] <= percentile + 5)
            ]
        except ValueError:
            return jsonify({"error": "Invalid percentile."}), 400

    # Return selected fields
    result = college_data[["branch", "percentile", "seat_type"]].to_dict(orient="records")
    return jsonify(result)


@app.route('/branch-trend')
def branch_trend():
    college = request.args.get("college")
    branch = request.args.get("branch")

    if not college or not branch:
        return jsonify({"error": "College and branch are required"}), 400

    try:
        path = os.path.join("data", "kaggle_sw_raw.csv")
        df = pd.read_csv(path)

        # Simulate years for demonstration (2021 to 2023)
        import numpy as np
        np.random.seed(42)  # for consistent results
        df["year"] = np.random.choice([2021, 2022, 2023], size=len(df))

        filtered = df[(df["college_name"] == college) & (df["branch"] == branch)]

        if filtered.empty:
            return jsonify({"error": "No data found for the given college and branch"}), 404

        grouped = (
            filtered.groupby("year")["percentile"]
            .mean()
            .reset_index()
            .rename(columns={"percentile": "average_percentile"})
        )

        return jsonify(grouped.to_dict(orient="records"))

    except Exception as e:
        import traceback
        print("Error in /branch-trend:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500


@app.route('/debug-columns')
def debug_columns():
    path = os.path.join("data", "kaggle_sw_raw.csv")
    df = pd.read_csv(path)
    return jsonify({"columns": list(df.columns)})


# Load trained model once at startup
model = joblib.load("model.pkl")

@app.route('/predict', methods=['POST'])
def predict_admission():
    try:
        # Parse incoming JSON
        data = request.get_json(force=True)

        # Validate input
        required_fields = ["percentile", "rank", "branch", "seat_type", "category", "score_type", "gender"]
        missing_fields = [field for field in required_fields if data.get(field) is None]
        if missing_fields:
            return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400

        # Create input features
        features = {
            "percentile": float(data["percentile"]),
            "rank": int(data["rank"]),
            "branch": data["branch"],
            "seat_type": data["seat_type"],
            "category": data["category"],
            "score_type": data["score_type"],
            "gender": data["gender"]
        }

        # Convert to DataFrame
        input_df = pd.DataFrame([features])

        # Predict using model
        prediction = model.predict(input_df)

        # Return response
        return jsonify({"predicted_college": prediction[0]})

    except Exception as e:
        traceback.print_exc()  # Print detailed traceback in logs
        return jsonify({"error": "Prediction failed", "details": str(e)}), 500
        

if __name__ == '__main__':
    app.run(debug=True)

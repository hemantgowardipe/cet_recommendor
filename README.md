# 📌 CET College Recommender

An **AI-powered web application** that helps students explore and analyze engineering college admission trends, compare institutions, and get admission predictions based on their CET scores and preferences.

Built with **React + Vite** for the frontend and **Flask** for the backend, the project integrates **Machine Learning (Random Forest)** for admission prediction and rich data visualizations using Recharts.

---

## 🚀 Features

- **College Search & Trend Analysis**  
  Search by college name and branch to view historical admission trends in visually styled graphs.

- **AI-Powered Admission Prediction**  
  Predict your chances of getting admission into specific colleges using a trained **RandomForestClassifier** model.

- **Interactive Data Visualizations**  
  Includes heatmaps, bar charts, scatter plots, and line charts for CET admission data analysis.

- **Compare Colleges Side-by-Side**  
  View and compare multiple colleges’ admission statistics.

- **Map Integration**  
  Locate colleges geographically for better decision-making.

---

## 🛠 Tech Stack

**Frontend**:
- React + Vite
- Tailwind CSS
- Lucide Icons
- Recharts

**Backend**:
- Flask
- Flask-CORS
- scikit-learn (RandomForest)
- pandas, numpy, joblib

**Deployment**:
- Frontend → Vercel  
- Backend → Render

---

## 📂 Project Structure

```
root/
│── client/ # React frontend
│ ├── src/
│ └── ...
│
│── server/ # Flask backend
│ ├── app.py # Main backend server
│ ├── train_model.py # Model training script
│ ├── model.pkl # Trained ML model (not committed to GitHub)
│ └── ...
│
└── data/ # Dataset (excluded from GitHub)
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/hemantgowardipe/cet_recommendor.git
cd cet_recommendor
```

### 2️⃣ Backend Setup
```bash
cd server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Run Backend:
```bash
python app.py
```

### 3️⃣ Frontend Setup
```bash
cd client
npm install
npm run dev
```

---

## 📊 Machine Learning Model

- **Algorithm**: RandomForestClassifier
- **Pipeline**: OneHotEncoder (categorical) + RandomForest
- **Output**: Admission chance prediction based on CET score, branch, and category
- **Trained Offline**: On cleaned dataset `kaggle_sw_raw.csv`
- **Saved as**: `model.pkl` (excluded from GitHub; deployed with backend on Render)

---

## 📜 Deployment Notes

- Do not commit large files like `model.pkl` to GitHub (over 100 MB limit).
- Use `.gitignore` to exclude model and dataset:
  ```
  server/model.pkl
  data/*.csv
  ```

- Frontend is deployed on Vercel and backend on Render for production use.

---

## 📌 Future Improvements

- Enhance prediction accuracy with more advanced ML algorithms.
- Add authentication for personalized recommendations.
- Include cut-off trend forecasting for upcoming CET years.

---

## 📄 License

This project is open-source and available under the MIT License.

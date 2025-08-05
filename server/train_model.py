import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report

# Load data
df = pd.read_csv("data/kaggle_sw_raw.csv")

# Drop rows with missing values in key columns
df.dropna(subset=["percentile", "rank", "college_name", "branch", "seat_type", "category", "score_type", "gender"], inplace=True)

# Features and Target
features = ["percentile", "rank", "branch", "seat_type", "category", "score_type", "gender"]
target = "college_name"

X = df[features]
y = df[target]

# Define categorical and numerical features
categorical_features = ["branch", "seat_type", "category", "score_type", "gender"]
numerical_features = ["percentile", "rank"]

# Preprocessing: OneHotEncoder only for low-cardinality categorical features
preprocessor = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features)
    ],
    remainder="passthrough"  # Keep percentile and rank as-is
)

# Define model
model = RandomForestClassifier(n_estimators=50, max_depth=10, random_state=42)

# Create pipeline
pipeline = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("classifier", model)
])

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Fit model
pipeline.fit(X_train, y_train)

# Evaluate
y_pred = pipeline.predict(X_test)
print(classification_report(y_test, y_pred))

# Save model
joblib.dump(pipeline, "model.pkl")
print("✅ Model training complete and saved as model.pkl")

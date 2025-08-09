import pandas as pd
import joblib
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split, GridSearchCV, StratifiedKFold
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import (
    classification_report, accuracy_score, confusion_matrix, ConfusionMatrixDisplay
)

# Load dataset
df = pd.read_csv("data/kaggle_sw_raw.csv")

# Drop rows with missing values
df.dropna(subset=[
    "percentile", "rank", "college_name", "branch", "seat_type", "category", "score_type", "gender"
], inplace=True)

# Features and Target
features = ["percentile", "rank", "branch", "seat_type", "category", "score_type", "gender"]
target = "college_name"

X = df[features]
y = df[target]

# Categorical & Numerical
categorical_features = ["branch", "seat_type", "category", "score_type", "gender"]
numerical_features = ["percentile", "rank"]

# Preprocessing pipeline
preprocessor = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features)
    ],
    remainder="passthrough"
)

# Define pipeline
pipeline = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("classifier", RandomForestClassifier(random_state=42))
])

# Hyperparameter tuning using GridSearchCV
param_grid = {
    "classifier__n_estimators": [50, 100],
    "classifier__max_depth": [10, 20, None],
    "classifier__min_samples_split": [2, 5]
}

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

grid_search = GridSearchCV(
    pipeline, param_grid, cv=cv, scoring='accuracy', n_jobs=-1, verbose=1
)

# Train/test split with stratification
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

# Fit the best model
grid_search.fit(X_train, y_train)

best_model = grid_search.best_estimator_

# Evaluate
y_pred = best_model.predict(X_test)
print("🔍 Best Params:", grid_search.best_params_)
print("📊 Accuracy:", accuracy_score(y_test, y_pred))
print("📄 Classification Report:\n", classification_report(y_test, y_pred))

# Confusion Matrix
cm = confusion_matrix(y_test, y_pred, labels=np.unique(y))
disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=np.unique(y))
disp.plot(xticks_rotation=90)
plt.tight_layout()
plt.savefig("confusion_matrix.png")
print("🖼️ Confusion matrix saved as 'confusion_matrix.png'")

# Save the model
joblib.dump(best_model, "model.pkl")
print("✅ Model saved as model.pkl")

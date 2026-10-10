# Face Recognition Attendance System

A web-based attendance system that identifies people by their face and records attendance automatically. It replaces manual registers and RFID cards with a camera-based workflow built on Python, Flask and machine learning.

## Overview

Users are registered with a set of face photos. A classifier is trained on face embeddings extracted from those photos. During attendance, the webcam image is sent to the server, the face is matched against the trained model, and a timestamped record is saved to the database. Because each person is matched to their own face, one person cannot mark attendance for another.

## Key Features

- **Face recognition:** detects a face, extracts an embedding and predicts the identity with a trained classifier
- **Automatic attendance logging:** records the student ID, name and timestamp without manual entry
- **Confidence check:** matches below 50% confidence are rejected to reduce false marks
- **Student management:** add students with face images, list them, and delete them along with their data
- **Background training:** train the model from the web UI and watch live progress
- **Reports:** view attendance by daily, weekly, monthly or all-time period
- **Dashboard:** chart of attendance for the last 30 days
- **CSV export:** download the complete attendance record

## Applications

- Schools, colleges and universities
- Offices and employee tracking
- Workshops, seminars and training sessions

## Tech Stack

| Area | Tools |
|------|-------|
| Language | Python |
| Web framework | Flask |
| Computer vision | OpenCV, MediaPipe, face_recognition |
| Machine learning | RandomForestClassifier (scikit-learn) |
| Database | SQLite3 |
| Data handling | Pandas |
| Frontend | HTML, CSS, JavaScript |

## Project Structure

```
├── app.py              # Flask routes and database logic
├── model.py            # Training, embedding extraction, prediction
├── templates/          # HTML pages
├── static/             # CSS and JavaScript
├── dataset/            # Face images per student (created at runtime)
└── attendance.db       # SQLite database (created at runtime)
```

## Installation

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git
cd YOUR-REPO
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Open http://127.0.0.1:5000 in your browser.

## Usage

1. Open **Add Student**, enter the details and capture face images.
2. Click **Train Model** and wait for training to complete.
3. Open **Mark Attendance** and look at the camera.
4. Check reports in **Attendance Record** or download the CSV.

## Benefits

- Reduces manual effort and paperwork
- Prevents proxy attendance
- Gives real-time attendance data and trends
- Simple to set up and extend

## Future Improvements

- Email or SMS notifications
- Support for MySQL or PostgreSQL
- Admin login and role-based access
- Liveness detection to block photo spoofing

## Notes

- `debug=True` is for development only. Turn it off in production.
- Face images, the database and the trained model are excluded from Git for privacy.
- Webcam access requires `localhost` or HTTPS.



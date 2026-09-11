from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

doctors = [

    {
        "id": 1,
        "name": "Dr. Priya Sharma",
        "specialization": "Cardiologist",
        "experience": "12 years",
        "location": "Hyderabad"
    },
    {
        "id": 2,
        "name": "Dr. Rahul Kumar",
        "specialization": "Dermatologist",
        "experience": "10 years",
        "location": "Hyderabad"
    },
    {
        "id": 3,
        "name": "Dr. Anjali Reddy",
        "specialization": "Pediatrician",
        "experience": "8 years",
        "location": "Hyderabad"
    },
    {
        "id": 4,
        "name": "Dr. Vikram Rao",
        "specialization": "Neurologist",
        "experience": "15 years",
        "location": "Hyderabad"
    },
    {
        "id": 5,
        "name": "Dr. Sneha Patel",
        "specialization": "Gynecologist",
        "experience": "9 years",
        "location": "Hyderabad"
    },
    {
        "id": 6,
        "name": "Dr. Arjun Mehta",
        "specialization": "Orthopedic",
        "experience": "11 years",
        "location": "Hyderabad"
    }
]

@app.route("/")
def home():
    return render_template("index.html")
@app.route("/api/doctors")
def get_doctors():
    formatted_doctors = []

    for d in doctors:
        formatted_doctors.append({
            "id": d["id"],
            "name_en": d["name"],
            "name_te": d["name"],
            "specialization_en": d["specialization"],
            "specialization_te": d["specialization"],
            "hospital_en": d["location"],
            "qualification": "MBBS, MD",
            "experience_years": d["experience"].replace(" years", ""),
            "rating": 4.8,
            "fee": 500,
            "languages": ["English", "Telugu"],
            "avatar": "",
            "available": True,
            "availability_status_en": "Available",
            "availability_status_te": "అందుబాటులో ఉంది"
        })

    return jsonify({
        "status": "success",
        "doctors": formatted_doctors,
        "count": len(formatted_doctors)
    })
if __name__ == "__main__":
    app.run(debug=True)

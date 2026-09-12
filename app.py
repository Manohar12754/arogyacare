import sqlite3
import os
import uuid
from datetime import datetime
from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get("SECRET_KEY", "arogyacare-production-secret-key-2026")
CORS(app, resources={r"/api/*": {"origins": "*"}})

DB_FILE = os.environ.get("DATABASE_PATH", os.path.join(os.path.dirname(__file__), "arogyacare.db"))


# Initialize SQLite Database
def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    # Doctors table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS doctors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name_en TEXT NOT NULL,
            name_te TEXT NOT NULL,
            specialization_en TEXT NOT NULL,
            specialization_te TEXT NOT NULL,
            category TEXT NOT NULL,
            hospital_en TEXT NOT NULL,
            hospital_te TEXT NOT NULL,
            qualification TEXT NOT NULL,
            experience_years INTEGER NOT NULL,
            fee INTEGER NOT NULL,
            rating REAL NOT NULL,
            reviews_count INTEGER NOT NULL,
            languages TEXT NOT NULL,
            avatar TEXT NOT NULL,
            available BOOLEAN NOT NULL,
            availability_status_en TEXT NOT NULL,
            availability_status_te TEXT NOT NULL,
            about_en TEXT NOT NULL,
            available_days TEXT NOT NULL,
            available_slots TEXT NOT NULL,
            conditions_treated TEXT NOT NULL
        )
    ''')

    # Appointments table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS appointments (
            id TEXT PRIMARY KEY,
            doctor_id INTEGER NOT NULL,
            doctor_name TEXT NOT NULL,
            specialization TEXT NOT NULL,
            date TEXT NOT NULL,
            time_slot TEXT NOT NULL,
            type TEXT NOT NULL,
            complaint TEXT NOT NULL,
            patient_name TEXT NOT NULL,
            status TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (doctor_id) REFERENCES doctors (id)
        )
    ''')

    # Check if doctors table is empty, populate initial doctors
    cursor.execute('SELECT COUNT(*) FROM doctors')
    if cursor.fetchone()[0] == 0:
        initial_doctors = [
            (
                "Dr. Priya Sharma", "డాక్టర్ ప్రియా శర్మ",
                "Cardiologist", "కార్డియాలజిస్ట్", "cardiologist",
                "Apollo Hospitals, Jubilee Hills", "అపోలో హాస్పిటల్స్, జూబ్లీ హిల్స్",
                "MBBS, MD (Cardiology), DM", 12, 800, 4.9, 142,
                "English, Telugu, Hindi",
                "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
                True, "Available Today", "ఈరోజు అందుబాటులో ఉంది",
                "Dr. Priya Sharma is a senior consultant cardiologist with over 12 years of clinical excellence in interventional cardiology, heart failure management, and preventive cardiac care.",
                "Mon, Tue, Wed, Fri, Sat",
                "09:30 AM, 10:30 AM, 02:00 PM, 04:30 PM, 06:00 PM",
                "Chest Pain, High Blood Pressure, Heart Failure, Arrhythmia, Palpitations"
            ),
            (
                "Dr. Rahul Kumar", "డాక్టర్ రాహుల్ కుమార్",
                "Dermatologist", "డెర్మటాలజిస్ట్", "dermatologist",
                "Yashoda Hospitals, Somajiguda", "యశోద హాస్పిటల్స్, సోమాజిగూడ",
                "MBBS, MD (Dermatology)", 10, 600, 4.8, 98,
                "English, Telugu",
                "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80",
                True, "Available Today", "ఈరోజు అందుబాటులో ఉంది",
                "Dr. Rahul Kumar specializes in clinical dermatology, cosmetic procedures, acne treatment, eczema, psoriasis, and laser hair/skin therapies.",
                "Mon, Wed, Thu, Sat",
                "10:00 AM, 11:30 AM, 03:00 PM, 05:30 PM",
                "Acne, Eczema, Psoriasis, Hair Loss, Skin Allergy, Rash"
            ),
            (
                "Dr. Anjali Reddy", "డాక్టర్ అంజలి రెడ్డి",
                "Pediatrician", "పీడియాట్రీషియన్", "pediatrician",
                "Rainbow Children's Hospital, Banjara Hills", "రెయిన్‌బో చిన్నపిల్లల హాస్పిటల్",
                "MBBS, DCH, MD (Pediatrics)", 8, 500, 4.9, 115,
                "English, Telugu",
                "https://images.unsplash.com/photo-1594824813566-88855ce78947?w=400&auto=format&fit=crop&q=80",
                True, "Available Today", "ఈరోజు అందుబాటులో ఉంది",
                "Dr. Anjali Reddy is a renowned pediatrician with expertise in child growth monitoring, vaccinations, newborn care, and childhood respiratory infections.",
                "Tue, Wed, Fri, Sun",
                "09:30 AM, 11:00 AM, 02:30 PM, 04:00 PM",
                "Fever, Child Growth, Vaccination, Asthma, Cold & Cough, Infection"
            ),
            (
                "Dr. Vikram Rao", "డాక్టర్ విక్రమ్ రావు",
                "Neurologist", "న్యూరాలజిస్ట్", "neurologist",
                "KIMS Hospitals, Begumpet", "కిమ్స్ హాస్పిటల్స్, బేగంపేట",
                "MBBS, MD, DM (Neurology)", 15, 1000, 4.9, 185,
                "English, Telugu, Hindi",
                "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80",
                True, "Available Today", "ఈరోజు అందుబాటులో ఉంది",
                "Dr. Vikram Rao is an expert neurologist specializing in migraine management, stroke rehab, epilepsy treatment, neuropathy, and brain health.",
                "Mon, Tue, Thu, Fri",
                "10:30 AM, 01:00 PM, 04:00 PM, 06:30 PM",
                "Migraine, Headache, Epilepsy, Stroke, Nerve Pain, Dizziness"
            ),
            (
                "Dr. Sneha Patel", "డాక్టర్ స్నేహ పటేల్",
                "Gynecologist", "గైనకాలజిస్ట్", "gynecologist",
                "Fernandez Hospital, Hyderguda", "ఫెర్నాండెజ్ హాస్పిటల్, హైదర్‌గూడ",
                "MBBS, MS (Obstetrics & Gynecology)", 9, 700, 4.7, 86,
                "English, Telugu, Gujarati",
                "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&auto=format&fit=crop&q=80",
                True, "Available Today", "ఈరోజు అందుబాటులో ఉంది",
                "Dr. Sneha Patel is a high-risk pregnancy specialist, laparoscopic surgeon, and expert in PCOS, maternal health, and fertility wellness.",
                "Mon, Wed, Fri, Sat",
                "10:00 AM, 12:00 PM, 03:30 PM, 05:00 PM",
                "PCOS, Pregnancy Care, Irregular Periods, Fertility, Hormonal Imbalance"
            ),
            (
                "Dr. Arjun Mehta", "డాక్టర్ అర్జున్ మెహతా",
                "Orthopedic", "ఆర్థోపెడిక్", "orthopedic",
                "Continental Hospitals, Gachibowli", "కాంటినెంటల్ హాస్పిటల్స్, గచ్చిబౌలి",
                "MBBS, MS (Orthopedics), M.Ch", 11, 750, 4.8, 130,
                "English, Telugu, Hindi",
                "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=80",
                True, "Available Today", "ఈరోజు అందుబాటులో ఉంది",
                "Dr. Arjun Mehta is a leading orthopedic and joint replacement surgeon with vast expertise in knee/hip replacement, sports injury rehab, and fracture care.",
                "Tue, Thu, Fri, Sat",
                "09:30 AM, 11:30 AM, 02:00 PM, 05:00 PM",
                "Knee Pain, Joint Replacement, Fracture, Back Pain, Arthritis"
            )
        ]
        cursor.executemany('''
            INSERT INTO doctors (
                name_en, name_te, specialization_en, specialization_te, category,
                hospital_en, hospital_te, qualification, experience_years, fee, rating, reviews_count,
                languages, avatar, available, availability_status_en, availability_status_te,
                about_en, available_days, available_slots, conditions_treated
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', initial_doctors)

    # Populate initial sample appointment if table is empty
    cursor.execute('SELECT COUNT(*) FROM appointments')
    if cursor.fetchone()[0] == 0:
        cursor.execute('''
            INSERT INTO appointments (
                id, doctor_id, doctor_name, specialization, date, time_slot, type, complaint, patient_name, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            "APT-2026-901", 1, "Dr. Priya Sharma", "Cardiologist",
            datetime.now().strftime("%Y-%m-%d"), "10:30 AM",
            "Video Consultation", "Routine Heart Checkup & BP Review", "Sai Manohar", "Confirmed"
        ))

    conn.commit()
    conn.close()

init_db()

def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

# Master Static Datasets for Initial SSR Context
SPECIALIZATIONS = [
    {"id": "all", "name_en": "All Specialties", "name_te": "అన్ని విభాగాలు", "icon": "fa-stethoscope"},
    {"id": "cardiologist", "name_en": "Cardiology", "name_te": "కార్డియాలజీ", "icon": "fa-heart-pulse"},
    {"id": "dermatologist", "name_en": "Dermatology", "name_te": "డెర్మటాలజీ", "icon": "fa-hand-dots"},
    {"id": "pediatrician", "name_en": "Pediatrics", "name_te": "పీడియాట్రిక్స్", "icon": "fa-baby"},
    {"id": "neurologist", "name_en": "Neurology", "name_te": "న్యూరాలజీ", "icon": "fa-brain"},
    {"id": "gynecologist", "name_en": "Gynecology", "name_te": "గైనకాలజీ", "icon": "fa-person-pregnant"},
    {"id": "orthopedic", "name_en": "Orthopedics", "name_te": "ఆర్థోపెడిక్స్", "icon": "fa-bone"}
]

PRESCRIPTIONS = [
    {
        "id": "RX-2026-881",
        "date": "2026-09-10",
        "doctor_name": "Dr. Priya Sharma",
        "specialization": "Cardiologist",
        "diagnosis": "Mild Hypertension & Sinus Bradycardia",
        "medicines": [
            {"name": "Telmisartan 40mg", "dosage": "1-0-0 (Morning after food)", "duration": "30 Days"},
            {"name": "Atorvastatin 10mg", "dosage": "0-0-1 (Night before sleep)", "duration": "30 Days"},
            {"name": "Multivitamin Complex", "dosage": "0-1-0 (After lunch)", "duration": "15 Days"}
        ],
        "advice": "Reduce salt intake (< 5g/day), maintain daily 30-min walk, re-check BP in 2 weeks."
    }
]

DOCUMENTS = [
    {
        "title": "Lipid Profile & Lipid Panel Test",
        "category": "Lab Test Report",
        "date": "2026-09-08",
        "status": "Verified",
        "file_name": "lipid_profile_report_2026.pdf"
    },
    {
        "title": "Resting 12-Lead ECG Report",
        "category": "Cardiology Report",
        "date": "2026-09-05",
        "status": "Verified",
        "file_name": "ecg_reading_sep2026.pdf"
    }
]

HOSPITALS = [
    {
        "id": 1,
        "name_en": "Apollo Hospitals",
        "name_te": "అపోలో హాస్పిటల్స్",
        "address_en": "Road No. 72, Jubilee Hills, Hyderabad",
        "address_te": "రోడ్ నం. 72, జూబ్లీ హిల్స్, హైదరాబాద్",
        "phone": "+91 40 2360 7777",
        "distance": "2.4 km",
        "icu_status": "ICU Beds Available (12 Free)",
        "icu_status_te": "ఐసీయూ బెడ్లు అందుబాటులో ఉన్నాయి (12 ఉచితం)"
    },
    {
        "id": 2,
        "name_en": "Yashoda Emergency Trauma Center",
        "name_te": "యశోద ఎమర్జెన్సీ ట్రౌమా సెంటర్",
        "address_en": "Raj Bhavan Road, Somajiguda, Hyderabad",
        "address_te": "రాజ్ భవన్ రోడ్, సోమాజిగూడ, హైదరాబాద్",
        "phone": "+91 40 4567 4567",
        "distance": "4.1 km",
        "icu_status": "24/7 Cardiac Emergency Unit Ready",
        "icu_status_te": "24/7 కార్డియాక్ ఎమర్జెన్సీ యూనిట్ సిద్ధంగా ఉంది"
    }
]

QUICK_QUERIES = [
    {
        "title_en": "Fever & Cold",
        "title_te": "జ్వరం మరియు జలుబు",
        "message_en": "Doctor, I have high fever (100.4°F) and severe cold since yesterday. What medicines should I take?"
    },
    {
        "title_en": "BP & Dizziness",
        "title_te": "బీపీ & కళ్ళు తిరగడం",
        "message_en": "Doctor, my blood pressure reading was 140/90 this morning and I am feeling dizzy."
    },
    {
        "title_en": "Report Review",
        "title_te": "రిపోర్ట్ రివ్యూ",
        "message_en": "Doctor, I have uploaded my latest blood test lab report. Please review when you are free."
    }
]

def format_doctor(row):
    return {
        "id": row["id"],
        "name_en": row["name_en"],
        "name_te": row["name_te"],
        "specialization_en": row["specialization_en"],
        "specialization_te": row["specialization_te"],
        "category": row["category"],
        "hospital_en": row["hospital_en"],
        "hospital_te": row["hospital_te"],
        "qualification": row["qualification"],
        "experience_years": row["experience_years"],
        "fee": row["fee"],
        "rating": row["rating"],
        "reviews_count": row["reviews_count"],
        "languages": [l.strip() for l in row["languages"].split(",")],
        "avatar": row["avatar"],
        "available": bool(row["available"]),
        "availability_status_en": row["availability_status_en"],
        "availability_status_te": row["availability_status_te"],
        "about_en": row["about_en"],
        "available_days": row["available_days"],
        "available_slots": [s.strip() for s in row["available_slots"].split(",")],
        "conditions_treated": [c.strip() for c in row["conditions_treated"].split(",")]
    }

# ROUTES

@app.route("/")
def home():
    conn = get_db_connection()
    doctors_rows = conn.execute("SELECT * FROM doctors").fetchall()
    doctors_list = [format_doctor(r) for r in doctors_rows]
    
    apt_rows = conn.execute("SELECT * FROM appointments ORDER BY created_at DESC").fetchall()
    appointments_list = [dict(r) for r in apt_rows]
    conn.close()

    return render_template(
        "index.html",
        specializations=SPECIALIZATIONS,
        doctors=doctors_list,
        appointments=appointments_list,
        prescriptions=PRESCRIPTIONS,
        documents=DOCUMENTS,
        hospitals=HOSPITALS,
        quick_queries=QUICK_QUERIES,
        current_time=datetime.now().strftime("%b %d, %Y %I:%M %p")
    )

@app.route("/api/doctors", methods=["GET"])
def get_doctors():
    spec = request.args.get("specialization", "all").strip().lower()
    search = request.args.get("search", "").strip().lower()

    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM doctors").fetchall()
    conn.close()

    filtered = []
    for r in rows:
        doc = format_doctor(r)
        
        # Category / Specialization filter
        match_spec = True
        if spec and spec != "all":
            match_spec = (doc["category"].lower() == spec) or (spec in doc["specialization_en"].lower())

        # Keyword search filter
        match_search = True
        if search:
            search_fields = [
                doc["name_en"].lower(),
                doc["specialization_en"].lower(),
                doc["hospital_en"].lower(),
                doc["qualification"].lower(),
                " ".join(doc["conditions_treated"]).lower(),
                " ".join(doc["languages"]).lower()
            ]
            match_search = any(search in f for f in search_fields)

        if match_spec and match_search:
            filtered.append(doc)

    return jsonify({
        "status": "success",
        "doctors": filtered,
        "count": len(filtered)
    })

@app.route("/api/doctor/<int:doc_id>", methods=["GET"])
def get_doctor_detail(doc_id):
    conn = get_db_connection()
    row = conn.execute("SELECT * FROM doctors WHERE id = ?", (doc_id,)).fetchone()
    conn.close()

    if not row:
        return jsonify({"status": "error", "message": f"Doctor with ID {doc_id} not found."}), 404

    return jsonify({
        "status": "success",
        "doctor": format_doctor(row)
    })

@app.route("/api/book-appointment", methods=["POST"])
def book_appointment():
    data = request.get_json() or {}
    
    doc_id = data.get("doctor_id")
    date_str = data.get("date", "").strip()
    time_slot = data.get("time_slot", "").strip()
    consultation_type = data.get("consultation_type", "Video Consultation").strip()
    complaint = data.get("complaint", "").strip()
    patient_name = data.get("patient_name", "Sai Manohar").strip()

    if not doc_id or not date_str or not time_slot or not complaint:
        return jsonify({
            "status": "error",
            "message": "All fields (Doctor, Date, Time Slot, and Symptoms/Reason) are strictly required."
        }), 400

    conn = get_db_connection()
    
    # Check doctor existence
    doc_row = conn.execute("SELECT * FROM doctors WHERE id = ?", (doc_id,)).fetchone()
    if not doc_row:
        conn.close()
        return jsonify({"status": "error", "message": "Selected doctor does not exist."}), 404

    doc = format_doctor(doc_row)

    # Double Booking Prevention Check
    existing = conn.execute('''
        SELECT * FROM appointments 
        WHERE doctor_id = ? AND date = ? AND time_slot = ? AND status != 'Cancelled'
    ''', (doc_id, date_str, time_slot)).fetchone()

    if existing:
        conn.close()
        return jsonify({
            "status": "error",
            "message": f"Doctor {doc['name_en']} is ALREADY BOOKED on {date_str} at {time_slot}. Please select a different date or time slot!"
        }), 409

    # Generate Unique Appointment ID
    apt_id = f"APT-2026-{uuid.uuid4().hex[:4].upper()}"

    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO appointments (
            id, doctor_id, doctor_name, specialization, date, time_slot, type, complaint, patient_name, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        apt_id, doc["id"], doc["name_en"], doc["specialization_en"],
        date_str, time_slot, consultation_type, complaint, patient_name, "Confirmed"
    ))
    conn.commit()

    # Fetch inserted appointment record
    new_apt_row = conn.execute("SELECT * FROM appointments WHERE id = ?", (apt_id,)).fetchone()
    conn.close()

    return jsonify({
        "status": "success",
        "message": f"Appointment successfully confirmed with {doc['name_en']}!",
        "appointment": dict(new_apt_row)
    })

@app.route("/api/appointments", methods=["GET"])
def get_appointments():
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM appointments ORDER BY created_at DESC").fetchall()
    conn.close()

    appointments = [dict(r) for r in rows]
    return jsonify({
        "status": "success",
        "appointments": appointments,
        "count": len(appointments)
    })

@app.route("/api/cancel-appointment", methods=["POST"])
def cancel_appointment():
    data = request.get_json() or {}
    apt_id = data.get("appointment_id")

    if not apt_id:
        return jsonify({"status": "error", "message": "Appointment ID is required."}), 400

    conn = get_db_connection()
    row = conn.execute("SELECT * FROM appointments WHERE id = ?", (apt_id,)).fetchone()
    
    if not row:
        conn.close()
        return jsonify({"status": "error", "message": "Appointment not found."}), 404

    conn.execute("UPDATE appointments SET status = 'Cancelled' WHERE id = ?", (apt_id,))
    conn.commit()
    conn.close()

    return jsonify({
        "status": "success",
        "message": f"Appointment {apt_id} has been cancelled successfully."
    })

@app.route("/api/reschedule-appointment", methods=["POST"])
def reschedule_appointment():
    data = request.get_json() or {}
    apt_id = data.get("appointment_id")
    new_date = data.get("new_date", "").strip()
    new_slot = data.get("new_slot", "").strip()

    if not apt_id or not new_date or not new_slot:
        return jsonify({"status": "error", "message": "Appointment ID, new date, and time slot are required."}), 400

    conn = get_db_connection()
    row = conn.execute("SELECT * FROM appointments WHERE id = ?", (apt_id,)).fetchone()
    
    if not row:
        conn.close()
        return jsonify({"status": "error", "message": "Appointment not found."}), 404

    doc_id = row["doctor_id"]
    # Check for conflict
    existing = conn.execute('''
        SELECT * FROM appointments 
        WHERE doctor_id = ? AND date = ? AND time_slot = ? AND id != ? AND status != 'Cancelled'
    ''', (doc_id, new_date, new_slot, apt_id)).fetchone()

    if existing:
        conn.close()
        return jsonify({
            "status": "error",
            "message": f"Doctor is already booked on {new_date} at {new_slot}. Please select another slot."
        }), 409

    conn.execute('''
        UPDATE appointments SET date = ?, time_slot = ?, status = 'Rescheduled' WHERE id = ?
    ''', (new_date, new_slot, apt_id))
    conn.commit()
    
    updated_row = conn.execute("SELECT * FROM appointments WHERE id = ?", (apt_id,)).fetchone()
    conn.close()

    return jsonify({
        "status": "success",
        "message": f"Appointment {apt_id} rescheduled to {new_date} at {new_slot}.",
        "appointment": dict(updated_row)
    })

@app.route("/api/upload-document", methods=["POST"])
def upload_document():
    data = request.get_json() or {}
    title = data.get("title", "Medical Report")
    category = data.get("category", "Lab Test Report")
    file_name = data.get("file_name", "report.pdf")

    new_doc = {
        "title": title,
        "category": category,
        "date": datetime.now().strftime("%Y-%m-%d"),
        "status": "Verified",
        "file_name": file_name
    }
    return jsonify({
        "status": "success",
        "message": f"Document '{title}' uploaded to health vault successfully.",
        "document": new_doc
    })

@app.route("/api/sos-trigger", methods=["POST"])
def sos_trigger():
    return jsonify({
        "status": "success",
        "message_en": "FastResponse Emergency Unit #08 dispatched. Apollo Trauma Center notified (Arrival: 6-8 mins).",
        "message_te": "అత్యవసర అంబులెన్స్ విభాగం #08 పంపబడింది. అపోలో ట్రౌమా సెంటర్ కు సమాచారం అందించబడింది."
    })

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "ArogyaCare Healthcare Platform Backend",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_ENV") == "development"
    app.run(host="0.0.0.0", port=port, debug=debug)


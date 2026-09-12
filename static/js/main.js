/**
 * ArogyaCare Healthcare Platform — Main JavaScript Controller
 * Multilingual Engine (English & Telugu), Doctor Directory Search,
 * Appointment Booking, Video Room Simulation, Tele-Chat, Document Vault,
 * Emergency SOS Dispatch, and Profile Health Passport.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTabNavigation();
  initSpecializationFilters();
  initCallTimer();
});

// Helper for dynamic production API URL resolution
function getApiUrl(endpoint) {
  if (window.AROGYACARE_CONFIG && typeof window.AROGYACARE_CONFIG.getApiUrl === 'function') {
    return window.AROGYACARE_CONFIG.getApiUrl(endpoint);
  }
  return endpoint;
}


// Current language state ('en' | 'te')
let currentLang = 'en';

// Multilingual Dictionary (English & Telugu - ఇంగ్లీష్ & తెలుగు)
const i18n = {
  en: {
    tagline: "Online Healthcare Platform",
    nav_doctors: "Find Doctors",
    nav_appointments: "Appointments",
    nav_video: "Video Consult",
    nav_chat: "Tele-Chat",
    nav_records: "Rx & Vault",
    nav_hospitals: "Emergency & Hospitals",
    nav_profile: "Health ID",
    sos_btn: "SOS 108",
    notif_title: "Notifications",
    hero_badge: "Verified Specialist Telemedicine Platform",
    hero_title1: "Quality Healthcare",
    hero_title2: "Anytime, Anywhere",
    hero_subtitle: "Consult top doctors via video calls, book in-clinic appointments, access digital prescriptions, and trigger 24/7 emergency SOS support.",
    search_btn: "Search Doctors",
    sec_doctors_title: "Find Specialist Doctors",
    sec_doctors_sub: "Book online video consultations or clinic visits with certified healthcare specialists.",
    sec_appointments_title: "My Appointments",
    sec_appointments_sub: "Manage upcoming video consultations, clinic visits, and past health history.",
    sec_video_title: "Online Tele-Video Consultation Room",
    sec_video_sub: "Secure, HD end-to-end encrypted virtual doctor consultation with live video, audio, and chat.",
    sec_chat_title: "Patient-Doctor Tele-Chat",
    sec_chat_sub: "Direct messaging with your consulting doctor for non-emergency advice, follow-ups, and report reviews.",
    sec_records_title: "Digital Prescription Vault & Reports",
    sec_records_sub: "Access digital doctor prescriptions, dosage instructions, and lab reports safely stored in your health vault.",
    sec_sos_title: "Emergency SOS & 24/7 Hospitals Tracker",
    sec_sos_sub: "Trigger instant emergency dispatch or connect directly with nearby 24/7 trauma hospitals and ICU units.",
    sec_profile_title: "Patient Digital Health Passport ID",
    sec_profile_sub: "Your universal digital medical identity card with blood group, allergy records, and emergency contact details.",
    btn_view_profile: "View Profile",
    btn_book_now: "Book Consultation",
    btn_new_appointment: "Book New Appointment",
    btn_join_video: "Join Video Room",
    btn_chat_doc: "Message Doctor",
    btn_upload_report: "Upload Medical Report",
    sos_banner_btn: "TRIGGER EMERGENCY SOS (108)",
    recent_consultants: "Recent Consultants",
    modal_book_title: "Book Doctor Consultation"
  },
  te: {
    tagline: "ఆరోగ్య సంరక్షణ వ్యవస్థ",
    nav_doctors: "డాక్టర్లను వెతకండి",
    nav_appointments: "అపాయింట్‌మెంట్లు",
    nav_video: "వీడియో సంప్రదింపులు",
    nav_chat: "డాక్టర్ చాట్",
    nav_records: "ప్రిస్క్రిప్షన్ & రిపోర్టులు",
    nav_hospitals: "అత్యవసర & హాస్పిటల్స్",
    nav_profile: "హెల్త్ ఐడీ",
    sos_btn: "SOS 108",
    notif_title: "నోటిఫికేషన్లు",
    hero_badge: "ధృవీకరించబడిన నిపుణుల టెలిమెడిసిన్ ప్లాట్‌ఫాం",
    hero_title1: "మెరుగైన వైద్య సేవలు",
    hero_title2: "ఎప్పుడైనా, ఎక్కడైనా",
    hero_subtitle: "వీడియో కాల్స్ ద్వారా అగ్రశ్రేణి వైద్యులను సంప్రదించండి, అపాయింట్‌మెంట్‌లు బుక్ చేయండి, డిజిటల్ ప్రిస్క్రిప్షన్‌లు పొందండి మరియు 24/7 ఎమర్జెన్సీ SOS సేవలు పొందండి.",
    search_btn: "డాక్టర్లను వెతకండి",
    sec_doctors_title: "వైద్య నిపుణులను వెతకండి",
    sec_doctors_sub: "ధృవీకరించబడిన వైద్య నిపుణులతో ఆన్‌లైన్ వీడియో సంప్రదింపులు లేదా క్లినిక్ సందర్శనలను బుక్ చేసుకోండి.",
    sec_appointments_title: "నా అపాయింట్‌మెంట్‌లు",
    sec_appointments_sub: "రాబోయే వీడియో సంప్రదింపులు, క్లినిక్ సందర్శనలు మరియు ఆరోగ్య చరిత్రను నిర్వహించండి.",
    sec_video_title: "ఆన్‌లైన్ టెలి-వీడియో సంప్రదింపుల గది",
    sec_video_sub: "లైవ్ వీడియో, ఆడియో మరియు చాట్‌తో సురక్షితమైన హెచ్‌డి వీడియో వైద్య సంప్రదింపులు.",
    sec_chat_title: "పేషెంట్-డాక్టర్ టెలి-చాట్",
    sec_chat_sub: "సలహాలు, తదుపరి పరీక్షలు మరియు నివేదికల పరిశీలన కోసం మీ వైద్యునితో ప్రత్యక్ష సందేశాలు పంపండి.",
    sec_records_title: "డిజిటల్ ప్రిస్క్రిప్షన్ & ల్యాబ్ రిపోర్టులు",
    sec_records_sub: "మీ డిజిటల్ వైద్యుల ప్రిస్క్రిప్షన్లు మరియు ల్యాబ్ నివేదికలను సురక్షితంగా వీక్షించండి.",
    sec_sos_title: "అత్యవసర SOS & 24/7 ఆసుపత్రుల గుర్తింపు",
    sec_sos_sub: "వెంటనే అత్యవసర అంబులెన్స్ సేవలను పొందండి లేదా దగ్గరలోని 24/7 ఐసీయూ ఆసుపత్రులతో కనెక్ట్ అవ్వండి.",
    sec_profile_title: "పేషెంట్ డిజిటల్ హెల్త్ పాస్‌పోర్ట్ ఐడీ",
    sec_profile_sub: "రక్త గ్రూపు, అలెర్జీ రికార్డులు మరియు అత్యవసర సంప్రదింపు వివరాలతో మీ విశ్వవ్యాప్త డిజిటల్ హెల్త్ కార్డ్.",
    btn_view_profile: "ప్రొఫైల్ చూడండి",
    btn_book_now: "బుక్ చేసుకోండి",
    btn_new_appointment: "కొత్త అపాయింట్‌మెంట్ బుక్ చేయండి",
    btn_join_video: "వీడియో గదిలో చేరండి",
    btn_chat_doc: "డాక్టర్‌కి మెసేజ్ చేయండి",
    btn_upload_report: "వైద్య నివేదికను అప్‌లోడ్ చేయండి",
    sos_banner_btn: "అత్యవసర SOS అంబులెన్స్ (108)",
    recent_consultants: "ఇటీవలి వైద్యులు",
    modal_book_title: "డాక్టర్ అపాయింట్‌మెంట్ బుక్ చేసుకోండి"
  }
};

/**
 * Multilingual Toggle (English & Telugu)
 */
function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'te' : 'en';
  document.getElementById('current-lang-label').textContent = currentLang === 'en' ? 'EN | తెలుగు' : 'తెలుగు | EN';

  // Translate elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(elem => {
    const key = elem.getAttribute('data-i18n');
    if (i18n[currentLang][key]) {
      elem.textContent = i18n[currentLang][key];
    }
  });

  // Toggle bilingual elements
  toggleBilingualElements();
  showToast(`Language switched to ${currentLang === 'en' ? 'English' : 'తెలుగు (Telugu)'}`);
}

function toggleBilingualElements() {
  const showEn = currentLang === 'en';
  document.querySelectorAll('.spec-en, .doc-name-en, .doc-spec-en, .hosp-en, .addr-en, .icu-en, .status-en, .qq-en').forEach(e => e.style.display = showEn ? 'inline' : 'none');
  document.querySelectorAll('.spec-te, .doc-name-te, .doc-spec-te, .hosp-te, .addr-te, .icu-te, .status-te, .qq-te').forEach(e => e.style.display = showEn ? 'none' : 'inline');
}

/**
 * Tab Navigation Controller (Desktop & Mobile)
 */
function initTabNavigation() {
  const navBtns = document.querySelectorAll('.nav-btn, .mobile-nav-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      navBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      // Highlight active desktop & mobile buttons for this tab
      document.querySelectorAll(`[data-tab="${targetTab}"]`).forEach(b => b.classList.add('active'));

      const activeContent = document.getElementById(`tab-${targetTab}`);
      if (activeContent) {
        activeContent.classList.add('active');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

function switchTab(tabId) {
  const btn = document.querySelector(`.nav-btn[data-tab="${tabId}"]`);
  if (btn) btn.click();
}

/**
 * Specialization Filters & Doctor Search
 */
function initSpecializationFilters() {
  const pills = document.querySelectorAll('#specialization-pills .pill-btn');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const specId = pill.getAttribute('data-spec');
      const query = document.getElementById('doctor-search-input').value.trim();
      filterDoctors(specId, query);
    });
  });
}

function handleDoctorSearch() {
  const query = document.getElementById('doctor-search-input').value.trim();
  const activePill = document.querySelector('#specialization-pills .pill-btn.active');
  const specId = activePill ? activePill.getAttribute('data-spec') : 'all';
  filterDoctors(specId, query);
}

function filterDoctors(specId, query) {
  const badge = document.getElementById('doctor-count-badge');
  if (badge) badge.textContent = 'Searching...';

  fetch(`/api/doctors?specialization=${encodeURIComponent(specId)}&search=${encodeURIComponent(query)}`)
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch doctors');
      return res.json();
    })
    .then(data => {
      if (data.status === 'success' && data.doctors) {
        renderDoctorsGrid(data.doctors);
        if (badge) badge.textContent = `Showing ${data.count} Doctor(s)`;
      }
    })
    .catch(err => {
      console.error('Error fetching doctors:', err);
      showToast('Error searching doctors. Please try again.');
    });
}

function renderDoctorsGrid(doctors) {
  const container = document.getElementById('doctors-grid-container');
  if (!container) return;

  if (!doctors || doctors.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1.5rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
        <i class="fa-solid fa-user-slash" style="font-size: 3rem; color: var(--medical-teal); margin-bottom: 1rem;"></i>
        <h3 style="margin-bottom: 0.5rem; color: var(--text-main);">No Doctors Found</h3>
        <p style="color: var(--text-muted); font-size: 0.95rem; max-width: 480px; margin: 0 auto 1.5rem;">
          No specialist doctors matched your query or filter. Try searching for other specialties like <strong>Cardiologist</strong>, <strong>Dermatologist</strong>, <strong>Pediatrician</strong> or symptoms like <strong>Fever</strong>.
        </p>
        <button class="btn-secondary" onclick="resetDoctorFilters()">
          <i class="fa-solid fa-rotate-left"></i> View All Doctors
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = doctors.map(d => `
    <div class="doctor-card" id="doc-card-${d.id}">
      <div class="doc-card-header">
        <img src="${d.avatar}" alt="${d.name_en}" class="doc-avatar">
        <div class="doc-status-badge ${d.available ? 'online' : ''}">
          <i class="fa-solid fa-circle"></i>
          <span class="status-en">${d.availability_status_en}</span>
          <span class="status-te" style="display:none;">${d.availability_status_te}</span>
        </div>
      </div>
      <div class="doc-card-body">
        <h3 class="doc-name">
          <span class="doc-name-en">${d.name_en}</span>
          <span class="doc-name-te" style="display:none;">${d.name_te}</span>
        </h3>
        <p class="doc-spec">
          <span class="doc-spec-en">${d.specialization_en}</span>
          <span class="doc-spec-te" style="display:none;">${d.specialization_te}</span>
        </p>
        <p class="doc-hospital"><i class="fa-solid fa-building-hospital"></i> ${d.hospital_en}</p>
        <p class="doc-qual"><i class="fa-solid fa-graduation-cap"></i> ${d.qualification}</p>
        <div class="doc-meta-row">
          <span class="meta-item"><i class="fa-solid fa-briefcase"></i> ${d.experience_years} Yrs Exp</span>
          <span class="meta-item text-yellow"><i class="fa-solid fa-star"></i> ${d.rating} (${d.reviews_count})</span>
          <span class="meta-item text-green"><i class="fa-solid fa-indian-rupee-sign"></i> ${d.fee}</span>
        </div>
        <div class="doc-languages"><i class="fa-solid fa-language"></i> ${d.languages ? d.languages.join(', ') : 'English'}</div>
      </div>
      <div class="doc-card-footer">
        <button class="btn-secondary" onclick="openDoctorModal(${d.id})">
          <i class="fa-solid fa-user"></i> <span data-i18n="btn_view_profile">View Profile</span>
        </button>
        <button class="btn-primary" onclick="openBookingModal(${d.id})">
          <i class="fa-solid fa-calendar-plus"></i> <span data-i18n="btn_book_now">Book Consultation</span>
        </button>
      </div>
    </div>
  `).join('');

  toggleBilingualElements();
}

function resetDoctorFilters() {
  document.getElementById('doctor-search-input').value = '';
  const pills = document.querySelectorAll('#specialization-pills .pill-btn');
  pills.forEach(p => p.classList.remove('active'));
  const allPill = document.querySelector('#specialization-pills .pill-btn[data-spec="all"]');
  if (allPill) allPill.classList.add('active');
  filterDoctors('all', '');
}

/**
 * Appointment Booking Modal Logic & Error Validation
 */
function openBookingModal(doctorId) {
  // Hide error container
  const errBox = document.getElementById('booking-error-alert');
  if (errBox) errBox.style.display = 'none';

  fetch(`/api/doctor/${doctorId}`)
    .then(res => {
      if (!res.ok) throw new Error('Doctor not found');
      return res.json();
    })
    .then(data => {
      if (data.status === 'success' && data.doctor) {
        const doc = data.doctor;
        document.getElementById('book-doc-id').value = doc.id;
        document.getElementById('book-doc-name').textContent = doc.name_en;
        document.getElementById('book-doc-spec').textContent = doc.specialization_en;
        document.getElementById('book-doc-fee').textContent = `Consultation Fee: ₹${doc.fee}`;
        if (doc.avatar) document.getElementById('book-doc-img').src = doc.avatar;

        // Populate time slots dropdown
        const slotSelect = document.getElementById('book-slot');
        if (slotSelect && doc.available_slots && doc.available_slots.length > 0) {
          slotSelect.innerHTML = doc.available_slots.map(s => `<option value="${s}">${s}</option>`).join('');
        }

        // Set date to today min
        const today = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById('book-date');
        dateInput.min = today;
        if (!dateInput.value || dateInput.value < today) {
          dateInput.value = today;
        }

        document.getElementById('modal-booking').classList.add('active');
      }
    })
    .catch(err => {
      console.error('Error loading doctor details:', err);
      showToast('Could not load doctor details.');
    });
}

function closeBookingModal() {
  document.getElementById('modal-booking').classList.remove('active');
}

function submitBooking() {
  const errBox = document.getElementById('booking-error-alert');
  const errText = document.getElementById('booking-error-text');
  if (errBox) errBox.style.display = 'none';

  const docId = document.getElementById('book-doc-id').value;
  const patientName = document.getElementById('book-patient-name').value.trim();
  const date = document.getElementById('book-date').value.trim();
  const slot = document.getElementById('book-slot').value.trim();
  const mode = document.getElementById('book-mode').value;
  const complaint = document.getElementById('book-complaint').value.trim();

  // Validate form fields
  if (!patientName || !date || !slot || !complaint) {
    if (errBox && errText) {
      errText.textContent = 'Please fill out all required fields: Patient Name, Date, Time Slot, and Reason.';
      errBox.style.display = 'block';
    }
    showToast('Please fill out all required booking fields.');
    return;
  }

  const submitBtn = document.getElementById('btn-submit-booking');
  const origBtnText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';

  fetch('/api/book-appointment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      doctor_id: parseInt(docId),
      patient_name: patientName,
      date: date,
      time_slot: slot,
      consultation_type: mode,
      complaint: complaint
    })
  })
  .then(res => res.json().then(data => ({ status: res.status, body: data })))
  .then(({ status, body }) => {
    submitBtn.disabled = false;
    submitBtn.innerHTML = origBtnText;

    if (status === 200 && body.status === 'success') {
      closeBookingModal();
      showToast(`Appointment successfully booked for ${body.appointment.date} at ${body.appointment.time_slot}!`);
      prependAppointmentCard(body.appointment);
      // Clear complaint field
      document.getElementById('book-complaint').value = '';
      switchTab('appointments');
    } else {
      const msg = body.message || 'Failed to book appointment. Please try again.';
      if (errBox && errText) {
        errText.textContent = msg;
        errBox.style.display = 'block';
      }
      showToast(`Error: ${msg}`);
    }
  })
  .catch(err => {
    submitBtn.disabled = false;
    submitBtn.innerHTML = origBtnText;
    console.error('Error submitting booking:', err);
    if (errBox && errText) {
      errText.textContent = 'Network error occurred. Please try again.';
      errBox.style.display = 'block';
    }
    showToast('Network error while booking appointment.');
  });
}

function prependAppointmentCard(apt) {
  const container = document.getElementById('appointments-list-container');
  if (!container) return;

  const isCancelled = apt.status === 'Cancelled';
  const cardHtml = `
    <div class="appointment-card" id="apt-card-${apt.id}">
      <div class="apt-header">
        <div class="apt-id-badge">${apt.id}</div>
        <span class="apt-status-badge ${isCancelled ? 'cancelled' : 'confirmed'}" id="apt-status-${apt.id}" style="${isCancelled ? 'background: rgba(239,68,68,0.15); color: var(--sos-red);' : ''}">
          <i class="fa-solid fa-${isCancelled ? 'circle-xmark' : 'circle-check'}"></i> ${apt.status}
        </span>
      </div>
      <div class="apt-body">
        <div class="apt-doc-info">
          <div class="doc-icon-box"><i class="fa-solid fa-user-doctor"></i></div>
          <div>
            <h4 class="apt-doc-name">${apt.doctor_name}</h4>
            <p class="apt-doc-spec">${apt.specialization}</p>
          </div>
        </div>
        <div class="apt-details-grid">
          <div><i class="fa-solid fa-calendar text-teal"></i> <strong>Date:</strong> ${apt.date}</div>
          <div><i class="fa-solid fa-clock text-teal"></i> <strong>Time Slot:</strong> ${apt.time_slot}</div>
          <div><i class="fa-solid fa-video text-blue"></i> <strong>Mode:</strong> ${apt.type}</div>
          <div><i class="fa-solid fa-notes-medical text-muted"></i> <strong>Reason:</strong> ${apt.complaint}</div>
        </div>
      </div>
      <div class="apt-footer">
        ${!isCancelled ? `
          <button class="btn-primary" onclick="launchVideoCall('${apt.id}', '${apt.doctor_name}')">
            <i class="fa-solid fa-video"></i> Join Video Room
          </button>
          <button class="btn-secondary" onclick="openChatWithDoctor('${apt.doctor_id}', '${apt.doctor_name}')">
            <i class="fa-solid fa-comments"></i> Message Doctor
          </button>
          <button class="btn-secondary" style="border-color: var(--sos-red); color: var(--sos-red);" onclick="cancelAppointment('${apt.id}')">
            <i class="fa-solid fa-xmark"></i> Cancel
          </button>
        ` : `
          <span style="color: var(--text-dim); font-size: 0.85rem;"><i class="fa-solid fa-ban"></i> Appointment Cancelled</span>
        `}
      </div>
    </div>
  `;

  container.insertAdjacentHTML('afterbegin', cardHtml);
}

function cancelAppointment(aptId) {
  if (!confirm(`Are you sure you want to cancel appointment ${aptId}?`)) return;

  fetch('/api/cancel-appointment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ appointment_id: aptId })
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === 'success') {
      showToast(data.message);
      const statusBadge = document.getElementById(`apt-status-${aptId}`);
      if (statusBadge) {
        statusBadge.className = 'apt-status-badge cancelled';
        statusBadge.style.background = 'rgba(239, 68, 68, 0.15)';
        statusBadge.style.color = 'var(--sos-red)';
        statusBadge.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Cancelled';
      }
    } else {
      showToast(`Error: ${data.message}`);
    }
  })
  .catch(err => {
    console.error('Error cancelling appointment:', err);
    showToast('Failed to cancel appointment.');
  });
}

/**
 * Doctor Profile Detail Modal
 */
function openDoctorModal(doctorId) {
  const content = document.getElementById('doctor-modal-content');
  if (content) {
    content.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--text-muted);"><i class="fa-solid fa-spinner fa-spin" style="font-size: 2rem; color: var(--medical-teal);"></i><p style="margin-top: 0.5rem;">Loading doctor profile...</p></div>';
  }
  document.getElementById('modal-doctor-profile').classList.add('active');

  fetch(`/api/doctor/${doctorId}`)
    .then(res => {
      if (!res.ok) throw new Error('Doctor profile not found');
      return res.json();
    })
    .then(data => {
      if (data.status === 'success' && data.doctor) {
        const doc = data.doctor;
        content.innerHTML = `
          <div style="display: flex; gap: 1.5rem; margin-bottom: 1.5rem; align-items: center; background: rgba(0,0,0,0.2); padding: 1.25rem; border-radius: var(--radius-md);">
            <img src="${doc.avatar}" style="width: 90px; height: 90px; border-radius: 50%; object-fit: cover; border: 3px solid var(--medical-teal); box-shadow: var(--shadow-glow);">
            <div>
              <h3 style="font-size: 1.4rem; color: var(--text-main); margin-bottom: 0.25rem;">${doc.name_en}</h3>
              <p style="color: var(--medical-teal); font-weight: 700; font-size: 1rem; margin-bottom: 0.35rem;">${doc.specialization_en}</p>
              <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 0.25rem;"><i class="fa-solid fa-building-hospital" style="color: var(--medical-teal);"></i> ${doc.hospital_en}</p>
              <p style="font-size: 0.82rem; color: var(--text-dim);"><i class="fa-solid fa-graduation-cap"></i> ${doc.qualification}</p>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; background: var(--bg-card); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); font-size: 0.88rem; margin-bottom: 1.25rem;">
            <div><i class="fa-solid fa-briefcase text-teal"></i> <strong>Experience:</strong> ${doc.experience_years} Years</div>
            <div><i class="fa-solid fa-indian-rupee-sign text-green"></i> <strong>Consult Fee:</strong> ₹${doc.fee}</div>
            <div><i class="fa-solid fa-star text-yellow"></i> <strong>Rating:</strong> ${doc.rating} (${doc.reviews_count} reviews)</div>
            <div><i class="fa-solid fa-language text-blue"></i> <strong>Languages:</strong> ${doc.languages ? doc.languages.join(', ') : 'English'}</div>
            <div><i class="fa-solid fa-calendar-days text-teal"></i> <strong>Available:</strong> ${doc.available_days || 'Mon - Sat'}</div>
            <div><i class="fa-solid fa-video text-teal"></i> <strong>Tele-Consult:</strong> HD Video & Clinic</div>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <h4 style="font-size: 0.95rem; color: var(--text-main); margin-bottom: 0.4rem;"><i class="fa-solid fa-user-doctor"></i> About Doctor</h4>
            <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">${doc.about_en || 'Senior medical specialist.'}</p>
          </div>

          ${doc.conditions_treated ? `
            <div style="margin-bottom: 1.5rem;">
              <h4 style="font-size: 0.95rem; color: var(--text-main); margin-bottom: 0.5rem;"><i class="fa-solid fa-stethoscope"></i> Specializations & Conditions Treated</h4>
              <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
                ${doc.conditions_treated.map(c => `<span style="background: rgba(14, 165, 233, 0.12); color: var(--medical-teal); font-size: 0.78rem; padding: 0.25rem 0.65rem; border-radius: var(--radius-full); border: 1px solid rgba(14, 165, 233, 0.25);">${c}</span>`).join('')}
              </div>
            </div>
          ` : ''}

          <div style="display: flex; gap: 0.85rem; margin-top: 1.5rem;">
            <button class="btn-secondary" style="flex: 1;" onclick="closeDoctorModal()">Close Profile</button>
            <button class="btn-primary" style="flex: 1.5;" onclick="closeDoctorModal(); openBookingModal(${doc.id});">
              <i class="fa-solid fa-calendar-plus"></i> Book Consultation
            </button>
          </div>
        `;
      }
    })
    .catch(err => {
      console.error('Error fetching doctor detail:', err);
      content.innerHTML = '<div style="color: var(--sos-red); text-align: center; padding: 2rem;"><i class="fa-solid fa-triangle-exclamation" style="font-size: 2rem; margin-bottom: 0.5rem;"></i><p>Could not load doctor profile details.</p></div>';
    });
}

function closeDoctorModal() {
  document.getElementById('modal-doctor-profile').classList.remove('active');
}


/**
 * Virtual Tele-Video Consultation Room Controls
 */
let callTimerInterval = null;
let callSeconds = 252; // 04:12

function initCallTimer() {
  const timerElem = document.getElementById('call-timer');
  if (!timerElem) return;

  clearInterval(callTimerInterval);
  callTimerInterval = setInterval(() => {
    callSeconds++;
    const mins = String(Math.floor(callSeconds / 60)).padStart(2, '0');
    const secs = String(callSeconds % 60).padStart(2, '0');
    timerElem.textContent = `00:${mins}:${secs}`;
  }, 1000);
}

function launchVideoCall(aptId, doctorName) {
  document.getElementById('call-doctor-name').textContent = doctorName;
  switchTab('video-consult');
  showToast(`Connected to Virtual Video Consultation Room with ${doctorName}!`);
}

function toggleMic() {
  const btn = document.getElementById('btn-toggle-mic');
  btn.classList.toggle('active');
  btn.classList.toggle('muted');
  const isMuted = btn.classList.contains('muted');
  btn.innerHTML = `<i class="fa-solid fa-${isMuted ? 'microphone-slash' : 'microphone'}"></i>`;
  showToast(isMuted ? 'Microphone muted' : 'Microphone unmuted');
}

function toggleCam() {
  const btn = document.getElementById('btn-toggle-cam');
  btn.classList.toggle('active');
  btn.classList.toggle('off');
  const isOff = btn.classList.contains('off');
  btn.innerHTML = `<i class="fa-solid fa-video${isOff ? '-slash' : ''}"></i>`;
  showToast(isOff ? 'Camera turned off' : 'Camera turned on');
}

function toggleScreenShare() {
  showToast('Sharing medical report document screen...');
}

function toggleInCallChat() {
  const panel = document.getElementById('in-call-chat-panel');
  panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
}

function sendInCallMessage() {
  const input = document.getElementById('in-call-input');
  const text = input.value.trim();
  if (!text) return;

  const msgBox = document.getElementById('in-call-messages');
  const msgDiv = document.createElement('div');
  msgDiv.className = 'chat-msg patient-msg';
  msgDiv.innerHTML = `<strong>You:</strong> ${text}`;
  msgBox.appendChild(msgDiv);
  input.value = '';
  msgBox.scrollTop = msgBox.scrollHeight;
}

function endVideoCall() {
  clearInterval(callTimerInterval);
  showToast('Video Consultation Ended. Digital summary saved in Vault.');
  switchTab('appointments');
}

/**
 * Patient-Doctor Tele-Chat
 */
function openChatWithDoctor(docId, docName) {
  document.getElementById('active-chat-doc-name').textContent = docName;
  switchTab('chat');
}

function selectChatDoctor(docId, docName, avatarUrl) {
  document.getElementById('active-chat-doc-name').textContent = docName;
  document.getElementById('active-chat-avatar').src = avatarUrl;
  document.querySelectorAll('.chat-doc-item').forEach(i => i.classList.remove('active'));
  event.currentTarget.classList.add('active');
}

function insertQuickQuery(msgText) {
  const input = document.getElementById('chat-message-input');
  input.value = msgText;
  input.focus();
}

function sendMainChatMessage() {
  const input = document.getElementById('chat-message-input');
  const text = input.value.trim();
  if (!text) return;

  const container = document.getElementById('chat-messages-area');
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble outgoing';
  bubble.innerHTML = `
    <div class="bubble-sender">You</div>
    <div class="bubble-text">${text}</div>
    <div class="bubble-meta">${timeStr} <i class="fa-solid fa-check-double text-teal"></i></div>
  `;

  container.appendChild(bubble);
  input.value = '';
  container.scrollTop = container.scrollHeight;

  // Auto doctor response simulation after 2 seconds
  setTimeout(() => {
    const docBubble = document.createElement('div');
    docBubble.className = 'chat-bubble incoming';
    docBubble.innerHTML = `
      <div class="bubble-sender">Dr. K. Srinivas</div>
      <div class="bubble-text">Thank you for sharing. Please take 1 Paracetamol 650mg after food and keep hydrated. Let me know if fever persists.</div>
      <div class="bubble-meta">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} <i class="fa-solid fa-check-double text-teal"></i></div>
    `;
    container.appendChild(docBubble);
    container.scrollTop = container.scrollHeight;
  }, 2000);
}

/**
 * Prescription Vault & Medical Document Upload
 */
function openPrescriptionView(rxId) {
  showToast(`Opening Digital Prescription #${rxId}`);
}

function downloadPrescriptionPDF(rxId) {
  const content = `ArogyaCare Digital Prescription #${rxId}\nDoctor: Dr. K. Srinivas\nDiagnosis: Acute Upper Respiratory Infection\nMedicines:\n1. Paracetamol 650mg - 1-0-1\n2. Azithromycin 500mg - 1-0-0\nAdvice: Drink warm water and rest.`;
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${rxId}_prescription.txt`;
  a.click();
  showToast(`Downloaded Prescription ${rxId}`);
}

function openUploadModal() {
  document.getElementById('modal-upload-document').classList.add('active');
}

function closeUploadModal() {
  document.getElementById('modal-upload-document').classList.remove('active');
}

function submitDocumentUpload() {
  const title = document.getElementById('up-title').value;
  const category = document.getElementById('up-category').value;
  const fileInput = document.getElementById('up-file');
  const fileName = fileInput.files[0] ? fileInput.files[0].name : 'lab_report.pdf';

  fetch('/api/upload-document', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: title, category: category, file_name: fileName })
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === 'success') {
      closeUploadModal();
      showToast(data.message);
      prependVaultDocument(data.document);
    }
  });
}

function prependVaultDocument(doc) {
  const container = document.getElementById('documents-vault-list');
  if (!container) return;

  const html = `
    <div class="doc-vault-item">
      <div class="doc-file-icon"><i class="fa-solid fa-file-pdf text-red"></i></div>
      <div class="doc-file-info">
        <h4 class="doc-file-title">${doc.title}</h4>
        <span class="doc-file-meta">${doc.category} &bull; ${doc.date}</span>
      </div>
      <span class="doc-file-status"><i class="fa-solid fa-shield-check"></i> ${doc.status}</span>
      <button class="btn-icon-action" onclick="viewDocument('${doc.file_name}')"><i class="fa-solid fa-arrow-down-to-line"></i></button>
    </div>
  `;
  container.insertAdjacentHTML('afterbegin', html);
}

function triggerFileUpload() {
  openUploadModal();
}

function viewDocument(filename) {
  showToast(`Accessing verified health document: ${filename}`);
}

/**
 * Emergency SOS Dispatch Trigger
 */
function triggerEmergencySOS() {
  fetch('/api/sos-trigger', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location: 'Hyderabad Coordinates (17.3850° N, 78.4867° E)',
      emergency_contact: '+91 9876543210'
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === 'success') {
      document.getElementById('sos-msg-display-en').textContent = data.message_en;
      document.getElementById('sos-msg-display-te').textContent = data.message_te;
      document.getElementById('modal-sos-dispatch').classList.add('active');
    }
  });
}

function closeSOSModal() {
  document.getElementById('modal-sos-dispatch').classList.remove('active');
}

function openDirections(hospName) {
  window.open(`https://www.google.com/maps/search/${encodeURIComponent(hospName)}`, '_blank');
}

/**
 * Patient Profile & Login Modal
 */
function openLoginModal() {
  document.getElementById('modal-login').classList.add('active');
}

function closeLoginModal() {
  document.getElementById('modal-login').classList.remove('active');
}

function submitLogin() {
  closeLoginModal();
  showToast('Patient Account Verified & Logged In');
}

function saveProfile() {
  const name = document.getElementById('prof-name').value;
  document.getElementById('user-display-name').textContent = name;
  document.getElementById('id-name').textContent = name;
  showToast('Digital Medical Profile & Health Passport Saved');
}

function printHealthID() {
  window.print();
}

/**
 * Notifications Drawer & Toast Helper
 */
function toggleNotifications() {
  const drawer = document.getElementById('notif-drawer');
  drawer.classList.toggle('active');
}

function clearNotifs() {
  document.getElementById('notif-count').style.display = 'none';
  document.querySelector('.notif-list').innerHTML = '<div style="padding:1rem; text-align:center; color:var(--text-dim);">No new notifications</div>';
}

function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('active');
  setTimeout(() => toast.classList.remove('active'), 3200);
}

# JADMAA Varmakalai LMS Platform

An authentic Learning Management System (LMS) and web platform for **JADMAA Varmakalai** (`jadmaa.com`), featuring full course management, Razorpay payment gateway integration, interactive video lessons, Google Meet live classes, progress tracking, timed assessment quizzes, verifiable certificate generation, and Varma therapy consultation booking.

---

## 🎨 Brand Colors & Design System
* **Primary Crimson / Traditional Red**: `#b12b2b` & `#8f2020`
* **Warm Canvas / Sand**: `#faf6f0` & `#f3ece0`
* **Dark Charcoal**: `#2b2521`
* **Muted Body Text**: `#5c5148`
* **Borders / Dividers**: `#e8ddd0`
* **Typography**: **Bricolage Grotesque** (Headings) & **Work Sans** (Body)

---

## 🚀 Key Features

1. **Visitor & Course Exploration**:
   - Home page, About (*Founder Bojagarajan & Aasan R. Rajendran*), Why Choose JADMAA, Courses Showcase, Interactive 108 Vital Points Explorer, Varma Therapy, Branches (*Thanjavur, Kumbakonam, Ariyalur*), Blog, and Careers.
2. **Student Authentication & Verification**:
   - Register, Account Verification / OTP, Student Login + 1-Click Demo Login.
3. **Razorpay Payment Gateway**:
   - Instant checkout modal supporting UPI (GPay/PhonePe), Cards, and NetBanking with order creation & signature verification.
4. **Database & Enrollment Engine**:
   - Reactive store with Firestore schema compatibility and local storage persistence.
5. **Interactive LMS Course Player**:
   - Video lessons with progress tracking and lesson completion checkmarks.
   - **Google Meet Live Classes Integration** & Google Drive recordings archive.
6. **Assessment / Quiz Engine**:
   - Timed multiple-choice questions with 70% passing threshold and instant retakes.
7. **Verifiable Certificate Generator**:
   - Official traditional digital certificate with serial IDs, student credentials, and **PDF download**.
8. **Student LMS Dashboard**:
   - Enrolled courses, progress bars, live meet schedules, and saved certificates.

---

## 🛠️ Tech Stack
* **Framework**: Next.js 14+ (App Router)
* **Styling**: Tailwind CSS
* **Icons**: Lucide React
* **Certificates**: html2canvas + jsPDF
* **Celebration**: Canvas-Confetti

---

## 📦 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/selvaofficial1026-design/jadmaa.git
   cd jadmaa
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

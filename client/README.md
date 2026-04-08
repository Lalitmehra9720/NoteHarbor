# ⚓ NoteHarbor v2

**NoteHarbor** is a high-performance, AI-integrated note-taking ecosystem built with the **MERN Stack**. It’s designed to transform messy thoughts into organized, actionable insights with a focus on modern UI/UX and professional productivity.

---

## 📸 Preview
![NoteHarbor Homepage](https://note-harbor-83hu.vercel.app/screenshot.png) 
> *Note: Replace this link with your actual screenshot path once uploaded to GitHub.*

---

## ✨ Key Features

### 🎨 Modern UI/UX Overhaul
* **Production-Ready Components:** Custom `FeatureGrid`, `StatsSection`, and `CTASection` for a sleek landing experience.
* **Theming:** Seamless **Dark & Light Mode** support.
* **Responsive Design:** Fully optimized for mobile, tablet, and desktop.

### 🧠 Smart Functionality
* **AI Summarization:** Powered by **Gemini AI**, get instant summaries (Short, Detailed, or ELI5) of your long notes.
* **Focus Mode:** Integrated reading time tracker and 5 customizable font styles for a distraction-free experience.
* **Live Search:** High-performance search with real-time text highlighting.

### 🛠️ Full-Stack Robustness
* **MERN Architecture:** Secure Authentication (JWT), MongoDB integration, and optimized API routes.
* **User Support:** Integrated Help Center (direct email/phone) and a live Feedback system.

---

## 🚀 Tech Stack

| Frontend            | Backend        | Database / AI       |
|        :---         |     :---       |         :---        |
| **React 18** (Vite) | **Node.js**    | **MongoDB**         |
| **Tailwind CSS**    | **Express.js** | **Gemini AI API**   |
| **Framer Motion**   | **JWT Auth**   | **Vercel / Render** |

---

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Lalitmehra9720/NoteHarbor.git](https://github.com/Lalitmehra9720/NoteHarbor.git)
Install Dependencies:

Bash
# For Client
cd client && npm install

# For Server
cd server && npm install
Environment Variables:
Create a .env file in the server folder. DO NOT share this file on GitHub. Add the following template:

Code snippet
PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_random_secret_key
Run the App:

Bash
# Start Server
cd server && npm start

# Start Client
cd client && npm run dev
🤝 Connect & Feedback
Your feedback helps me grow! Reach out via:

LinkedIn: Lalit Mehra

Live Site: Explore NoteHarbor
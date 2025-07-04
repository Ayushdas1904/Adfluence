# ADfluence 🎥🤝💼

**Adfluence** is a full-stack platform that connects **brands** with verified **YouTube content creators** for seamless paid collaborations.

Built with **Next.js App Router (frontend & backend)** using **YouTube OAuth**, **MongoDB**, **Stripe**, and **Cloudinary**.

---

## 🔗 Live Demo

🌐 [Live Site](https://t.co/FOk1VueJAU)  
💻 [GitHub Repo](https://github.com/Ayushdas1904/Adfluence)

---

## 🧩 Features

### 🎥 Creators
- Login via **YouTube OAuth (Google)**
- Auto-fetch YouTube channel stats
- Apply for verification
- Chat with brands
- Accept paid offers

### 💼 Brands
- Login/signup with verification (blue tick or license upload)
- Browse creators by niche/stats
- Contact, chat, pay, and schedule collabs

### 🔒 Auth & Verification
- OAuth2 with Google
- Brand license or blue tick verification

### 💬 Collab Tools
- In-app messaging
- **Stripe** for secure payments

### ⚙️ Stack
- **Frontend**: Next.js (App Router), TailwindCSS, Shadcn UI
- **Backend**: Node.js, MongoDB
- **Auth**: Google OAuth (YouTube)
- **Payments**: Stripe
- **Media Uploads**: Cloudinary

---

## 🗂️ Project Structure

```

adfluence/              
├── app/
├── components/
├── lib/
├── hooks/
└── public/             
├── types
├── .env.local           
└── README.md

````

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/adfluence.git
cd adfluence
````

### 2. Install dependencies

```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

### 3. Create `.env` files

#### 📁 `.env.local`

```env
PORT=3000
MONGODB_URI=your_mongo_uri

NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
GOOGLE_CLIENT_SECRET=your_google_client_secret

STRIPE_SECRET_KEY=your_stripe_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

```

```

---

## 🧪 Run Locally

```bash
# Start backend
cd server
npm run dev

# Start frontend
cd ../client
npm run dev
```

---

## 📌 TODO

* [ ] Creator Pro promotion system
* [ ] Admin dashboard for manual verification
* [ ] Advanced search + filter creators
* [ ] Email + notification system
* [ ] Analytics & tracking for deals

---

## 📷 Screenshots

![Screenshot 2025-06-22 at 19-11-47 ADfluence](https://github.com/user-attachments/assets/b464f55c-59f2-44b3-abe2-2f4b73aae98f)
![Screenshot 2025-06-22 at 19-00-32 ADfluence](https://github.com/user-attachments/assets/3dce1951-2e81-499a-8fc3-806fd8667d59)
![Screenshot 2025-06-22 at 19-02-30 ADfluence](https://github.com/user-attachments/assets/dc2c0402-5785-4c8b-82ae-df017ae7d652)
![Screenshot 2025-06-22 at 19-02-40 ADfluence](https://github.com/user-attachments/assets/6954e785-236d-45e3-89da-8916ef28cdc2)
![Screenshot 2025-06-22 at 18-58-53 ADfluence](https://github.com/user-attachments/assets/32041fa7-7ec1-40d2-8fac-4a109b26ea07)
![Screenshot 2025-06-22 at 19-00-55 ADfluence](https://github.com/user-attachments/assets/c84a8a85-da4f-4def-a0fe-bfab94a4762a)

---

## 🤝 Feedback & Contributions

Open to suggestions, feedback, or PRs.
Ping me on [X/Twitter](https://x.com/das_codes) or open an issue.

```

Let me know if you want:
- `CONTRIBUTING.md`  
- `API.md` for backend routes  
- auto-generated OpenAPI docs  
- deployment instructions for **Vercel (frontend)** and **Render/Railway (backend)**  

Just drop the live URL and GitHub repo and I’ll insert them for you.
```

# 🚀 Mini SocialMedia

A real-time social media platform enabling **secure, encrypted communication** with **multi-device support**. Messages are **server-side encrypted** using **RSA + AES**, with AES keys securely managed in **Azure Key Vault**. The platform supports **real-time chat, posts, comments, notifications, and user interactions**.

---

## 🔗 Live Demo & Screenshots
🌐 **Live Demo**: [Frontend (Vercel)](https://social-med.vercel.app/)

### 📸 Profile Image Changing Demo

<p align="center">
  <img src="https://i.ibb.co/JjkNnkGY/ezgif-com-speed.gif" width="100%">
</p>

### 📹 Multi-Device Chatting **(Video Demo)**
[![Watch Video](https://i.imgur.com/NwPrhHP.png)](https://i.imgur.com/NwPrhHP.mp4)

### 📹 Real-Time Friend Request (Send/Cancel/Accept) **(Video Demo)**
[![Watch Video](https://i.imgur.com/yRUYgxT.png)](https://i.imgur.com/yRUYgxT.mp4)

### 📹 Real-Time Posting & Commenting **(Video Demo)**
[![Watch Video](https://i.imgur.com/DVDSxGt.png)](https://i.imgur.com/DVDSxGt.mp4)

---

## 🛠 Tech Stack

- **Backend**: C#, ASP.NET, SQL Server  
- **Frontend**: Next.js, TypeScript, Zustand (for global state)  
- **Real-Time Communication**: SignalR  
- **Storage**: Azure Blob Storage  
- **Security**: RSA + AES encryption, Azure Key Vault
- **Hosting**: Vercel (Frontend), Azure (Backend)  
- **CI/CD**: GitHub Actions (Auto-Deploy on Push) 

---

## ✨ Key Features

### ✅ **Implemented**
- 🔒 **Encrypted Messaging**: Messages are encrypted on the server using **RSA + AES** (AES keys stored securely in **Azure Key Vault**).  
- 🔐 **Authentication**: Secure login system using **ASP.NET Identity**.  
- ⚡ **Real-Time Messaging**: Messages update instantly with **unread message tracking** across multiple devices.  
- 🔄 **Real-Time Post & Comment Updates**: Posts, comments, and interactions sync in real time using **SignalR**.  
- 📩 **Multi-Device Support**:
  - Users can be logged in on **multiple devices simultaneously**.
  - **Read messages update in real time** across devices.
  - Posts, comments, **friend requests (accept/reject/cancel), and notifications** sync seamlessly across devices.  
- 🔍 **User Search**: Find people easily.  
- 📸 **Profile Management**: Update profile pictures (stored in **Azure Blob Storage**).  
- ❤️ **Post Interaction**: Like/unlike posts and see **who liked them**.  
- 👥 **Friend System**: Send, accept, reject, and cancel friend requests **with real-time updates**.  
- 🛎 **Notifications**: Receive **real-time notifications** for friend requests.  
- 📜 **Infinite Scrolling**: Dynamically load messages for performance.  


### 🚧 **In Development**
- 🌐 **Host frontend and backend on the same root domain for Safari compatibility.**  

---

## 🚀 Deployment & CI/CD

### 🌍 **Hosting**
- **Frontend**: Hosted on **Vercel**.  
- **Backend**: Deployed on **Azure**.  

### ⚙️ **Continuous Deployment (CI/CD)**
- **GitHub Actions** automates deployments whenever changes are pushed to the repository.  
- **Frontend** auto-deploys to **Vercel**.  
- **Backend** auto-deploys to **Azure App Service**.  


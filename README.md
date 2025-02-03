# 🚀 Mini SocialMedia

A real-time social media platform enabling **secure, encrypted communication** with **multi-device support**. Messages are **server-side encrypted** using **RSA + AES**, with AES keys securely managed in **Azure Key Vault**. The platform supports **real-time chat, posts, comments, notifications, and user interactions**.

---

## 🔗 Live Demo & Screenshots
🌐 **Live Demo**: [Frontend (Vercel)](https://social-med.vercel.app/)

> ⚠️ **Note:**  
>- This project is **optimized for desktop screens** and may not display correctly on mobile devices. If viewing on a smaller screen, consider adjusting the browser zoom for the best experience.
>- 🚨 **Currently, the site does not work on Safari due to cross-origin issues.** A fix may be considered in the future.

### 📸 Profile Image Changing **(Video Demo)**
[![Watch Video](https://i.imgur.com/0tGAqVY.png)](https://i.imgur.com/0tGAqVY.mp4)

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
  - Messages are encrypted using **AES** for efficiency, especially for long messages.  
  - The **AES key is encrypted** using the **receiver's public RSA key** and stored alongside the encrypted message in the database, separated by a `:` delimiter.  
  - The user's **RSA private key is encrypted** using AES for security.  
  - The **AES key for private key encryption** is stored securely in **Azure Key Vault**, while the **encrypted RSA private key** is saved in the database.
  - **During login, the user's RSA private key is decrypted and stored in cache memory** for efficient access.
- 🔐 **Authentication**: Secure login system using **ASP.NET Identity**.  
- ⚡ **Real-Time Messaging**: Messages update instantly with **unread message tracking** across multiple devices.
  - **Smart Auto-Scrolling**: 
    - If the user is at the **bottom of the chat**, new messages automatically scroll into view.  
    - If the user is **not at the bottom**, the chat does **not force-scroll**, preventing interruptions. 
- 🔄 **Real-Time Post & Comment Updates**: Posts, comments, and interactions sync in real time using **SignalR**.  
- 📩 **Multi-Device Support**:
  - Users can be logged in on **multiple devices simultaneously**.
  - **Read messages update in real time** across devices.
  - Posts, comments, **friend requests (accept/reject/cancel), and notifications** sync seamlessly across devices.
  - **Session Tracking with Cache memory (In-App Memory)**:
    - Each logged-in session is stored using **cache-based tracking** (UserID + SessionID).  
    - When a user receives a message, **all active devices are notified** in real-time.  
- 🔍 **User Search**: Find people easily.  
- 📸 **Profile Management**: Update profile pictures (stored in **Azure Blob Storage**).
  - **Image cropping and editing** is handled using **React-Cropper**. 
- ❤️ **Post Interaction**: Like/unlike posts and see **who liked them**.  
- 👥 **Friend System**: Send, accept, reject, and cancel friend requests **with real-time updates**.  
- 🛎 **Notifications**: Receive **real-time notifications** for friend requests.  
- 📜 **Infinite Scrolling**: Loads messages dynamically for better performance, fetching **10 messages per request**.


### 🚧 **Potential Future Improvements**
> **Note:** While there are no immediate plans for further development, these are possible enhancements that may be considered in the future.

- 🌐 **Host frontend and backend on the same root domain for Safari compatibility.**  
- 📈 **Optimize database queries for large-scale data** (indexing, caching strategies).  
- 📱 **Improve mobile responsiveness for better cross-device usability.**  
- 🛠️ **Implement unit and integration tests to ensure code reliability.**

---

## 🚀 Deployment & CI/CD

### 🌍 **Hosting**
- **Frontend**: Hosted on **Vercel**.  
- **Backend**: Deployed on **Azure**.  

### ⚙️ **Continuous Deployment (CI/CD)**
- **GitHub Actions** automates deployments whenever changes are pushed to the repository.  
- **Frontend** auto-deploys to **Vercel**.  
- **Backend** auto-deploys to **Azure App Service**.  


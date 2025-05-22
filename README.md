# 🏕️ Camploops

**Camploops** is a full-stack web application where users can explore, review, and share their favorite campgrounds. With user authentication, rich CRUD functionality, interactive maps, and image uploads, it's a complete campground directory built using modern Node.js architecture.

---

## 📸 Features

- 🔐 User Authentication with Passport.js
- 🏕️ Full CRUD for Campgrounds (Create, Read, Update, Delete)
- ✍️ Reviews system (Users can add/delete their own reviews)
- 📌 Map integration for each campground using Mapbox
- 📷 Image uploads with Cloudinary
- 🌐 RESTful Routes & Middleware pattern
- 🚨 Flash messages and error handling

---

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: EJS templating engine
- **Database**: MongoDB (via Mongoose)
- **Authentication**: Passport.js
- **Maps**: Mapbox
- **Image Storage**: Cloudinary
- **Utilities**: express-session, connect-flash, method-override, Joi validation, dotenv

---

## 📁 Project Structure

```
Camploop/
├── app.js                 # Main application file
├── middleware.js          # Custom middleware
├── cloudinary/            # Cloudinary configuration
├── utils/                 # Error handlers & async wrapper
├── Models/                # Mongoose models (User, Review, Campground)
├── Routes/                # All express routes
├── Controllers/           # Logic for routes separated from routing
├── views/                 # EJS views with layouts and partials
├── public/                # Static assets: CSS, JS, favicon
├── seeds/                 # Seeding script for sample data
├── Validations/           # Joi schemas
├── package.json           # Project dependencies
├── .env                   # Environment variables (not committed)
```

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/CHIRAG-GUPTA-987/Camploop.git
cd Camploop
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Environment Variables

Create a `.env` file in the root directory with the following:

```env
DB_URL=your_mongo_db_connection_string
SECRET=your_session_secret
PORT=3000
MAPBOX_TOKEN=your_mapbox_token
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret
```

### 4. Seed the Database (Optional)

```bash
node seeds/index.js
```

### 5. Run the Application

```bash
npm start
# OR
node app.js
# OR (if you use nodemon)
nodemon app.js
```

---

## 🌍 Routes Overview

### Authentication

- `GET /login` – Login form
- `POST /login` – Login user
- `GET /register` – Registration form
- `POST /register` – Register user
- `GET /logout` – Logout

### Campgrounds

- `GET /campground` – List all campgrounds
- `GET /campground/new` – New campground form
- `POST /campground/new` – Create campground
- `GET /campground/:id` – Show specific campground
- `GET /campground/:id/edit` – Edit form
- `POST /campground/:id/edit` – Update campground
- `DELETE /campground/:id/delete` – Delete campground

### Reviews

- `POST /campground/:id/review/` – Create review
- `DELETE /campground/:id/review/:reviewID` – Delete review
- `GET /campground/:id/review/` – Redirects to campground page

---

## 💻 Scripts

```bash
npm start         # Run the app
node app.js       # Run manually
nodemon app.js    # Run with auto-reload (requires nodemon)
```

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙋‍♂️ Author

-Built with ❤️ by Chirag Gupta
-GitHub: https://github.com/CHIRAG-GUPTA-987/Camploop
-LinkedIn: https://www.linkedin.com/in/chirag-gupta-51829a203/

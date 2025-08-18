# 🌍 Wanderlust – Travel & Stay Booking Platform

## 1. Project Overview

Wanderlust is an online platform that allows users to find, book, and review unique places to stay around the world. It is a clone of a website like Airbnb. Users can list new accommodations, view existing ones, and leave reviews based on their experiences.

✨**Key Features:**

* ✅ **User Authentication:** Secure sign-up, login, and logout functionality for users.
* ✅ **CRUD for Listings:** Authenticated users can create, read, update, and delete (CRUD) their accommodation listings.
* ✅ **Review System:** Users can post reviews with ratings and comments for listings and have the ability to delete their own reviews.
* ✅ **Map Integration:** Each listing displays its precise location on an interactive map.
* ✅ **Cloud Image Uploads:** All listing images are uploaded and managed on a cloud-based storage service.
* ✅ **Search Functionality:** Users can easily search for listings by their location.

---

## 2. 🚀 Tech Stack

### 🌐 Frontend  
<p>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original.svg" width="40"/>  
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg" width="40"/>  
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" width="40"/>  
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/bootstrap/bootstrap-original.svg" width="40"/>  
  <img src="https://upload.wikimedia.org/wikipedia/commons/8/85/Ejs_logo.png" width="40"/> 
</p>

### ⚙️ Backend  
<p>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg" width="40"/>  
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original.svg" width="40"/>  
</p>

### 🗄 Database  
<p>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original.svg" width="40"/>  
</p>

### ☁️ Cloud & Maps  
<p>
  <img src="https://cdn.worldvectorlogo.com/logos/cloudinary-2.svg" width="90"/>  
  <img src="https://avatars.githubusercontent.com/u/600935?s=200&v=4" width="40"/> Mapbox  
</p>


* **Backend:** Node.js, Express.js.
* **Database:** MongoDB (with Mongoose).
* **View Engine:** EJS (Embedded JavaScript), with EJS-Mate for templating layouts.
* **Authentication:** Passport.js (using the Local Strategy).
* **Image Handling:** Cloudinary (for storage), Multer (for uploads).
* **Maps:** Mapbox Api.
* **CSS Framework:** Bootstrap.
* **Schema Validation:** Joi for robust server-side data validation.
* **Others:** `connect-flash` (for flash messages), `express-session` (for session management), `method-override` (for HTTP method overriding), `Joi` (for server-side schema validation).

---

## 3. 📂 Folder Structure  

```
WanderLust-original/
├── app.js                # Main application file
├── cloudConfig.js        # Cloudinary configuration
├── middleware.js         # Custom middlewares
├── package.json          # Project dependencies and scripts
├── schema.js             # Server-side schema validation with Joi
├── .env                  # Environment variables (API keys, database URL)
│
├── controllers/          # Business logic for routes
│   ├── listing.js
│   ├── reviews.js
│   └── users.js
│
├── models/               # Mongoose database schemas
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── public/               # Static Assets
│   ├── css/
│   │   ├── rating.css
│   │   └── style.css
│   └── javascript/
│       ├── map.js
│       └── script.js
│
├── routes/               # Express route handlers
│   ├── listings.js
│   ├── reviews.js
│   └── user.js
│
├── utils/                # Utility Functions
│   ├── ExpressError.js
│   └── wrapAsync.js
│
└── views/                # EJS Templates (UI)
    ├── about.ejs
    ├── error.ejs
    ├── privacy.ejs
    ├── terms.ejs
    ├── includes/
    │   ├── flash.ejs
    │   ├── footer.ejs
    │   └── navbar.ejs
    ├── layouts/
    │   └── boilerplate.ejs
    ├── listings/
    │   ├── edit.ejs
    │   ├── index.ejs
    │   ├── new.ejs
    │   └── show.ejs
    └── users/
        ├── login.ejs
        └── signup.ejs
```

---

## 4. 🛠️ Installation and Setup

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/kumarshobhit-1/WanderLust-Major-Project.git
    cd WanderLust-original
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Setup Environment Variables:**
    Create a file named `.env` in the `WanderLust-original` directory and add the following variables. Use your own keys and secrets:
    ```env
    CLOUD_NAME=<your_cloudinary_cloud_name>
    CLOUD_API_KEY=<your_cloudinary_api_key>
    CLOUD_API_SECRET=<your_cloudinary_api_secret>
    MAP_TOKEN=<your_mapbox_token>
    ATLASDB_URL=<your_mongodb_atlas_connection_string>
    SECRET=<your_session_secret_key>
    ```
4.  **Run the Application:**
    ```bash
    node app.js
    ```
5.  Navigate to `http://localhost:8080/listings` in your browser.

---

## 5. 🗄 Database Schema

### a. `listing.js`

This schema represents an individual accommodation listing.

* `title` (String, Required): The title of the listing.
* `description` (String): A detailed description of the listing.
* `image` (Object): Stores the image URL and filename from Cloudinary.
    * `url` (String)
    * `filename` (String)
* `price` (Number): The price of the listing per night.
* `location` (String): The location of the listing (e.g., city, state).
* `country` (String): The country of the listing.
* `reviews` (Array of ObjectId): A reference to all reviews associated with this listing.
* `owner` (ObjectId): A reference to the user who created the listing.
* `geometry` (Object): Stores geocoding data for Mapbox.
    * `type` (String, must be 'Point')
    * `coordinates` (Array of Number, [longitude, latitude])

**Middleware:**

* `post("findOneAndDelete")`: When a listing is deleted, all associated reviews are also deleted from the database.

### b. `user.js`

This schema represents a user.

* `email` (String, Required): The user's email.
* `passport-local-mongoose` plugin: This automatically adds `username`, `hash` (for password hashing and salting), and `salt` fields. It also provides several useful methods for user authentication.

### c. `review.js`

This schema represents a review.

* `comment` (String): The text comment given by the user.
* `rating` (Number): A rating between 1 and 5.
* `createdAt` (Date): The date the review was created (defaults to the current date).
* `author` (ObjectId): A reference to the user who wrote the review.

---

## 6. 📡 API Endpoints (Routes)

### a. Listing Routes (`routes/listings.js`)

* **`GET /listings`**: Displays all listings (the main page).
* **`GET /listings/new`**: Shows a form to create a new listing.
* **`POST /listings`**: Creates a new listing.
* **`GET /listings/:id`**: Shows a detailed view of a specific listing.
* **`GET /listings/:id/edit`**: Shows a form to edit a specific listing.
* **`PUT /listings/:id`**: Updates a specific listing.
* **`DELETE /listings/:id`**: Deletes a specific listing.
* **`GET /listings/search`**: Searches for listings based on location.

### b. Review Routes (`routes/reviews.js`)

These routes are nested under `/listings/:id/reviews`.

* **`POST /`**: Creates a new review for a specific listing.
* **`DELETE /:reviewId`**: Deletes a specific review.

### c. User Routes (`routes/user.js`)

* **`GET /signup`**: Shows the user registration form.
* **`POST /signup`**: Registers a new user.
* **`GET /login`**: Shows the user login form.
* **`POST /login`**: Authenticates and logs in a user.
* **`GET /logout`**: Logs out a user.

---

## 7. 🌐 Frontend (Views)

* **`boilerplate.ejs`**: This is the main layout file. It includes the header, footer, and necessary CSS/JS links. All other pages are rendered within this layout.
* **`includes/`**: Contains reusable UI components like the `navbar`, `footer`, and `flash` messages.
* **`listings/`**: Contains all views related to listings:
    * `index.ejs`: A grid view of all listings.
    * `show.ejs`: The detail page for a single listing, including its description, reviews, and a map.
    * `new.ejs` & `edit.ejs`: Forms for creating and editing listings.
* **`users/`**: Forms for user authentication (`login.ejs` and `signup.ejs`).

---

## 8. 🧩 Middleware

The `middleware.js` file contains custom middleware functions used throughout the application:

* **`isLoggedIn`**: Checks if a user is logged in. This protects routes that require authentication.
* **`saveRedirectUrl`**: Saves the original requested URL to redirect the user back to it after logging in.
* **`isOwner`**: Checks if the currently logged-in user is the owner of the listing. This ensures that only owners can edit or delete listings.
* **`isReviewAuthor`**: Checks if the current user is the author of a review, allowing only the author to delete it.
* **`validateListings` / `validateReview`**: Validates incoming data from `req.body` using Joi schemas to prevent incorrect or incomplete submissions.

---

## 9. ☁️ Deployment & Cloud Services

This project is built and deployed on a modern, cloud-based infrastructure to ensure scalability and efficiency:

* **Hosting:** The application is hosted on **Render.com**, which provides continuous deployment from a Git repository and simplifies infrastructure management.
* **Database:** The database is hosted on **MongoDB Atlas**, a fully-managed, scalable cloud database service.
* **Image Storage:** All listing images are stored and served through **Cloudinary**. This allows for powerful image optimization, transformation, and fast delivery via a CDN.
* **Maps API:** Interactive map functionality is implemented using the **Mapbox API**, which provides geolocation data and renders the maps for each listing.

---

## 10. 🤝 Contributing

Contributions are always welcome!

Fork the repo

Create a new branch (feature-branch)

Commit your changes

Push to the branch

Open a Pull Request

---

## 11. 🎯 Future Enhancements

This section outlines a roadmap for future features and improvements to elevate the application.

#### a. Planned Features

* **Payment Gateway Integration:**
    * Integrate a payment gateway such as **Stripe** or **Razorpay** to allow users to book and pay directly through the platform. This will automate the booking process and turn it into a fully functional commercial application.

#### b. Improvement 

* **User Profiles:** Create dedicated user profile pages where users can view and edit their information, upload a profile picture, and see a history of their listings and reviews.
* **Booking System:** Implement a calendar-based booking system where guests can select dates, and hosts can accept or decline booking requests.
* **Real-time Chat:** Add a real-time messaging feature using **Socket.IO** to facilitate communication between hosts and guests.
* **Advanced Search & Filters:** Enhance the search functionality by adding filters for price range, amenities (e.g., Wi-Fi, pool), and listing type (e.g., apartment, house).
* **Admin Panel:** Develop an admin dashboard to manage users, listings, and reviews, as well as to view site analytics.
* **Social Login:** Allow users to sign up and log in using third-party providers like Google, Facebook, or GitHub for a seamless authentication experience.
* **Email Notifications:** Use a service like **Nodemailer** to send automated email notifications for booking confirmations, new reviews, and other important events.

---

## 12. 📜 License

This project is licensed under the Apache License.See the [LICENSE](LICENSE.md) file for details.

---

## 13. 🎯 Conclusion

Wanderlust is a scalable, production-ready Airbnb-like platform built with Node.js, Express, MongoDB, and modern cloud services. Its modular architecture, integration with third-party APIs, and extensibility make it an excellent foundation for real-world booking systems.

---

## 👨‍💻 Author

Shobhit Kumar 
📧 Email: shobhitkumar1437@gmail.com
🔗 GitHub: [Shobhit Kumar](https://github.com/kumarshobhit-1/).
🔗 LinkedIn: [Shobhit Kumar](https://www.linkedin.com/in/shobhit-kumar1/).

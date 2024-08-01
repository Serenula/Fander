# Fander

**Fander** is a web app that aims to catalogue Cai Fan/Png stalls island wide. The app allow users to discover, rate and reivew stalls and also, submit stalls to the app too! Find all the amazing cai fan near you using Fander today!

**Landing Page**
![Landing Page](/frontend/image/fander_landing.png)

<details>
<summary>Technologies Used</summary>

- **Frontend**

  - HTML
  - CSS
  - JavaScript
  - [htmx](https://htmx.org/) (for handling AJAX requests)

- **Backend**

  - Node.js
  - Express.js

- **Database**

  - MongoDB with Mongoose

- **Authenitcation**

  - JWT
  - Bcrypt

- **API**
  - Google Maps API for geolocation creation
</details>
<details>
<summary>Planning</summary>

**Wireframes**
<p align="center">
  <img src="/frontend/image/Webapp_landing.png" alt="Landing Page" width="20%"/>
   <img src="/frontend/image/Webapp_user_page.png" alt="User Page" width="20%"/>
   <img src="/frontend/image/Webapp_Stalls.png" alt="Stalls Page" width="20%"/>
   <img src="/frontend/image/detailview.png" alt="Detailed View of Stall" width="20%"/>
</p>

**Planning Board**
[Public Board](https://github.com/users/Serenula/projects/2).
</details>

<details>
<summary>Getting Started</summary>

### Prerequisites

**Backend setup**

- Node.js and npm installed on your machine.
- MongoDB installed or accessible online.
- Google Maps API Key for geolocation features.
- Multer, GridFs and Mongoose for image storing and retrival with MongoDB

**.env**
DATABASE: MongoDB URL
GOOGLE_MAPS_API_KEY: Google maps api key
ACCESS TOKEN
REFRESH TOKEN

**Frontend setup**

- HTMX
  - npm install htmx.org --save
 
</details>

<details>
<summary>Technical Info</summary>

### App Overview

- Mongoose, Express, HTMX, the legendary MEH stack

## API Endpoints

This section provides an overview of the available API endpoints in the Fander application, categorized into Frontend and Backend.

### Frontend API Endpoints

#### Authentication

1. **POST** `/auth/userregister` - Register a new user
2. **POST** `/auth/login` - Log in a user
3. **POST** `/auth/logout` - Log out the current user

#### Users

4. **GET** `/api/users/profile` - Retrieve user profile
5. **PUT** `/api/users/profile` - Update user profile

#### Stalls

6. **GET** `/api/stalls` - Retrieve all stalls
7. **GET** `/api/stalls/:id` - Retrieve a specific stall
8. **GET** `/api/stalls/search` - Search stalls by name
9. **GET** `/api/stalls/nearby?lat={lat}&lng={lng}&distance={distance}` - Retrieve stalls nearby

#### Reviews

10. **GET** `/api/reviews/:stallId` - Retrieve all reviews for a stall
11. **POST** `/api/reviews/create` - Create a new review
12. **POST** `/api/reviews/:reviewId/interact` - Like or dislike a review
13. **POST** `/api/reviews/:reviewId/reply` - Reply to a review

### Backend API Endpoints

#### Users Management

14. **GET** `/api/admins/users` - Retrieve all users (Admin access)
15. **DELETE** `/api/admins/users/:id` - Delete a user (Admin access)

#### Stalls Management

16. **POST** `/api/stalls/create` - Create a new stall (Admin access)
17. **PUT** `/api/stalls/:id` - Update a stall (Admin access)
18. **DELETE** `/api/stalls/:id` - Delete a stall (Admin access)

#### Admin

19. **POST** `/api/admins/createAdmin` - Create a new admin (SuperAdmin access)
20. **PUT** `/api/admins/users/:id/role` - Change user role (SuperAdmin access)

#### File Upload

21. **POST** `/api/uploads` - Upload files using Multer and GridFS
</details>

<details>
<summary>Authentication</summary>

### Backend Auths

- auth.js : Handles generic user authentication, giving the generic ability to register and login and accessing all non-admin pages
- adminAuth.js: Handles admin level authenication, giving the CRUD access to functions like delete stalls
- superAdminAuth.js: Handles super admin level authentication, giving the CRUD access to the Create Admin function.

### Frontend Auths

**URL Access**

- The following code snippet checks for user authentication and fetches pages upon page load, redirecting unauthorised users to the login page.

```html
document.addEventListener("DOMContentLoaded", () => { const user =
JSON.parse(localStorage.getItem("user")); if (!user || !user.accessToken) {
window.location.href = "../../html/auth/login.html"; } else { fetchStalls(); //
Fetch stalls on page load } });
```

**Admin Navigation**

- The following code snippet checks for superAdmin role and displays Admin button on the navbar

```html
document.addEventListener("DOMContentLoaded", () => { const user =
JSON.parse(localStorage.getItem("user")); function updateNavbar() { const
navbarContainer = document.getElementById("navbar"); if (navbarContainer) {
const navUserNavContainer = navbarContainer.querySelector( "#user-nav-container"
if (user.role === "superAdmin") { console.log("User is superAdmin");
userNavContent += `
<li><a href="../../html/administration/admin.html">Admin</a></li>
`; }
```

### Types of Login

- User : Access to
  - stalls.html, stallsDetails.html, user.html,
- Admin : Access to
  - All User access
  - admin.html with the function of Create Stall, Delete Stall
- Super Admin: Access to
  - All the above
  - Special function to Create Admin
</details>

<details>
<summary>My Experience</summary>

**HTMX (CORS and CSP)**

- When using HTMX, it is important to ensure that your Cross-Origin Resource Sharing (CORS) and Content Security Policy (CSP) are written properly to ensure proper communication between front and back servers
- Then I realized that, by having both frontend and backend in the same folder instead of seperated, I would have saved myself a lot of time because HTMX requests should be at the same level as server.js to avoid CORS issues. If they are on different levels or domains, you must use the full URL for your AJAX requests.
- Here is my stupid CORS and CSP

```
const corsOptions = {
  origin: ["http://127.0.0.1:8080", "http://localhost:8080"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "hx-request",
    "hx-target",
    "hx-trigger",
    "hx-include",
    "hx-prompt",
    "hx-headers",
    "hx-sync",
    "hx-boosted",
    "hx-current-url",
    "x-refresh-token",
  ],
  credentials: true,
};
```

```
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
      baseUri: ["'self'"],
      fontSrc: ["'self'", "https:", "data:"],
      formAction: ["'self'"],
      frameAncestors: ["'self'"],
      imgSrc: ["'self'", "data:", "http://127.0.0.1:5001"],
      scriptSrcAttr: ["'none'"],
      styleSrc: ["'self'", "https:", "'unsafe-inline'"],
    },
  })
);
```

**Google Map API Loading**

- You may find this stupid error when you work with Google Maps API
  [Loading/Async](/frontend/image/gmap_api_loading_async.png)
- The answer to this POS error is not clear online but I found it thanks here (https://github.com/Tintef/react-google-places-autocomplete/issues/342#issuecomment-1937104294)

**GridFs, Multer and Mongoose**

- Apparently, Multer with Gridfs is no longer being managed and therefore have dependency issues
- Multer now is at multer@"^1.4.5-lts.1 and theres some bug about it when working with Mongoose at the latest verion
- The work around which took me 2 days to find is as follows
  - Install mongodb version 5.9.1
  - Install multer version 1.4.2
  - or npm i multer-gridfs-storage --legacy-peer-deps (But I do not understand this enough)
</details>

<details>
<summary>Next Steps</summary>

- I do plan to make publish this app and allow the public to use it and truly create a database of all Cai Fan stalls in Singapore
- I plan to work with more seasoned developers to help me add in modern features such as
  - Google sign up and login
  - Google review connection
- Other things to work on will be obviously making things prettier
- Perhaps my code is stupid too but thats about it.
  </details>

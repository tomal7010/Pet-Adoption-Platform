# 🐾 Pet Adoption Platform 

## 🌐 Live Site
https://my-assignment12-74e49.web.app/

##  Project Overview
The Pet Adoption Platform is a fully responsive web application that connects pet lovers with pets in need of a home. This platform allows users to add pets for adoption, view and donate to donation campaigns, and adopt pets directly from the platform. Admins can moderate all user activities and control the system.

---

##  Key Features

###  Public Pages
- Homepage with banner, categories, and call-to-action
- Pet Listing with Infinite Scrolling
- Pet Details + Adoption Modal
- Donation Campaigns Page + Infinite Scroll
- Donation Details with Stripe Payment
- Recommended Campaigns after Donation

###  Authentication
- Email/password login & register
- Google & GitHub login
- Firebase `updateProfile` to store name and image
- JWT-based token system
- Role-based access (admin/user)

###  Dashboard - User
- Add a Pet (Formik + Image Upload via imgbb)
- My Added Pets (TanStack Table + Pagination + Adopt/Delete/Update)
- Adoption Requests
- Create Donation Campaign
- My Donation Campaigns (Edit, Pause, View Donors)
- My Donations (Refund Option)

###  Dashboard - Admin
- Manage All Users (Make Admin)
- Manage All Pets
- Manage All Donation Campaigns

---

##  Tech Stack & Libraries

- React.js + Vite
- Tailwind CSS + DaisyUI / ShadCN
- React Router DOM
- Firebase Auth
- Axios & Custom Secure Axios Hook
- TanStack React Query
- TanStack Table
- SweetAlert2
- Stripe React
- React Hook Form / Formik + Yup
- React Hot Toast
- imgbb API (image upload)
- React Icons
- React Loading Skeleton


---

##  Responsiveness
The site is fully responsive on all screen sizes: mobile, tablet, and desktop.

---

##  Security
- Environment variables used for Firebase and MongoDB
- JWT Token stored securely in localStorage
- Protected Routes and Role-based Redirects

---

##  Inspiration & Purpose
This project was built to fulfill the requirements of the `assignment12_category_006` with the mission of helping animals find loving homes through a user-friendly web solution.


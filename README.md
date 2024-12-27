# Travelynk Frontend

This repository contains the frontend codebase for Team 6's final project, **Travelynk**, a flight booking website. The frontend is built with **React** and modern tools like **Vite**, following best practices in component-driven architecture and state management to ensure a clean and scalable codebase.

## Features List

- Authentication
- Profile Management
- Flight Search
- Seat Selection
- Booking Management
- Voucher Application
- Payment Integration
- Notifications
- Country/City/Airport/Terminal Data
- Airline Schedules

---

## Setup Instructions

To use the frontend, ensure you have the source code and Node.js installed. Follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/travelynk/final-project-frontend.git
2. Navigate to the project directory:
    ```bash
    cd final-project-frontend
3. Install dependencies:
    ```bash
    npm install
4. Start the development server:
    ```bash
    npm run dev
    
## Project Structure
The project is organized as follows:
   ```
   final-project-frontend
    ├───public  
    │   ├───images                    # Public image assets
    │   └───svg                       # Public icon assets
    └───src 
        ├───components                # Reusable components
        │   ├───auth                  # Authentication related components
        │   ├───Countdown             # Countdown timer components
        │   ├───Darkmode              # Dark mode toggle components
        │   ├───Navbar                # Navbar components
        │   ├───ui                    # General UI components
        │   └───utils                 # Utility components
        ├───hooks                     # Custom React hooks
        ├───lib                       # Application-wide constants and utilities
        ├───pages                     # Pages for routing
        ├───redux                     # Redux slices and store configuration
        │   └───slices                # Redux state management slices
        ├───routes                    # Routing configuration using TanStack Router
        │   ├───auth                  # Authentication related routes
        │   │   ├───login             # Login page
        │   │   ├───register          # Registration page
        │   │   ├───reset-password    # Reset password page
        │   │   ├───send-reset-password # Send reset password page
        │   │   └───verify-otp        # Verify OTP page
        │   ├───flights               # Flight-related routes
        │   │   └───booking           # Booking flight page
        │   ├───notification          # Notification routes
        │   ├───payment               # Payment routes
        │   ├───success               # Success page
        │   ├───ticket-history        # Ticket history page
        │   └───user                  # User related routes
        │   │   └───account           # User account pages
        │   │   │   └───settings      # Account settings page
        ├───services                  # API services for fetching data
        │   ├───airlines              # Airlines data service
        │   ├───airports              # Airports data service
        │   ├───auth                  # Authentication service
        │   ├───bookings              # Bookings data service
        │   ├───cities                # Cities data service
        │   ├───country               # Country data service
        │   ├───flights               # Flights data service
        │   ├───notifications         # Notifications data service
        │   ├───payment               # Payment service
        │   ├───seat                  # Seat selection service
        │   └───vouchers              # Voucher data service
        └───utils                     # Utility functions and helpers
```
## Deployment
The frontend is deployed on Vercel for fast and reliable hosting.

## Steps to Deploy:
1. Connect the GitHub repository to your Vercel account.
2. Set the project as a Vite app.
3. Deploy the project.


## Link to Travelynk Website
https://travelynk.vercel.app/



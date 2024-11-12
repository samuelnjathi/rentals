# Rental Management System - README
This is a Rental Management System built to help property managers and landlords manage their rental properties, tenants, leases, and payments efficiently. The system provides an easy-to-use interface, allowing users to view, add, update, and delete information as needed.

## Technologies Used
Frontend: Bootstrap - Provides responsive UI elements for an intuitive user experience.
Backend: Node.js and Express.js - Provides server functionality and routing capabilities.
Database: PostgreSQL - Stores and manages data related to properties, tenants, leases, and payments.
## Installation
To set up the Rental Management System on your local environment, follow these steps:

1. Clone the repository (if applicable) or download the project files.

2. Install dependencies:

Open a terminal and navigate to the project directory.
Run the following command:

```npm install ```

This command installs the necessary dependencies, including Express.js.
3. Set up the PostgreSQL database:

Ensure PostgreSQL is installed and running on your machine.
Create a database named (e.g., rental_management).
Run the database migration scripts (if provided) to create the necessary tables.
Update the database connection details in the .env file (or config file) with your database credentials.
4. Start the server:

In the project directory, run the following command:

```npm start ```
The server should now be running on localhost:3000.
Usage
Access the application: Open a web browser and navigate to http://localhost:3000.

## Functionality:

Manage Properties: Add, view, edit, and delete property listings.
Manage Tenants: Store tenant information and associate them with properties.
Leases: Track lease details, including start and end dates and rental rates.
Payments: Record and manage rental payments, including due dates and payment status.
## Folder Structure
/public - Contains static files such as CSS, JavaScript, and images.
/routes - Defines routes for different parts of the application (e.g., properties, tenants).
/views - Includes HTML templates styled with Bootstrap for the user interface.
# Clinic Management System Server

Backend server for the **Dr. Hani Kafaween Clinic Management System**.

The server provides REST API endpoints for patients, appointments, medical records, authentication, and user profiles. It is built with **Node.js**, **Express**, and **PostgreSQL**.

## Technologies Used

- Node.js
- Express.js
- PostgreSQL
- `pg`
- Axios-compatible REST API
- bcrypt
- CORS
- dotenv
- Nodemon

## Main Features

- Patient registration and management
- User login with hashed passwords
- Doctor, receptionist, and patient profile support
- Appointment booking, editing, cancellation, and date-based lookup
- Medical record creation and retrieval
- PostgreSQL database connection using environment variables
- CORS middleware for frontend/backend communication
- JSON request parsing with Express middleware

## Project Structure

```text
Final-Project-Server/
├── routes/
│   ├── AppointmentRoutes.js
│   ├── AuthRoutes.js
│   ├── MedicalRecordRoutes.js
│   ├── PatientRoutes.js
│   └── ProfileRoutes.js
├── .env
├── .env.sample
├── .gitignore
├── db.js
├── package.json
├── package-lock.json
└── server.js
```

## Environment Variables

Create a `.env` file in the root of the backend project.

You can use `.env.sample` as a reference:

```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
```

Replace the PostgreSQL username, password, and database name with your own values.

The real `.env` file is ignored by Git and should not be committed.

## Installation

Clone the repository:

```bash
git clone https://github.com/MohammadKafaween2005/Clinic-Management-System-Server.git
```

Enter the project directory:

```bash
cd Clinic-Management-System-Server
```

Install the dependencies:

```bash
npm install
```

Make sure PostgreSQL is running and your database has been created.

Then create your `.env` file and add the required environment variables.

## Running the Server

Run normally with Node:

```bash
node server.js
```

Or during development with Nodemon:

```bash
npx nodemon server.js
```

By default, the API can run on:

```text
http://localhost:5000
```

Opening the root route should return a message confirming that the clinic API is running.

## API Endpoints

### Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/login` | Log in a user |
| POST | `/api/auth/register` | Register a new patient account |

### Patients

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/patients` | Get all patients |
| GET | `/api/patients/:id` | Get one patient |
| POST | `/api/patients` | Create a patient |
| PUT | `/api/patients/:id` | Update a patient |
| DELETE | `/api/patients/:id` | Delete a patient |

### Appointments

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/appointments` | Get all appointments |
| GET | `/api/appointments/:id` | Get one appointment |
| GET | `/api/appointments/patient/:id` | Get appointments for a patient |
| GET | `/api/appointments/date/:date` | Get appointments for a selected date |
| POST | `/api/appointments` | Create an appointment |
| PUT | `/api/appointments/:id` | Update an appointment |
| PUT | `/api/appointments/:id/cancel` | Cancel an appointment |

### Medical Records

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/medical-records/patient/:id` | Get a patient's medical records |
| GET | `/api/medical-records/:id` | Get one medical record |
| POST | `/api/medical-records` | Create a medical record |

### Profiles

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/profile/:role/:id` | Get a doctor, receptionist, or patient profile |
| PUT | `/api/profile/:role/:id` | Update a doctor, receptionist, or patient profile |

Supported profile roles are:

```text
doctor
receptionist
patient
```

## Database Connection

The PostgreSQL connection is created in `db.js` using a connection pool:

```js
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
```

PostgreSQL `DATE` values are also kept in `YYYY-MM-DD` format to prevent timezone conversion from changing stored dates.

## Middleware

The server uses:

```js
app.use(cors());
app.use(express.json());
```

`cors()` allows the frontend application to communicate with the backend server, while `express.json()` allows Express to read JSON request bodies.

## Authentication

Passwords are hashed using **bcrypt** before being stored in the database.

During login, the server checks the user's email and password and returns basic user information including:

- User ID
- Email
- Role
- Profile ID

The supported roles are doctor, receptionist, and patient.

## Repository

Backend repository:

https://github.com/MohammadKafaween2005/Clinic-Management-System-Server

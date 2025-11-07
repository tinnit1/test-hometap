# Starter Template

This repository contains a Django backend and a React frontend using Vite. While we recommend using this repository as your starting point, you are free to build your own setup from scratch if preferred.

## Prerequisites

Ensure you have the following installed on your machine:

- Python 3.11+ (for the backend)
- Poetry (for Python dependency management)
- Node.js 22.12.0+ (for the frontend)
- Yarn (package manager for frontend dependencies)

## Project Structure

```
hometap-engineering-takehome
│── backend/                # Django backend
│   ├── backend/            # Django project settings
│   ├── properties/         # Django app for handling property data
│   ├── manage.py           # Django management script
│   ├── poetry.lock         # Poetry dependency lock file
│   ├── pyproject.toml      # Python dependencies and settings
│   ├── .env                # Environment variables for Django
│── frontend/               # React frontend with Vite
│   ├── src/                # React source code
│   ├── public/             # Static assets
│   ├── package.json        # Frontend dependencies
│   ├── vite.config.ts      # Vite configuration
│   ├── .env                # Environment variables for React
│── README.md               # Project documentation
│── LICENSE                 # Licensing information

```

## Setup Instructions

The following sections walk through the steps for setting up the frontend and backend code.

### Backend (Django) Setup

The backend is a Django application using Poetry for dependency management.

**Step 1:** Install Dependencies
Navigate to the backend folder and install dependencies:

```bash
cd backend
poetry install
```

**Step 2:** Set Up Environment Variables
Copy the sample `.env` file and configure your environment variables:

```bash
cp .env.example .env
```

Modify `.env` as needed:

```bash
DJANGO_SECRET_KEY=your_secret_key
DJANGO_DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

**Step 3:** Start a Poetry Shell
To activate the virtual environment, run:

```bash
poetry shell
```

**Step 4:** Run the Backend
Once inside the Poetry shell, start the Django server:

```bash
python manage.py runserver
```
The backend will now be running at [http://localhost:8000](http://localhost:8000).

### Frontend (React + Vite) Setup

The frontend is a React app powered by Vite.

**Step 1:** Install Dependencies

Navigate to the frontend folder and install dependencies:

```bash
cd frontend
yarn install
```

**Step 2:** Set Up Environment Variables

Copy the sample `.env` file and configure your environment variables:

```bash
cp .env.example .env
```

Modify `.env` as needed:

```bash
VITE_BACKEND_API_URL=http://localhost:8000
```

**Step 3:** Run the Frontend

Start the frontend development server:

```bash
yarn dev
```

The frontend will be available at [http://localhost:5173](http://localhost:5173).

## Running Tests

The following sections provides instructions for running the test suites associated with the frontend and backend.

### Backend (Django)

To run Django tests, first enter the Poetry shell:

```bash
cd backend
poetry shell
```

Then, run:

```bash
python manage.py test
```

### Frontend (React + Vitest)

To run frontend tests:

```bash
cd frontend
yarn test
```

## API Endpoints

The backend currently exposes a single API endpoint.

| Method | Endpoint                 | Description                     |
| ------ | ------------------------ | ------------------------------- |
| GET    | /properties?address=xyz  | Find property details by address

## Troubleshooting

- Backend Issues
    - Ensure `poetry` is installed correctly (`pip install poetry`).
    - Check `.env` for missing variables.

- Frontend Issues
    - Delete `node_modules` and reinstall dependencies:
    
    ```bash
    rm -rf node_modules yarn.lock
    yarn install
    ```
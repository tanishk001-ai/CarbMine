## CarbMine

CarbMine is a carbon footprint assessment system designed for the coal mining sector. It quantifies emissions, visualizes environmental impact, and helps industries move toward sustainability goals. The tool supports emission estimation, analytics, dashboards, and automated report generation.


## Features
- **Emission Estimation:** Calculate Scope 1, Scope 2, and Scope 3 emissions.
- **Data Upload:** Accept CSV/Excel files and auto-validate entries.
- **Dashboards:** Visualize source-wise emissions, charts, and historical trends.
- **Report Generation:** Export structured PDF sustainability reports.
- **Modular Architecture:** Frontend, backend, and calculation engine separated for easy updates.

## System Architecture

**CarbMine follows a modular structure:**
- **Frontend:** React interface for inputs and dashboards
- **Backend:** Flask/Node APIs for calculations
- **Calculation Engine:** Scientific emission factor mapping
- **Database:** CSV/JSON/MongoDB depending on implementation

## Installation

To run the Coal Carbon Footprint Tool locally, follow these steps:

### Prerequisites

- **Node.js:** Required for running the React frontend.
- **Python:** Required for running the Flask backend.
- **Firebase Account:** Set up a Firebase project and configure the credentials.

### Setup

1. **Clone the repository:**
    ```bash
    git clone https://github.com/tanishk001-ai/CarbMine
    ```

2. **Navigate to the `frontend` directory:**
    ```bash
    cd frontend
    ```

3. **Create a `.env` file in the `frontend` directory to store your Firebase credentials:**
    ```bash
    touch .env
    ```

4. **Add your Firebase configuration to the `.env` file in the `frontend` directory:**
    ```bash
    REACT_APP_FIREBASE_API_KEY=your-api-key
    REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
    REACT_APP_FIREBASE_PROJECT_ID=your-project-id
    REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
    REACT_APP_FIREBASE_APP_ID=your-app-id
    ```

5. **Install the required dependencies for both the frontend and backend:**

    - **For the frontend:**
        ```bash
        npm install
        ```

    - **For the backend:**
        Navigate to the `backend` directory:
        ```bash
        cd backend
        ```

        Install the backend dependencies:
        ```bash
        pip install -r requirements.txt
        ```

6. **Start the development servers:**

    - **React frontend:**
        ```bash
        cd frontend
        npm start
        ```

    - **Flask backend:**
        ```bash
        cd backend
        flask run
        ```

    The application should now be running locally at [http://localhost:3000](http://localhost:3000).

## Use Cases

- **Mining Companies:** Track and report emissions
- **Government Bodies:** Monitor compliance and environmental standards
- **Research Institutes:** Analyze emission trends
- **ESG Teams:** Generate Scope 1–3 emission reports

## Future Roadmap

- AI-based emission forecasting
- IoT sensor integration
- Satellite-based emission tracking
- Multi-fuel support (natural gas, petroleum)
- Blockchain-based reporting

## Contributors

[Tanishk Tiwari](https://github.com/tanishk001-ai)

## License
This project is licensed under the MIT License.



# CarbMine

**CarbMine** is a comprehensive web application designed to help the Indian coal industry address climate change challenges. It empowers coal mine operators to make informed decisions by quantifying carbon footprints and offering pathways to achieve carbon neutrality. The tool features emission estimation, carbon neutrality simulations, data visualization, carbon credit calculations, and allows users to generate and store PDF reports of their analysis.

## Demo Video

Here is the working demo of CarbMine:

[Demo Video](https://youtu.be/T19DcbGDWgY?feature=shared)

## Features

- **Emission Estimation:** Calculate the carbon footprint of coal mining operations.
- **Carbon Neutrality Simulations:** Explore different strategies to achieve carbon neutrality.
- **Data Visualization:** Visualize emission data and simulations through interactive charts and graphs.
- **Carbon Credit Calculations:** Calculate potential carbon credits based on emissions and mitigation strategies.
- **PDF Reports:** Generate and store PDF reports of your analysis for future reference.
- **Past Insights:** View historical insights and analyses for ongoing tracking and evaluation.

## Tech Stack

### Frontend
- **React:** A popular JavaScript library for building dynamic and interactive user interfaces.
- **Tailwind CSS:** A utility-first CSS framework for designing responsive and visually appealing interfaces.
- **GSAP:** A powerful library for creating high-performance animations and transitions in the frontend.

### Backend
- **Python (Flask):** A lightweight WSGI web application framework for building the backend services.
- **Firebase:** A platform by Google that provides cloud-based services including authentication and real-time databases.

## Installation

To run the Coal Carbon Footprint Tool locally, follow these steps:

### Prerequisites

- **Node.js:** Required for running the React frontend.
- **Python:** Required for running the Flask backend.
- **Firebase Account:** Set up a Firebase project and configure the credentials.

### Setup

1. **Clone the repository:**
    ```bash
    git clone https://github.com/Geethika-Kancharla/CarbMine
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

## Usage

- **Estimate Emissions:** Input your data to calculate carbon emissions from coal mining activities.
- **Simulate Carbon Neutrality:** Experiment with different scenarios to see how to achieve carbon neutrality.
- **Generate Reports:** Create PDF reports of your analyses and store them for future reference.
- **View Past Insights:** Access historical data and previous analyses to track progress over time.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.



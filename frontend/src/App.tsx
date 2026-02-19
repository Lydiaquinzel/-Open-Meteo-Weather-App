import React from "react";
import { LoadWeather } from "./components/LoadWeather";
import { TemperatureStats } from "./components/TemperatureStats";
import { PrecipitationStats } from "./components/PrecipitationStats";
import { GlobalStats } from "./components/GlobalStats";
import { HealthCheck } from "./components/HealthCheck";
import "./css/App.css";

function App() {
  return (
    <div
      className="app-background py-4"
      style={{
        backgroundImage: 'url("/weather_2.jpg")',
        minHeight: "100vh",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="dashboard-container mx-auto p-4 rounded shadow"
        style={{ maxWidth: "1600px", width: "95%" }}
      >
        <h1 className="text-center mb-4">🌦 Open Meteo Weather App</h1>

        <div className="row">
          <div className="col-md-6 mb-3">
            <LoadWeather />
          </div>

          <div className="col-md-6 mb-3">
            <HealthCheck />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <TemperatureStats />
          </div>

          <div className="col-md-6 mb-3">
            <PrecipitationStats />
          </div>
        </div>

        <div className="row">
          <div className="col-12 mb-3">
            <GlobalStats />
          </div>
        </div>
      </div>

      <footer
        className="text-center p-2 footer-app"
      >
        Developed with 💜 by Lydia Agüero
      </footer>
    </div>
  );
}

export default App;

import React, { useState } from "react";
import { CityFilter, City } from "../context/CityFilter";
import { postLoadWeather } from "../api";

export const LoadWeather: React.FC = () => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (city: City | null) => {
    if (!city || !start || !end) {
      setError("All fields are required");
      setMessage(null);
      return;
    }

    // Validación fechas
    const today = new Date().toISOString().split("T")[0];
    if (start > today || end > today) {
      setError("Dates cannot be in the future");
      setMessage(null);
      return;
    }
    if (start > end) {
      setError("Start date cannot be after end date");
      setMessage(null);
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const data = await postLoadWeather(city.name, start, end);

      if (data.status === "success" && data.records_added !== undefined) {
        setMessage(`Data loaded successfully: ${data.records_added} records added`);
        setError(null);
        return;
      }

      if (data.error) {
        setError("An error occurred while loading data. Please check the city and date range.");
        setMessage(null);
        return;
      }

      setError("Unexpected response from backend");
      setMessage(null);
    } catch (err: any) {
      setError("An error occurred while loading data");
      setMessage(null);

    } finally {
      setLoading(false);
    }
  };

  return (
    <CityFilter>
      {({ cityInput, setCityInput, selectedCity, suggestions, handleSelectCity }) => (
        <div className="card p-3 mb-3" style={{ maxWidth: "900px" }}>
          <h4 className="card-title">Load Weather</h4>

          <div className="mb-3">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Enter city"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
            />

            {suggestions.length > 0 && (
              <ul className="list-group mb-2">
                {suggestions.map((city, index) => (
                  <li
                    key={index}
                    className="list-group-item list-group-item-action"
                    style={{ cursor: "pointer" }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelectCity(city);
                    }}
                  >
                    {city.name}
                    {city.admin1 ? `, ${city.admin1}` : ""}, {city.country}
                  </li>
                ))}
              </ul>
            )}

            <input
              type="date"
              className="form-control mb-2"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
            />

            <input
              type="date"
              className="form-control"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          <button
            className="btn btn-primary w-100 mb-3"
            onClick={() => handleSubmit(selectedCity)}
            disabled={loading || !selectedCity}
          >
            {loading ? (
              <div className="spinner-border spinner-border-sm" role="status"></div>
            ) : (
              "Load Weather"
            )}
          </button>

          {message && <div className="alert alert-info mb-2">{message}</div>}
          {error && <div className="alert alert-danger mb-2">{error}</div>}
        </div>
      )}
    </CityFilter>
  );
};

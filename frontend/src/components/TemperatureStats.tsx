import React, { useState } from "react";
import { getTemperatureStats } from "../api";
import { CityFilter, City } from "../context/CityFilter";

export const TemperatureStats: React.FC = () => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFetch = async (selectedCity: City | null) => {
    if (!selectedCity || !start || !end) {
      setError("All fields are required");
      setData(null);
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (start > today || end > today) {
      setError("Dates cannot be in the future");
      setData(null);
      return;
    }

    if (start > end) {
      setError("Start date cannot be after end date");
      setData(null);
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const json = await getTemperatureStats(selectedCity.name, start, end);

      if (!json.temperature) {
        setError(
          "No temperature data available for the selected city and dates"
        );
        return;
      }

      setData(json);
    } catch (e: any) {
      console.error("TemperatureStats error:", e);
      setError(
        e.message.includes("No data found")
          ? "No temperature data available for the selected city and dates"
          : "An error occurred while fetching temperature stats"
      );
    } finally {
      setLoading(false);
    }
  };

  const safeNumber = (num: any, decimals = 1) =>
    num !== undefined && num !== null ? num.toFixed(decimals) : "-";

  return (
    <CityFilter>
      {({ cityInput, setCityInput, selectedCity, suggestions, handleSelectCity }) => (
        <div className="card p-3 mb-3 w-100">
          <h4 className="card-title">Temperature Stats</h4>

          <div className="mb-3">
            <input
              className="form-control mb-2"
              placeholder="City"
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
            onClick={() => handleFetch(selectedCity)}
            disabled={loading || !selectedCity}
          >
            {loading ? <div className="spinner-border spinner-border-sm" role="status"></div> : "Fetch"}
          </button>

          {error && <div className="alert alert-danger mb-2">{error}</div>}

          {data && data.temperature && (
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th>Average</th>
                    <th>Max</th>
                    <th>Max DateTime</th>
                    <th>Min</th>
                    <th>Min DateTime</th>
                    <th>Hours &gt; 30°C</th>
                    <th>Hours &lt; 0°C</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{safeNumber(data.temperature.average)}</td>
                    <td>{safeNumber(data.temperature.max?.value)}</td>
                    <td>{data.temperature.max?.date_time ?? "-"}</td>
                    <td>{safeNumber(data.temperature.min?.value)}</td>
                    <td>{data.temperature.min?.date_time ?? "-"}</td>
                    <td>{data.temperature.hours_above_threshold ?? 0}</td>
                    <td>{data.temperature.hours_below_threshold ?? 0}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </CityFilter>
  );
};

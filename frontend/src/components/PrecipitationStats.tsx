import React, { useState } from "react";
import { getPrecipitationStats } from "../api";
import { CityFilter, City } from "../context/CityFilter";

export const PrecipitationStats: React.FC = () => {
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
      const json = await getPrecipitationStats(selectedCity.name, start, end);

      if (!json.precipitation) {
        setError(
          "No precipitation data available for the selected city and dates"
        );
        return;
      }

      setData(json);
    } catch (e: any) {
      console.error("PrecipitationStats error:", e);
      setError(
        e.message.includes("No data found")
          ? "No precipitation data available for the selected city and dates"
          : "An error occurred while fetching precipitation stats"
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
          <h4 className="card-title">Precipitation Stats</h4>

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

          {data && data.precipitation && (
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th>Total</th>
                    <th>Average</th>
                    <th>Days with Precipitation</th>
                    <th>Max Value</th>
                    <th>Max Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{safeNumber(data.precipitation.total)}</td>
                    <td>{safeNumber(data.precipitation.average, 2)}</td>
                    <td>{data.precipitation.days_with_precipitation ?? 0}</td>
                    <td>{safeNumber(data.precipitation.max?.value)}</td>
                    <td>{data.precipitation.max?.date ?? "-"}</td>
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

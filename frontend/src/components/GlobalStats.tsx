import React, { useState } from "react";
import { getGlobalStats } from "../api";
import "../css/GlobalStats.css";

export const GlobalStats: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const json = await getGlobalStats();
      setData(json);
    } catch (e: any) {
      console.error("GLOBAL STATS ERROR:", e);
      setError("Error fetching global stats");
    } finally {
      setLoading(false);
    }
  };

  const safeNumber = (num: number | undefined | null, decimals = 1) =>
    num !== undefined && num !== null ? num.toFixed(decimals) : "-";

  const safeValue = (val: any) => (val !== undefined && val !== null ? val : "-");

  return (
    <div className="card p-3">
      <h4 className="card-title">Global Stats</h4>

      <button
        className="btn btn-primary w-100 mb-2"
        onClick={fetchStats}
        disabled={loading}
      >
        {loading ? "Loading..." : "Fetch"}
      </button>

      {error && <div className="text-danger mb-2">{error}</div>}

      {data && (
        <div className="table-responsive">
          <table className="table table-striped table-bordered mt-2">
            <thead>
              <tr>
                <th>City</th>
                <th>Avg Temp</th>
                <th>Max Temp</th>
                <th>Max Date</th>
                <th>Min Temp</th>
                <th>Min Date</th>
                <th>Total Precip</th>
                <th>Days with Precip</th>
                <th>Max Precip</th>
                <th>Max Precip Date</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(data).map(([city, stats]: [string, any]) => (
                <tr key={city}>
                  <td>{city}</td>
                  <td>{safeNumber(stats.temperature_average, 2)}</td>
                  <td>{safeNumber(stats.temperature_max?.value, 2)}</td>
                  <td>{safeValue(stats.temperature_max?.date)}</td>
                  <td>{safeNumber(stats.temperature_min?.value, 2)}</td>
                  <td>{safeValue(stats.temperature_min?.date)}</td>
                  <td>{safeNumber(stats.precipitation_total, 2)}</td>
                  <td>{safeValue(stats.days_with_precipitation)}</td>
                  <td>{safeNumber(stats.precipitation_max?.value, 2)}</td>
                  <td>{safeValue(stats.precipitation_max?.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

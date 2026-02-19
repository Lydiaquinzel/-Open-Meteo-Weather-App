import React, { useEffect, useState } from "react";
import { getHealth } from "../api";

export const HealthCheck: React.FC = () => {
  const [status, setStatus] = useState("loading...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      setError(null);

      try {
        const data = await getHealth();

        if (!data?.status) {
          throw new Error("Invalid response from backend");
        }

        setStatus(data.status);
      } catch (e: any) {
        console.error("Health error:", e);
        setStatus("error");
        setError(e.message || "Error fetching health");
      }
    };

    fetchHealth();
  }, []);

  return (
    <div className="card p-3 mb-3">
      <h4>System Health</h4>

      <button
        className={`btn w-100 mb-2 ${
          status === "ok" ? "btn-success" : "btn-danger"
        }`}
        disabled
      >
        {status === "ok" ? "OK" : status.toUpperCase()}
      </button>

      {error && <div className="text-danger mt-2">{error}</div>}
    </div>
  );
};

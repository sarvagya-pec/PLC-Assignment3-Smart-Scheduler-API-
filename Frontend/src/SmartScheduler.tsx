import React, { useState } from "react";
import axios from "axios";

const SmartScheduler: React.FC = () => {
  const [tasks, setTasks] = useState<{ name: string; estimatedHours: number }[]>([
    { name: "Research", estimatedHours: 10 },
    { name: "Design", estimatedHours: 8 },
    { name: "Development", estimatedHours: 16 },
    { name: "Testing", estimatedHours: 6 },
  ]);
  const [availableHours, setAvailableHours] = useState(6);
  const [startDate, setStartDate] = useState("2025-10-30");
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5189/api/v1/SmartScheduler/1/schedule",
        {
          availableHoursPerDay: availableHours,
          startDate,
          tasks,
        }
      );
      console.log("Response data:", res.data);
      setSchedule(res.data.schedule);
    } catch (err) {
      console.error("Error:", err);
      alert("Error generating schedule!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Smart Scheduler</h1>
      <p>Auto-generate your project task plan using backend AI logic!</p>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Available Hours per Day:{" "}
          <input
            type="number"
            value={availableHours}
            onChange={(e) => setAvailableHours(Number(e.target.value))}
          />
        </label>
        <br />
        <label>
          Start Date:{" "}
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {loading ? "Generating..." : "Generate Schedule"}
      </button>

      {schedule.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Generated Schedule</h2>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead>
              <tr>
                <th style={{ borderBottom: "2px solid #ddd", padding: "8px" }}>
                  Task
                </th>
                <th style={{ borderBottom: "2px solid #ddd", padding: "8px" }}>
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((item, index) => (
                <tr key={index}>
                  <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>
                    {item.task || "—"}
                  </td>
                  <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>
                    {item.date || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SmartScheduler;

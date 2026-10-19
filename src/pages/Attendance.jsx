
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Attendance() {
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState("");

  async function loadRecords() {
    try {
      const response = await api.get("/attendance");
      setRecords(Array.isArray(response.data) ? response.data : []);
    } catch {
      setMessage("Unable to load attendance. Check the API endpoint.");
    }
  }

  useEffect(() => {
    loadRecords();
  }, []);

  async function markAttendance(action) {
    setMessage("");

    try {
      await api.post(`/attendance/${action}`);
      setMessage(
        action === "check-in" ? "Checked in successfully." : "Checked out successfully."
      );
      await loadRecords();
    } catch (error) {
      setMessage(
        error.response?.data?.detail || "Attendance action failed."
      );
    }
  }

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">TIME TRACKING</p>
          <h1>Attendance</h1>
          <p className="muted">Track your working day.</p>
        </div>
      </div>

      <div className="panel">
        <h2>Today's attendance</h2>
        <div className="action-row">
          <button className="primary-button" onClick={() => markAttendance("check-in")}>
            Check in
          </button>
          <button className="secondary-button" onClick={() => markAttendance("check-out")}>
            Check out
          </button>
        </div>
        {message && <p>{message}</p>}
      </div>

      <div className="panel">
        <h2>Attendance history</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Date</th><th>Check in</th><th>Check out</th><th>Status</th></tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td>{record.date}</td>
                  <td>{record.check_in || "—"}</td>
                  <td>{record.check_out || "—"}</td>
                  <td>{record.status}</td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr><td colSpan="4">No attendance records available.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

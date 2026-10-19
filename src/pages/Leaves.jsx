
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Leaves() {
  const [leaves, setLeaves] = useState([]);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    leave_type: "CASUAL",
    start_date: "",
    end_date: "",
    reason: "",
  });

  async function loadLeaves() {
    try {
      const response = await api.get("/leaves");
      setLeaves(Array.isArray(response.data) ? response.data : []);
    } catch {
      setMessage("Unable to load leave history.");
    }
  }

  useEffect(() => {
    loadLeaves();
  }, []);

  async function submitLeave(event) {
    event.preventDefault();
    setMessage("");

    if (form.end_date < form.start_date) {
      setMessage("End date must be on or after the start date.");
      return;
    }

    try {
      await api.post("/leaves", form);
      setMessage("Leave application submitted successfully.");
      setForm({
        leave_type: "CASUAL",
        start_date: "",
        end_date: "",
        reason: "",
      });
      await loadLeaves();
    } catch (error) {
      setMessage(
        error.response?.data?.detail || "Unable to submit leave."
      );
    }
  }

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">TIME OFF</p>
          <h1>Leave management</h1>
          <p className="muted">Apply for leave and review requests.</p>
        </div>
      </div>

      <form className="panel form-panel" onSubmit={submitLeave}>
        <h2>Apply for leave</h2>

        <label>Leave type</label>
        <select
          value={form.leave_type}
          onChange={(e) => setForm({ ...form, leave_type: e.target.value })}
        >
          <option value="SICK">Sick leave</option>
          <option value="CASUAL">Casual leave</option>
          <option value="PAID">Paid leave</option>
        </select>

        <div className="form-grid">
          <div>
            <label>Start date</label>
            <input
              type="date"
              value={form.start_date}
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              required
            />
          </div>
          <div>
            <label>End date</label>
            <input
              type="date"
              min={form.start_date || undefined}
              value={form.end_date}
              onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              required
            />
          </div>
        </div>

        <label>Reason</label>
        <textarea
          rows="3"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
          required
        />

        <button className="primary-button" type="submit">
          Submit application
        </button>
        {message && <p>{message}</p>}
      </form>

      <div className="panel">
        <h2>Leave history</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Type</th><th>Start</th><th>End</th><th>Reason</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave.id}>
                  <td>{leave.leave_type}</td>
                  <td>{leave.start_date}</td>
                  <td>{leave.end_date}</td>
                  <td>{leave.reason}</td>
                  <td><span className="status-pill">{leave.status}</span></td>
                </tr>
              ))}
              {leaves.length === 0 && (
                <tr><td colSpan="5">No leave requests available.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}


import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Payroll() {
  const [payroll, setPayroll] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/payroll")
      .then((response) => {
        setPayroll(Array.isArray(response.data) ? response.data : []);
      })
      .catch(() => setMessage("Unable to load payroll records."));
  }, []);

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">COMPENSATION</p>
          <h1>Payroll</h1>
          <p className="muted">Review salary and payroll records.</p>
        </div>
      </div>

      <div className="panel">
        <h2>Payroll history</h2>
        {message && <p className="error">{message}</p>}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Month</th><th>Basic salary</th><th>Deductions</th>
                <th>Bonus</th><th>Net salary</th>
              </tr>
            </thead>
            <tbody>
              {payroll.map((item) => (
                <tr key={item.id}>
                  <td>{item.month}</td>
                  <td>₹{Number(item.basic_salary).toLocaleString("en-IN")}</td>
                  <td>₹{Number(item.deductions).toLocaleString("en-IN")}</td>
                  <td>₹{Number(item.bonus).toLocaleString("en-IN")}</td>
                  <td>₹{Number(item.net_salary).toLocaleString("en-IN")}</td>
                </tr>
              ))}
              {!message && payroll.length === 0 && (
                <tr><td colSpan="5">No payroll records available.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

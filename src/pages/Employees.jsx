
import { useEffect, useState } from "react";
import { Search, Plus } from "lucide-react";
import api from "../api/axios";
export async function createEmployee(employeeData) {
  const response = await api.post(
    "/employees",
    employeeData
  );

  return response.data;
}
export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/employees")
      .then((response) => {
        setEmployees(Array.isArray(response.data)
          ? response.data
          : response.data.items || []);
      })
      .catch(() => setError("Unable to load employees."));
  }, []);

  const filtered = employees.filter((employee) =>
    `${employee.full_name} ${employee.designation} ${employee.department}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">PEOPLE</p>
          <h1>Employees</h1>
          <p className="muted">Manage your employee directory.</p>
        </div>
        <button
          className="primary-button compact"
          onClick={() => alert("Connect the add employee form next.")}
        >
          <Plus size={17} /> Add employee
        </button>
      </div>

      <div className="panel">
        <div className="search-box">
          <Search size={18} />
          <input
            placeholder="Search name, designation or department"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {error && <p className="error">{error}</p>}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Designation</th>
                <th>Department</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.full_name}</td>
                  <td>{employee.designation}</td>
                  <td>{employee.department}</td>
                  <td>
                    <span className="status-pill">
                      {employee.status}
                    </span>
                  </td>
                </tr>
              ))}
              {!error && filtered.length === 0 && (
                <tr>
                  <td colSpan="4">No employees found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

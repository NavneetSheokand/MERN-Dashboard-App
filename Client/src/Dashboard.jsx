import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Dashboard.css";
import TableHeader from "./TableHeader";
import Pagination from "./Pagination";
import { useMemo } from "react";
import { useAuth } from './AuthContext';

function Dashboard() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    hobby: "",
  });
  const [editingId, setEditingId] = useState(null);
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [selectedEntries, setSelectedEntries] = useState([]);

  const [sortConfig, setSortConfig] = useState({ key: "firstName", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  axios.defaults.withCredentials = true;

  // Check validations
  const validateForm = () => {
    const errors = {};

    if (!form.firstName.trim()) {
      errors.firstName = "First name is required";
    }
    if (!form.lastName.trim()) {
      errors.lastName = "Last name is required";
    }
    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = "Please include '@' and '.'";
    }
    if (form.phone && !/^\d{10}$/.test(form.phone)) {
      errors.phone = "Phone must be 10 digits";
    }

    return errors;
  };

  // Fetch entries (only called when user is authenticated)
  const fetchEntries = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get("http://localhost:3088/api/table", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setEntries(response.data);
    } catch (error) {
      console.error("Failed to fetch entries:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        logout();
        navigate("/login");
      }
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  // Only fetch entries if user is authenticated
  useEffect(() => {
    if (user) {
      fetchEntries();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Add or update entry
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      };

      if (editingId) {
        const res = await axios.put(`http://localhost:3088/api/table/${editingId}`, form, config);
        setEntries(entries.map((item) => (item._id === editingId ? res.data : item)));
        setEditingId(null);
        toast.success("Updated Successfully");
      } else {
        const res = await axios.post("http://localhost:3088/api/table", form, config);
        setEntries([...entries, res.data]);
        toast.success("Added Successfully");
      }
      setForm({ firstName: "", lastName: "", email: "", phone: "", location: "", hobby: "" });
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        handleLogout();
      } else {
        toast.error("Error saving entry");
      }
    }
  };

  // Delete entry with toast confirmation
  const handleDelete = (id) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p>Are you sure you want to delete this entry?</p>
          <div className="confirm-buttons">
            <button
              className="btn btn-danger"
              onClick={async () => {
                try {
                  const token = localStorage.getItem("token");
                  await axios.delete(`http://localhost:3088/api/table/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                  });
                  setEntries((prev) => prev.filter((item) => item._id !== id));
                  toast.success("Deleted Successfully");
                } catch (err) {
                  if (err.response?.status === 401) {
                    toast.error("Session expired. Please log in again.");
                    handleLogout();
                  } else {
                    toast.error("Error deleting entry");
                  }
                }
                closeToast();
              }}
            >
              Yes
            </button>
            <button className="btn btn-secondary" onClick={closeToast}>
              No
            </button>
          </div>
        </div>
      ),
      { autoClose: false, closeOnClick: false }
    );
  };

  // Edit entry
  const handleEdit = (entry) => {
    setForm(entry);
    setEditingId(entry._id);
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setForm({ firstName: "", lastName: "", email: "", phone: "", location: "", hobby: "" });
    setEditingId(null);
  };

  // Logout
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3088/api/auth/logout", {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true
      });
      logout(); // Use the logout function from context
      toast.success("Logged Out");
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
      logout(); // Still call logout even if API call fails
      navigate("/");
    }
  };

  // Selecting Entries for multiple delete
  // Toggle Selection
  const handleSelect = (id) => {
    setSelectedEntries((prev) =>
      prev.includes(id) ? prev.filter((entryId) => entryId !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedEntries.length === 0) return;

    if (!window.confirm(`Are you sure you want to delete ${selectedEntries.length} entries?`)) return;

    try {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:3088/api/table/delete-multiple", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ ids: selectedEntries }),
        credentials: "include"
      });

      // Update UI after delete
      setEntries((prev) => prev.filter((e) => !selectedEntries.includes(e._id)));
      setSelectedEntries([]);
      toast.success("Selected entries deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete selected entries");
    }
  };

  // Download CSV
  const handleDownloadCSV = () => {
    if (sortedEntries.length === 0) {
      toast.error("No data to download");
      return;
    }
    const headers = ["ID", "First Name", "Last Name", "Email", "Phone", "Location", "Hobby"];
    const csvContent = [
      headers.join(","),
      ...sortedEntries.map((e, idx) =>
        [idx + 1, e.firstName, e.lastName, e.email, e.phone || "", e.location || "", e.hobby || ""].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-entries.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Sorting
  const sortedEntries = useMemo(() => {
    const sortableItems = [...entries];
    if (!sortConfig?.key) return sortableItems;

    const getVal = (item, key) => {
      const v = item?.[key];
      return v === null || v === undefined ? "" : String(v).trim().toLowerCase();
    };

    sortableItems.sort((a, b) => {
      const aVal = getVal(a, sortConfig.key);
      const bVal = getVal(b, sortConfig.key);

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sortableItems;
  }, [entries, sortConfig]);

  const requestSort = (key) => {
    setSortConfig(prev => {
      const direction = (prev.key === key && prev.direction === "asc") ? "desc" : "asc";
      return { key, direction };
    });
    setCurrentPage(1);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedEntries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedEntries.length / itemsPerPage);

  if (loading) return <h2 className="loading">Loading...</h2>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>CRUD Database Dashboard</h1>
        {!user ? (
          <div>
            <Link to="/login">
              <button className="btn">Login</button>
            </Link>
            <Link to="/registration">
              <button className="btn">Signup</button>
            </Link>
          </div>
        ) : (
          <button onClick={handleLogout} className="btn btn-danger">Logout</button>
        )}
      </header>

      {user ? (
        <>
          {/* Form */}
          <div className="form-container">
            <h3>{editingId ? "Edit Entry" : "Add New Entry"}</h3>
            <form onSubmit={handleSubmit} className="form-grid">
              <div>
                <label>First Name *</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                />
                <div style={{ minHeight: "18px" }}>
                  {formErrors.firstName && (
                    <p style={{ color: "red", fontSize: "14px", margin: 0 }}>{formErrors.firstName}</p>)}
                </div>
              </div>

              <div>
                <label>Last Name *</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                />
                <div style={{ minHeight: "18px" }}>
                  {formErrors.lastName && (
                    <p style={{ color: "red", fontSize: "14px", margin: 0 }}>{formErrors.lastName}</p>)}
                </div>
              </div>

              <div>
                <label>Email *</label>
                <input type="text" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <div style={{ minHeight: "18px" }}>
                  {formErrors.email && (
                    <p style={{ color: "red", fontSize: "14px", margin: 0 }}>{formErrors.email}</p>)}
                </div>
              </div>


              <div>
                <label>Phone</label>
                <input type="tel" value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                <div style={{ minHeight: "18px" }}>
                  {formErrors.phone &&
                    (<p style={{ color: "red", fontSize: "14px", margin: 0 }}>{formErrors.phone}</p>)}
                </div>
              </div>

              <div>
                <label>Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>

              <div>
                <label>Hobby</label>
                <input
                  type="text"
                  value={form.hobby}
                  onChange={(e) => setForm({ ...form, hobby: e.target.value })}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-success">{editingId ? "Update" : "Add"} Entry</button>
                {editingId && <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>Cancel</button>}
              </div>
            </form>
          </div>

          {/* Table */}
          {entries.length > 0 ? (
            <div className="table-container">
              <table>
                <TableHeader requestSort={requestSort} sortConfig={sortConfig} />

                <tbody>
                  {currentItems.map((entry, i) => {
                    const rowIndex = indexOfFirstItem + i;
                    return (
                      <tr key={entry._id} className={rowIndex % 2 === 0 ? "row-light" : "row-dark"}>
                        {/* Checkbox for selecting */}
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedEntries.includes(entry._id)}
                            onChange={() => handleSelect(entry._id)}
                          />
                        </td>
                        <td>{rowIndex + 1}</td>
                        <td>{entry.firstName}</td>
                        <td>{entry.lastName}</td>
                        <td>{entry.email}</td>
                        <td>{entry.phone || "-"}</td>
                        <td>{entry.location || "-"}</td>
                        <td>{entry.hobby || "-"}</td>
                        <td>
                          <button onClick={() => handleEdit(entry)} className="btn btn-warning">Edit</button>
                          <button onClick={() => handleDelete(entry._id)} className="btn btn-danger">Delete</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          ) : (
            <div className="no-entries">
              <h3>No entries found</h3>
              <p>Add your first entry using the form above.</p>
            </div>
          )}

          {/* Download CSV */}
          {entries.length > 0 && (
            <div className="download-btn">
              <button onClick={handleDownloadCSV} className="btn btn-primary">📥 Download CSV</button>
            </div>
          )}

          <button className="btn btn-danger" onClick={handleDeleteSelected} disabled={selectedEntries.length === 0}>
            Delete Selected ({selectedEntries.length})
          </button>

        </>
      ) : (
        <h1>Please login</h1>
      )}
    </div>
  );
}

export default Dashboard;
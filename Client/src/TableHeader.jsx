import React from "react";

function TableHeader({ requestSort, sortConfig }) {
  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? " 🔼" : " 🔽";
    }
    return " ⬍";
  };

  return (
    <thead style={{ background: "#f8f9fa" }}>
      <tr>
        <th>Select</th>
        <th onClick={() => requestSort("_id")} style={{ cursor: "pointer" }}>
          ID {getSortIndicator("_id")}
        </th>
        <th onClick={() => requestSort("firstName")} style={{ cursor: "pointer" }}>
          First Name {getSortIndicator("firstName")}
        </th>
        <th onClick={() => requestSort("lastName")} style={{ cursor: "pointer" }}>
          Last Name {getSortIndicator("lastName")}
        </th>
        <th onClick={() => requestSort("email")} style={{ cursor: "pointer" }}>
          Email {getSortIndicator("email")}
        </th>
        <th onClick={() => requestSort("phone")} style={{ cursor: "pointer" }}>
          Phone {getSortIndicator("phone")}
        </th>
        <th onClick={() => requestSort("location")} style={{ cursor: "pointer" }}>
          Location {getSortIndicator("location")}
        </th>
        <th onClick={() => requestSort("hobby")} style={{ cursor: "pointer" }}>
          Hobby {getSortIndicator("hobby")}
        </th>
        <th>Actions</th>
      </tr>
    </thead>
  );
}

export default TableHeader;

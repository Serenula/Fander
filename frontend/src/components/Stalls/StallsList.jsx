import React, { useState, useEffect } from "react";
import api from "../../api";

const StallsList = () => {
  const [stalls, setStalls] = useState([]);

  useEffect(() => {
    fetchStalls();
  }, []);

  const fetchStalls = async () => {
    try {
      const response = await api.get("/stalls");
      setStalls(response.data);
    } catch (error) {
      console.error("Error fetching stalls:", error);
    }
  };

  return (
    <div>
      <h2>Stalls List</h2>
      <ul>
        {stalls.map((stall) => (
          <li key={stall._id}>
            <h3>{stall.name}</h3>
            <p>{stall.description}</p>
            {/* Display other stall details as needed */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StallsList;

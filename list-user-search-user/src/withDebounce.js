import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData(); // Fetch all users initially
  }, []);

  // Fetch all users initially
  const fetchData = async () => {
    try {
      const response = await fetch("https://dummyjson.com/users");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      setUsers(result.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Debounce function to delay API calls
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim() === "") {
        fetchData(); // If search is empty, reload all users
      } else {
        fetchFilteredUsers(search);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounce); // Cleanup timeout on each update
  }, [search]);

  // Fetch filtered users based on search query
  const fetchFilteredUsers = async (query) => {
    try {
      const response = await fetch(`https://dummyjson.com/users/search?q=${query}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      setUsers(result.users);
    } catch (error) {
      console.error("Error fetching filtered users:", error);
    }
  };

  return (
    <>
      <div className="bg-warning fixed-top py-3 shadow-sm">
        <div className="container">
          <nav className="navbar d-flex justify-content-between">
            <a className="navbar-brand text-dark fw-bold display-6" href="#">
              Search List Users
            </a>
            <input
              type="text"
              className="form-control w-25"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </nav>
        </div>
      </div>

      {/* User List */}
      <div className="container" style={{ marginTop: "90px" }}>
        {users.length > 0 ? (
          <ul className="list-group">
            {users.map((user, index) => (
              <li
                key={index}
                className="list-group-item border-0 shadow-sm rounded p-3 mb-2 bg-light"
              >
                <strong>{user.firstName} {user.lastName}</strong>
                <p className="text-muted mb-0">{user.email}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-muted mt-3">No users found.</p>
        )}
      </div>
    </>
  );
}

export default App;

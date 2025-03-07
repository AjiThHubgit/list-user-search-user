import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/users"); // Now using proxy `/api`
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      setUsers(result.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim() === "") {
        fetchData();
      } else {
        fetchFilteredUsers(search);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const fetchFilteredUsers = async (query) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/search?q=${query}`); // Using proxy
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      setUsers(result.users);
    } catch (error) {
      console.error("Error fetching filtered users:", error);
    } finally {
      setLoading(false);
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

      <div className="container" style={{ marginTop: "90px" }}>
        {loading ? (
          <p className="text-center text-muted mt-3">Loading...</p>
        ) : users.length > 0 ? (
          <ul className="list-group">
            {users.map((user, index) => (
              <li
                key={index}
                className="list-group-item border-0 shadow-sm rounded p-3 mb-2 bg-light"
              >
                <strong>
                  {user.firstName} {user.lastName}
                </strong>
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

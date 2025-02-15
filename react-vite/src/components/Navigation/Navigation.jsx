import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import { useSelector } from "react-redux";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import OpenModalButton from "../OpenModalButton";
import "./Navigation.css";

function Navigation() {
  const navigate = useNavigate();
  const [searchTag, setSearchTag] = useState("");
  const [showTags, setShowTags] = useState(false);
  const [tags, setTags] = useState([]);
  const [notesByTag, setNotesByTag] = useState([]);
  const sessionUser = useSelector((state) => state.session.user);

  // Fetch tags from the backend
  useEffect(() => {
    if (sessionUser) {
      fetch("/api/tags/", {
        method: "GET",
        credentials: "include", // IMPORTANT: Ensures cookies are sent
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Tags data:", data);
          // If the data is not an array, extract the array from the object
          const tagsArray = Array.isArray(data) ? data : data.Tags || [];
          setTags(tagsArray);
        })
        .catch((err) => console.error("Error fetching tags:", err));
    } else return;
  }, [sessionUser]);

  const handleTagSearch = (tagName) => {
    setSearchTag(tagName);
    fetch(`/api/tags/${tagName}/notes`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        console.log("Notes by tag:", data);
        setNotesByTag(data.notes || []);
      })
      .catch((err) => console.error("Error fetching notes for tag:", err));
  };

  const filterItems = (list, searchTerm) =>
    list.filter(
      (item) =>
        item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <nav className="sidebar">
      <div className="profile-section">
        {sessionUser ? (
          <div className="logged-in-container">
            <ProfileButton className={"nav-profile-button"} />
            <div className="user-info">
              <p className="user-info-text">
                {sessionUser.username.length > 15
                  ? sessionUser.username.slice(0, 15) + "..."
                  : sessionUser.username}
              </p>
              <p className="user-info-text">
                {sessionUser.email.length > 15
                  ? sessionUser.email.slice(0, 15) + "..."
                  : sessionUser.email}
              </p>
            </div>
          </div>
        ) : (
          <div className="non-logged-buttons-container">
            <OpenModalButton
              buttonText="Log In"
              className={"non-logged-button"}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalButton
              buttonText="Sign Up"
              className={"non-logged-button"}
              modalComponent={<SignupFormModal />}
            />
          </div>
        )}
      </div>
      {sessionUser ? (
        <>
          {" "}
          <div className="nav-button-box">
            <button className="new-notebook-button nav-button-height">
              + New Notebook
            </button>
            <div className="nav-small-button-box">
              <button className="new-task-button nav-small-button nav-button-height">
                + New Task
              </button>
              <button
                className="new-note-button nav-small-button nav-button-height"
                onClick={() => navigate(`/notes/new`)}
              >
                + New Note
              </button>
            </div>
          </div>
          <div className="nav-link-box">
            <ul className="nav-links">
              <li>
                <NavLink to="/" className="nav-item">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/notes" className="nav-item">
                  Notes
                </NavLink>
              </li>
              <li>
                <NavLink to="/tasks" className="nav-item">
                  Tasks
                </NavLink>
              </li>
              {/* Notebooks Section */}

              <li className="nav-item-container">
                <NavLink to="/notebooks" className="nav-item">
                  Notebooks
                </NavLink>
              </li>

              {/* Tags Section */}
              <li className="nav-item-container">
                <NavLink to="/tags" className="nav-item">
                  Tags
                </NavLink>
                <span>
                  <button
                    onClick={() => setShowTags(!showTags)}
                    className="dropdown-button"
                    style={{
                      border: "none",
                      padding: "0 0 0 6px",
                      cursor: "pointer",
                    }}
                  >
                    ▼
                  </button>
                </span>
              </li>
              {showTags && (
                <div className="dropdown-content">
                  <input
                    type="text"
                    className="search-bar"
                    placeholder="Search Tags..."
                    value={searchTag}
                    onChange={(e) => setSearchTag(e.target.value)}
                  />
                  <ul className="dropdown-list">
                    {filterItems(tags, searchTag).map((tag, index) => (
                      <li
                        key={index}
                        className="dropdown-item"
                        onClick={() => handleTagSearch(tag.name)}
                      >
                        {tag.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </ul>
          </div>
          {/* Display Notes by Tag */}
          {notesByTag.length > 0 && (
            <div className="tag-search-results">
              <h3>Notes for Tag: {searchTag}</h3>
              <ul>
                {notesByTag.map((note) => (
                  <li key={note.id}>
                    <strong>{note.title}</strong>: {note.content}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <p>
          Please signup or login <br /> for the full experience!
        </p>
      )}
    </nav>
  );
}

export default Navigation;

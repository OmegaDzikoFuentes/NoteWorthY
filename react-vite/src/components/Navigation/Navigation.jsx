import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  const navigate = useNavigate();
  const [searchNotebook, setSearchNotebook] = useState("");
  const [searchTag, setSearchTag] = useState("");
  const [showNotebooks, setShowNotebooks] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [notebooks, setNotebooks] = useState([]);
  const [tags, setTags] = useState([]);
  const [notesByTag, setNotesByTag] = useState([]);

  // Fetch notebooks from the backend
  useEffect(() => {
    fetch("/api/notebooks")
    fetch("/api/notebooks")
      .then((res) => res.json())
      .then((data) => {
        if (data.Notebooks) {
          setNotebooks(data.Notebooks);
        }
      })
      .catch((err) => console.error("Error fetching notebooks:", err));
  }, []);

  // Fetch tags from the backend
  useEffect(() => {
    fetch("/api/tags/", {
      method: "GET",
      credentials: "include",  // IMPORTANT: Ensures cookies are sent
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Tags data:", data);
        // If the data is not an array, extract the array from the object
        const tagsArray = Array.isArray(data) ? data : data.Tags || [];
        setTags(tagsArray);
      })
      .catch((err) => console.error("Error fetching tags:", err));
  }, []);

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
    list.filter((item) =>
      item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  

  return (
    <nav className="sidebar">
      <div className="profile-section">
        <ProfileButton />
      </div>

      <button className="new-note-button" onClick={() => navigate(`/notes/new`)}>New Note</button>
      <button className="new-note-btn">New Task</button>
      <button className="new-note-btn">New Notebook</button>

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
          <NavLink to="/notebooks" className="nav-item">Notebooks</NavLink>
          <button
            onClick={() => setShowNotebooks(!showNotebooks)}
            className="dropdown-button"
          >
            ▼
          </button>
          {showNotebooks && (
            <div className="dropdown-content">
              <input
                type="text"
                className="search-bar"
                placeholder="Search Notebooks..."
                value={searchNotebook}
                onChange={(e) => setSearchNotebook(e.target.value)}
              />
              <ul className="dropdown-list">
                {filterItems(notebooks, searchNotebook).map((notebook, index) => (
                  <li key={index} className="dropdown-item">{notebook.name}</li>
                ))}
              </ul>
            </div>
          )}
        </li>

       {/* Tags Section */}
       <li className="nav-item-container">
          <NavLink to="/tags" className="nav-item">Tags</NavLink>
          <button onClick={() => setShowTags(!showTags)} className="dropdown-button">▼</button>
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
                  <li key={index} className="dropdown-item" onClick={() => handleTagSearch(tag.name)}>
                    {tag.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      </ul>

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
    </nav>
  );
}


export default Navigation;

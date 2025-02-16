import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUserTags, resetTags } from "../../redux/tags";
import { useModal } from "../../context/Modal";
import TagsModal from "../TagsModal/TagsModal";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setModalContent } = useModal();
  const sessionUser = useSelector((state) => state.session.user);
  const tags = useSelector((state) => state.tags.tags);
  const [searchNotebook, setSearchNotebook] = useState("");
  const [searchTag, setSearchTag] = useState("");
  const [showNotebooks, setShowNotebooks] = useState(false);
  const [showTags, setShowTags] = useState(false);
  useEffect(() => {
    if (sessionUser) {
      dispatch(fetchCurrentUserTags());
    } else {
      dispatch(resetTags());
    }
  }, [dispatch, sessionUser]);

  const handleTagSearch = (tagName) => {
    navigate(`/notes?tag=${tagName}`); 
};

  const filterItems = (list, searchTerm) => {
    if (!list || typeof list !== "object") return [];  
    const arrayList = Array.isArray(list) ? list : Object.values(list); 

    return arrayList.filter(
        (item) => item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
};


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
                {Object.values(tags).length > 0 ? (  
                  filterItems(Object.values(tags), searchTag).map((tag) => (
                    <li key={tag.id} className="dropdown-item" onClick={() => handleTagSearch(tag.name)}>
                      {tag.name}
                    </li>
                  ))
                ) : (
                  <li className="dropdown-item">No Tags Found</li>  
                )}
              </ul>
            </div>
          )}
        </li>

        <li className="nav-item-container">
          <NavLink
            to="#"
            className="nav-item"
            onClick={(e) => {
              e.preventDefault();
              setModalContent(<TagsModal />);
            }}
          >
            Tags
          </NavLink>
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
    </nav>
  );
}


export default Navigation;

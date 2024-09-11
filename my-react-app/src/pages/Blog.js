import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import arrowDown from './down.png';
import arrowUp from './up.png';
import Cookies from 'js-cookie';
import './Blog.css'; // Assurez-vous que le CSS est correctement importé

function Blogs() {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // État pour la barre de recherche
  const isLoggedIn = Cookies.get('isLoggedIn');
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const toggleDropdown = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  const urlDB = process.env.REACT_APP_DB_URL;

  if (!isLoggedIn) {
    navigate('/login'); // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  }

  // Utilisation de useEffect pour récupérer tous les tips depuis le backend
  useEffect(() => {
    fetch(`${urlDB}/api/blogs`)
      .then(response => response.json())
      .then(data => setBlogs(data.data)) // Récupérer tous les tips sans limite
      .catch(error => console.error('Error fetching tips:', error));
  }, []);

  // Utilisation de useEffect pour récupérer tous les tips depuis le backend
  useEffect(() => {
    fetch(`${urlDB}/api/users`)
      .then(response => response.json())
      .then(data => setUsers(data.data)) // Récupérer tous les tips sans limite
      .catch(error => console.error('Error fetching tips:', error));
  }, []);

  // Filtrer les blogs en fonction du terme de recherche
  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fonction pour obtenir le nom du coach par son ID
  const getCoachName = (coachId) => {
    const coach = users.find(user => user.id === coachId);
    return coach ? coach.name : 'Unknown Coach';
  };
  const getCoachSurname = (coachId) => {
    const coach = users.find(user => user.id === coachId);
    return coach ? coach.surname : 'Unknown Coach';
  };

  const handleDeleteBlog = async (blogId) => {
    try {
      const response = await fetch(`${urlDB}/api/deleteBlog/${blogId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setBlogs(blogs.filter(blog => blog.id !== blogId));
      } else {
        alert('Failed to delete customer' + `${blogId}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while deleting the customer');
    }
  };

  return (
    <div className="tips-container">
      <h1 className="title">Blogs for Coaches</h1>
      {/* Barre de recherche */}
      <div className="add" onClick={() => navigate("/AddBlog")}>
                <i className="pi pi-plus"></i>
              </div>
      <input
        type="text"
        className="search-bar"
        placeholder="Search tips by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Met à jour le terme de recherche
      />

      <div className="tips-list">
        {filteredBlogs.map((blog, index) => (
          <div key={index} className="tip-item">
            <div
              className="tip-header"
              onClick={() => toggleDropdown(index)}
            >
              <span className="tip-title">{blog.title}</span>
              <p onClick={() => handleDeleteBlog(blog.id)} style={{ color: 'red' }}>Delete</p>
              <div className='published'>Published by {getCoachName(blog.coach_id)} {getCoachSurname(blog.coach_id)}</div>
              <img
                src={openIndex === index ? arrowUp : arrowDown}
                alt="Toggle"
                className="arrow-icon"
              />
            </div>
            {openIndex === index && (
              <div className="tip-content">
                <p>{blog.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Blogs;

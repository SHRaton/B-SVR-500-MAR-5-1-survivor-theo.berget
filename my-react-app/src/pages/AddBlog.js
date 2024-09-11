import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import './AddBlog.css';  // Import the CSS file
import { GlobalContext } from '../GlobalContext'; // Import global context for email

const AddBlog = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [coaches, setCoaches] = useState([]);
  const [coachId, setCoachId] = useState(null);
  
  const { globalEmail, globalUserRole } = useContext(GlobalContext);  // Get global email and role from context
  const navigate = useNavigate();  // Initialize useNavigate

  useEffect(() => {
    // Fetch the list of coaches from /api/users
    fetch('http://localhost:5000/api/users')
      .then(response => response.json())
      .then(data => {
        const filteredCoaches = globalUserRole === 'Coach' 
          ? data.data.filter(coach => coach.email === globalEmail) 
          : data.data;
        // Assuming each coach object has an `id` property, extract the coach ID
        if (filteredCoaches.length > 0) {
          setCoachId(filteredCoaches[0].id); // Set the first match's ID
        }
      })
      .catch(error => console.error('Error fetching coaches:', error));
  }, [globalEmail, globalUserRole]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if we have a valid coach ID before proceeding
    if (!coachId) {
      alert('Error: Coach ID not found');
      return;
    }
    // Include coach_id in formData
    const blogData = {
      ...formData,
      coach_id: coachId,
    };
    try {
      const response = await fetch(`http://localhost:5000/api/addBlogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData),  // Send the formData along with coach_id
      });
      if (response.ok) {
        alert('Blog post created successfully');
        setFormData({
          title: '',
          content: '',
        });
        // Redirect to the blog list page after successful submission
        navigate('/blog');
      } else {
        console.log(response);
        alert('Failed to create blog post');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while creating the blog post');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="blog-form">
      <input
        type="text"
        name="title"
        placeholder="Blog Title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <textarea
        name="content"
        placeholder="Blog Description"
        value={formData.content}
        onChange={handleChange}
        rows="5"
        required
      />
      <button className='buttonForm' type="submit">Submit</button>
    </form>
  );
};

export default AddBlog;

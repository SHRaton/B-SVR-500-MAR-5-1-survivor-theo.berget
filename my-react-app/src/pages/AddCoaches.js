import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";  // Import useNavigate
import './AddCoaches.css';

const AddCoaches = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    birth_date: '',
    gender: '',
    work: 'Coach',
  });

  const navigate = useNavigate();  // Initialise useNavigate

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await fetch('http://localhost:5000/api/addCoach', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

      if (response.ok) {
        alert('Customer information saved successfully');
        setFormData({
          name: '',
          surname: '',
          email: '',
          birth_date: '',
          gender: '',
          work: 'Coach',
        });

        // Rediriger vers la page /customers après la soumission réussie
        navigate('/coaches');
      } else {
        alert('Failed to save user information');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while saving user information');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
      <input type="text" name="surname" placeholder="Surname" value={formData.surname} onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      <input type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} required />
      <select name="gender" value={formData.gender} onChange={handleChange} required>
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
      <button className='buttonForm' type="submit">Submit</button>
    </form>
  );
};

export default AddCoaches;

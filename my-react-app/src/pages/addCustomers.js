import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";  // Import useNavigate
import './addCustomers.css';

const UserForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    address: '',
    phone_number: '',
    birth_date: '',
    gender: '',
    astrological_sign: '',
    description: ''
  });

  const navigate = useNavigate();  // Initialise useNavigate

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const urlDB = process.env.REACT_APP_DB_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await fetch(`${urlDB}/api/addCustomer`, {
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
          address: '',
          phone_number: '',
          birth_date: '',
          gender: '',
          astrological_sign: '',
          description: ''
        });

        // Rediriger vers la page /customers après la soumission réussie
        navigate('/customers');
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
      <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
      <input type="text" name="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} required />
      <input type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} required />
      <select name="gender" value={formData.gender} onChange={handleChange} required>
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
      <input type="text" name="astrological_sign" placeholder="Astrological Sign" value={formData.astrological_sign} onChange={handleChange} required />
      <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required></textarea>
      <button className='buttonForm' type="submit">Submit</button>
    </form>
  );
};

export default UserForm;

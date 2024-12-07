import { useContext, useEffect, useState } from 'react';
import LoginContext from '../contexts/LoginContext';
import { useNavigate } from 'react-router-dom';

import { FormInput, FormHeader } from './Login';

const Register = () => {
  const { setState, setIsLogin, setRole, setUserId } = useContext(LoginContext);

  // State to manage form input values
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    setState('login');
  }, [setState]);

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleButtonClick = async (e) => {
    e.preventDefault();

    const { name, email, password } = formData;

    // Button loading state
    const button = e.target;
    button.classList.add('loading');

    // Input validation
    if (!name || !email || !password) {
      button.classList.remove('loading');
      return alert('Please enter all the fields');
    }

    try {
      const res = await fetch(
        'https://student-online-community.onrender.com/api/users/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
          credentials: 'include',
        }
      );
      const data = await res.json();
      button.classList.remove('loading');

      if (res.status === 201) {
        alert('User registered successfully');
        setIsLogin(true);
        setRole('user');
        setUserId(data._id);
        navigate('/channels');
      } else {
        alert(data.message);
      }
    } catch (error) {
      button.classList.remove('loading');
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="hero min-h-screen bg-primary text-neutral p-1 py-16">
      <div className="max-w-xl">
        <FormHeader title="Register for a new account" description="User Register Page" />
        <div className="card max-w-sm shadow-2xl bg-base-100 p-4 md:p-8 gap-4 mx-auto">
          <FormInput
            label="Name"
            name="name"
            placeholder="Elon Musk"
            value={formData.name}
            onChange={handleChange}
          />
          <FormInput
            label="Email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <FormInput
            label="Password"
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <div className="form-control mt-6">
            <button className="btn btn-secondary" onClick={handleButtonClick}>
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

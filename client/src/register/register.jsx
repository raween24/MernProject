import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './register.css'; // ⬅️ CORRECTION ICI : ajout du ./

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  const { name, email,  password, password2 } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== password2) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setIsLoading(true);

    const userData = {
      name: name,
      email: email,
      password: password
    };

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const res = await axios.post('http://localhost:8000/api/auth/register', userData, config);
      
      console.log('Inscription réussie:', res.data);
      alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      navigate('/login'); 

    } catch (err) {
      console.error('Erreur d inscription:', err);
      setError(err.response?.data?.message || 'Échec de l inscription. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Inscription</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={onSubmit} className="register-form">

          <div className="form-group">
            <label className="form-label">Nom Complet *</label>
            <input
              type="text"
              placeholder="Votre nom"
              name="name"
              value={name}
              onChange={onChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              placeholder="Votre email"
              name="email"
              value={email}
              onChange={onChange}
              className="form-input"
            />
          </div>



          <div className="form-group">
            <label className="form-label">Mot de Passe *</label>
            <input
              type="password"
              placeholder="Choisissez un mot de passe"
              name="password"
              value={password}
              onChange={onChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirmer le Mot de Passe *</label>
            <input
              type="password"
              placeholder="Confirmez votre mot de passe"
              name="password2"
              value={password2}
              onChange={onChange}
              required
              className="form-input"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="btn-primary"
          >
            {isLoading ? 'Création du compte...' : 'S inscrire'}
          </button>
        </form>

        <div className="login-link">
          Vous avez déjà un compte ? <Link to="/login">Connectez-vous ici</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
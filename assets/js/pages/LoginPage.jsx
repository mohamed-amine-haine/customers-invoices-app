import React, { useState, useContext } from "react";
import authAPI from "../services/AuthAPI";
import AuthContext from "../contexts/AuthContext";
import Field from "../forms/Field";

const LoginPage = ({ history }) => {
  const { setIsAuthenticated } = useContext(AuthContext);

  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState("");

  const handleChange = ({ currentTarget }) => {
    const { value, name } = currentTarget;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async event => {
    event.preventDefault();

    try {
      await authAPI.authenticate(credentials);
      setError("");
      setIsAuthenticated(true);
      history.replace("/customers");
    } catch (error) {
      console.log(error.response);
      setError("Aucun compte a ce mail ou informations non valide");
    }
  };

  return (
    <>
      <h1>Connexion a l'application</h1>
      <form onSubmit={handleSubmit}>
        <Field
          label="Adresse mail"
          type="email"
          name="username"
          onChange={handleChange}
          value={credentials.username}
          placeholder="Adresse mail de connexion"
          error={error}
        />
        <Field
          label="Mot de passe"
          type="password"
          name="password"
          onChange={handleChange}
          value={credentials.password}
          placeholder="password"
          error={error}
        />
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Se connecter
          </button>
        </div>
      </form>
    </>
  );
};

export default LoginPage;

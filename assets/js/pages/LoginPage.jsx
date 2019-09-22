import React, { useState, useContext } from "react";
import authAPI from "../services/AuthAPI";
import AuthContext from "../contexts/AuthContext";

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
        <div className="form-group">
          <label htmlFor="username">Adresse email</label>
          <input
            type="email"
            placeholder="adresse email de connexion"
            name="username"
            id="username"
            onChange={handleChange}
            value={credentials.username}
            className={"form-control" + (error && " is-invalid")}
          />
          {error && <p className="invalid-feedback">{error}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="password">mot de passe</label>
          <input
            type="password"
            placeholder="mot de passe"
            name="password"
            id="password"
            className="form-control"
            onChange={handleChange}
            value={credentials.password}
          />
        </div>
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

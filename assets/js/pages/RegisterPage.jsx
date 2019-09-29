import React, { useState } from "react";
import Field from "../forms/Field";
import { Link } from "react-router-dom";
import RegisterAPI from "../services/RegisterAPI";
import { toast } from "react-toastify";

const Register = ({ history }) => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: ""
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: ""
  });

  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setUser({
      ...user,
      [name]: value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      await RegisterAPI.register(user);
      setErrors("");
      toast.success("Inscription : réussie");
      history.replace("/login");
    } catch (error) {
      const { violations } = error.response.data;
      if (violations) {
        const apiErrors = {};
        violations.forEach(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message;
        });
        toast.error("Inscription : échouée");
        setErrors(apiErrors);
      }
    }
  };

  return (
    <>
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit}>
        <Field
          name="firstName"
          label="Nom"
          placeholder="Votre nom de famille"
          error={errors.firstName}
          onChange={handleChange}
          value={user.firstName}
        ></Field>
        <Field
          name="lastName"
          label="Prenom"
          placeholder="Votre prenom"
          error={errors.lastName}
          onChange={handleChange}
          value={user.lastName}
        ></Field>
        <Field
          name="email"
          label="Adresse mail"
          placeholder="Votre adresse mail"
          error={errors.email}
          type="email"
          onChange={handleChange}
          value={user.email}
        ></Field>
        <Field
          name="password"
          label="Mot de passe"
          placeholder="Votre mot de passe"
          error={errors.password}
          type="password"
          onChange={handleChange}
          value={user.password}
        ></Field>
        <Field
          name="passwordConfirm"
          label="Confimation du mot de passe"
          placeholder="Votre mot de passe"
          error={errors.passwordConfirm}
          type="password"
          onChange={handleChange}
          value={user.passwordConfirm}
        ></Field>
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Confirmer
          </button>
          <Link to="/login" className="btn btn-link">
            J'ai deja un compte
          </Link>
        </div>
      </form>
    </>
  );
};

export default Register;

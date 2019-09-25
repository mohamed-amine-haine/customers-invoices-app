import React, { useState, useEffect } from "react";
import Field from "../forms/Field";
import { Link } from "react-router-dom";
import CustomersAPI from "../services/CustomersAPI";
import { toast } from "react-toastify";
import FormLoader from "../loaders/FormLoader";

const CustomerPage = ({ match, history }) => {
  const { id = "new" } = match.params;

  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: ""
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: ""
  });

  const [edit, setEdit] = useState(isNaN(id) ? false : true);
  const [load, setLoad] = useState(edit ? true : false);
  const fetchCustomer = async id => {
    try {
      const { firstName, lastName, email, company } = await CustomersAPI.find(
        id
      );
      setCustomer({
        firstName,
        lastName,
        email,
        company: company || ""
      });
      setLoad(false);
    } catch (error) {
      toast.error("Chargement du client : échoué");
    }
  };

  useEffect(() => {
    if (edit) {
      fetchCustomer(id);
    } else if (id === "new") {
      setEdit(false);
    }
  }, id);

  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setCustomer({ ...customer, [name]: value });
  };

  const handleSubmit = async event => {
    event.preventDefault();

    try {
      if (edit) {
        await CustomersAPI.update(id, customer);
        setErrors("");
        toast.success("Modification du client : réussi");
      } else {
        await CustomersAPI.create(customer);
        toast.success("Création du client : réussi");
        history.replace("/customers");
      }
    } catch ({ response }) {
      console.log(response);
      const { violations } = response.data;
      if (violations) {
        const apiErrors = {};
        violations.forEach(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message;
        });
        setErrors(apiErrors);
      }
      edit
        ? toast.error("Modification de la facture : échoué")
        : toast.error("Création de la facture : échoué");
    }
  };

  return (
    <>
      {(!edit && <h2>Création d'un client</h2>) || (
        <h2>Modification d'un client</h2>
      )}
      {load && <FormLoader />}
      {!load && (
        <form onSubmit={handleSubmit}>
          <Field
            name="firstName"
            label="Prenom"
            placehold="Prenom du client"
            value={customer.firstName}
            onChange={handleChange}
            error={errors.firstName}
          />
          <Field
            name="lastName"
            label="Nom de famille"
            placehold="Nom de famille du client"
            value={customer.lastName}
            onChange={handleChange}
            error={errors.lastName}
          />
          <Field
            name="email"
            type="email"
            label="Adresse mail"
            placehold="Adresse mail du client"
            value={customer.email}
            onChange={handleChange}
            error={errors.email}
          />
          <Field
            name="company"
            label="Entreprise"
            placehold="Entreprise du client"
            value={customer.company}
            onChange={handleChange}
            error={errors.company}
          />

          <div className="form-group">
            <button type="submit" className="btn btn-success">
              Enregister
            </button>
            <Link to="/customers" className="btn btn-link">
              Retour a la liste
            </Link>
          </div>
        </form>
      )}
    </>
  );
};

export default CustomerPage;

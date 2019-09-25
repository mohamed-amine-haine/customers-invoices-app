import React, { useState, useEffect } from "react";
import Field from "../forms/Field";
import Select from "../forms/Select";
import { Link } from "react-router-dom";
import CustomersAPI from "../services/CustomersAPI";
import Axios from "axios";
import InvoicesAPI from "../services/InvoicesAPI";

const invoicePage = ({ history, match }) => {
  const { id = "new" } = match.params;

  const [edit, setEdit] = useState(false);

  const [invoice, setInvoice] = useState({
    customer: "",
    amount: "",
    status: "SENT"
  });

  const [errors, setErrors] = useState({
    customer: "",
    amount: "",
    status: ""
  });

  const [customers, setCustomers] = useState([]);

  const fetchCustomers = async () => {
    try {
      const data = await CustomersAPI.findAll();
      setCustomers(data);
      if (!invoice.customer) {
        setInvoice({ ...invoice, customer: data[0].id });
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  const fetchInvoice = async id => {
    try {
      const data = await InvoicesAPI.find(id);
      const { customer, status, amount } = data;
      console.log(data);
      setInvoice({ customer: customer.id, status, amount });
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (id !== "new" && !isNaN(id)) {
      fetchInvoice(id);
      setEdit(true);
    }
  }, [id]);

  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setInvoice({
      ...invoice,
      [name]: value
    });
  };

  const handleSubmit = async event => {
    event.preventDefault();

    try {
      const validatedInvoice = {
        ...invoice
        //amount: parseFloat(invoice.amount) || undefined
      };
      console.log(invoice);
      console.log(validatedInvoice);
      if (edit) {
        await InvoicesAPI.update(id, validatedInvoice);
      } else {
        await InvoicesAPI.create(validatedInvoice);
        history.replace("/invoices");
      }
    } catch (error) {
      console.log(error.response);
      const { violations } = error.response.data;
      if (violations) {
        const apiErrors = {};
        violations.forEach(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message;
        });
        setErrors(apiErrors);
      }
    }
  };

  return (
    <>
      {(!edit && <h2>Création d'une facture</h2>) || (
        <h2>modfication d'une facture</h2>
      )}
      <form onSubmit={handleSubmit}>
        <Select
          name="customer"
          label="Client"
          error={errors.customer}
          onChange={handleChange}
          value={invoice.customer}
        >
          {customers.map(({ id, firstName, lastName }) => (
            <option key={id} value={id}>
              {firstName} {lastName}
            </option>
          ))}
        </Select>
        <Select
          name="status"
          label="Status"
          error={errors.status}
          onChange={handleChange}
          value={invoice.status}
        >
          <option value="SENT">Envoyée</option>
          <option value="PAID">Payée</option>
          <option value="CANCELLED">Annulée</option>
        </Select>
        <Field
          name="amount"
          label="Montant"
          placeholder="Montant de la facture"
          error={errors.amount}
          type="text"
          onChange={handleChange}
          value={invoice.amount}
        />
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Enregister
          </button>
          <Link to="/invoices" className="btn btn-link">
            Retour aux factures
          </Link>
        </div>
      </form>
    </>
  );
};

export default invoicePage;

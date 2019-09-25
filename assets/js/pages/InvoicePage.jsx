import React, { useState, useEffect } from "react";
import Field from "../forms/Field";
import Select from "../forms/Select";
import { Link } from "react-router-dom";
import CustomersAPI from "../services/CustomersAPI";
import InvoicesAPI from "../services/InvoicesAPI";
import { toast } from "react-toastify";
import FormLoader from "../loaders/FormLoader";

const invoicePage = ({ history, match }) => {
  const { id = "new" } = match.params;

  const [edit, setEdit] = useState(isNaN(id) ? false : true);
  const [loadInvoice, setLoadInvoice] = useState(edit ? true : false);
  const [loadCustomers, setLoadCustomers] = useState(true);
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

  const [load, setLoad] = useState(true);

  useEffect(() => {
    if (edit) {
      if (!loadInvoice && !loadCustomers) setLoad(false);
    } else {
      if (!loadCustomers) setLoad(false);
    }
  }, [loadInvoice, loadCustomers]);

  const fetchCustomers = async () => {
    try {
      const data = await CustomersAPI.findAll();
      setCustomers(data);
      if (!invoice.customer) {
        setInvoice({ ...invoice, customer: data[0].id });
      }
      setLoadCustomers(false);
    } catch (error) {
      toast.error("Chargement des clients : échoué");
    }
  };

  const fetchInvoice = async id => {
    try {
      const data = await InvoicesAPI.find(id);
      const { customer, status, amount } = data;
      setInvoice({ customer: customer.id, status, amount });
      setLoadInvoice(false);
    } catch (error) {
      toast.error("Chargement de la facture : échoué");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (edit) {
      fetchInvoice(id);
    } else if (id === "new") {
      setEdit(false);
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
      if (edit) {
        await InvoicesAPI.update(id, validatedInvoice);
        toast.success("Modification de la facture : réussi");
      } else {
        await InvoicesAPI.create(validatedInvoice);
        toast.success("Création de la facture : réussi");
        history.replace("/invoices");
      }
    } catch (error) {
      const { violations } = error.response.data;
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
      {console.log(load)}
      {(!edit && <h2>Création d'une facture</h2>) || (
        <h2>modfication d'une facture</h2>
      )}
      {load && <FormLoader />}
      {!load && (
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
      )}
    </>
  );
};

export default invoicePage;

import React, { useState, useEffect } from "react";
import Pagination from "../composants/Pagination";
import InvoicesAPI from "../services/InvoicesAPI";
import Moment from "moment-js";

const STATUS_CLASSES = {
  PAID: "success",
  CANCELLED: "danger",
  SENT: "primary"
};

const STATUS_LABELS = {
  PAID: "Payée",
  CANCELLED: "annulée",
  SENT: "envoyée"
};

const InvoicesPage = props => {
  const [invoices, setInvoices] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  /* classic variables */
  const itemsPerPage = 10;

  const formatDate = str => Moment(str).format("DD/MM/YYYY");

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDelete = async id => {
    const lastInvoices = [...invoices];
    setInvoices(invoices.filter(invoice => invoice.id !== id));

    try {
      await InvoicesAPI.delete(id);
    } catch (error) {
      setInvoices(lastInvoices);
      console.log(error.response);
    }
  };

  const fetchInvoices = async () => {
    try {
      const data = await InvoicesAPI.findAll();
      setInvoices(data);
    } catch (error) {
      console.log(error.response);
    }
  };

  const handleSearchChange = ({ currentTarget }) => {
    setSearchValue(currentTarget.value);
    setCurrentPage(1);
  };

  /* change current page */
  const handlePageChange = page => setCurrentPage(page);

  const filteredInvoices = invoices.filter(
    i =>
      (
        i.customer.firstName.toLowerCase() +
        " " +
        i.customer.lastName.toLowerCase()
      ).includes(searchValue.toLowerCase()) ||
      STATUS_LABELS[i.status]
        .toLowerCase()
        .includes(searchValue.toLowerCase()) ||
      i.amount.toString().startsWith(searchValue.toLowerCase())
  );

  /* get paginated invoices */
  const paginatedInvoices = Pagination.getPaginatedItems(
    filteredInvoices,
    currentPage,
    itemsPerPage
  );

  return (
    <div>
      <div className="form-group">
        <input
          type="text"
          onChange={handleSearchChange}
          value={searchValue}
          className="form-control"
          placeholder="recherche"
        />
      </div>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Numero</th>
            <th>Client</th>
            <th className="text-center">Status</th>
            <th className="text-center">Date d'envoi</th>
            <th className="text-center">Montant</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {paginatedInvoices.map(invoice => (
            <tr key={invoice.id}>
              <td>{invoice.id}</td>
              <td>
                <a href="#">
                  {invoice.customer.firstName} {invoice.customer.lastName}
                </a>
              </td>
              <td className="text-center">
                <span
                  className={`badge badge-${STATUS_CLASSES[invoice.status]}`}
                >
                  {STATUS_LABELS[invoice.status]}
                </span>
              </td>
              <td className="text-center">{formatDate(invoice.sentAt)}</td>
              <td className="text-center">
                {invoice.amount.toLocaleString()} €
              </td>
              <td>
                <button className="btn btn-sm btn-primary mr-1">Editer</button>
                <button
                  onClick={() => handleDelete(invoice.id)}
                  className="btn btn-sm btn-danger"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredInvoices.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          length={filteredInvoices.length}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default InvoicesPage;

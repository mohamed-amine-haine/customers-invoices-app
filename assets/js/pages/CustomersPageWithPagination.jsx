import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../composants/Pagination";

const CustomersPageWithPagination = props => {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 10;

  useEffect(() => {
    axios
      .get(
        `http://localhost:8000/api/customers?pagination=true&count=${itemsPerPage}&page=${currentPage}`
      )
      .then(response => {
        setCustomers(response.data["hydra:member"]);
        setTotalItems(response.data["hydra:totalItems"]);
        setLoading(false);
      })
      .catch(error => console.log(error.response));
  }, [currentPage]);

  const handleDelete = id => {
    //console.log(id);

    const lastCustomers = [...customers];

    setCustomers(customers.filter(customer => customer.id !== id));

    axios
      .delete("http://localhost:8000/api/customers/" + id)
      .then(response => console.log("ok"))
      .catch(error => {
        setCustomers(lastCustomers);
        //console.log(error.response);
      });
  };

  const handlePageChange = page => {
    setCurrentPage(page);
    setLoading(page);
  };

  return (
    <div>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Id.</th>
            <th>Client</th>
            <th>Email</th>
            <th>Entreprise</th>
            <th className="text-center">n° Factures</th>
            <th className="text-center">Motant total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td>Chargement ...</td>
            </tr>
          )}
          {!loading &&
            customers.map(customer => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>
                  {customer.firstName} {customer.lastName}
                </td>
                <td>{customer.email}</td>
                <td>{customer.company}</td>
                <td className="text-center">
                  <span className="badge badge-primary">
                    {customer.invoices.length}
                  </span>
                </td>
                <td className="text-center">
                  {customer.totalAmount.toLocaleString()} €
                </td>
                <td>
                  <button
                    disabled={customer.invoices.length > 0}
                    onClick={() => handleDelete(customer.id)}
                    className="btn btn-sm btn-danger"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        length={totalItems}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default CustomersPageWithPagination;

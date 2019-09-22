import React, { useEffect, useState } from "react";
import Pagination from "../composants/Pagination";
import CustomersAPI from "../services/CustomersAPI";

const CustomersPage = props => {
  /* state variables */

  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");

  /* classic variables */
  const itemsPerPage = 10;

  /* get customers at the first call of page*/
  useEffect(() => {
    fetchCustomers();
  }, []);

  /* fetch customers */
  const fetchCustomers = async () => {
    try {
      const data = await CustomersAPI.findAll();
      setCustomers(data);
    } catch (error) {
      console.log(error.response);
    }
  };

  /* delete customer by id */
  const handleDelete = async id => {
    const lastCustomers = [...customers];
    setCustomers(customers.filter(customer => customer.id !== id));

    try {
      await CustomersAPI.delete(id);
    } catch (error) {
      setCustomers(lastCustomers);
      console.log(error.response);
    }
  };

  /* change current page */
  const handlePageChange = page => setCurrentPage(page);

  /* handle search value change */
  const handleSearchChange = ({ currentTarget }) => {
    setSearchValue(currentTarget.value);
    setCurrentPage(1);
  };

  /* get filtered customers */
  const filteredCustomers = customers.filter(
    c =>
      c.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
      c.lastName.toLowerCase().includes(searchValue.toLowerCase()) ||
      c.email.toLowerCase().includes(searchValue.toLowerCase()) ||
      (c.company && c.company.toLowerCase().includes(searchValue.toLowerCase()))
  );

  /* get paginated customers */
  const paginatedCustomers = Pagination.getPaginatedItems(
    filteredCustomers,
    currentPage,
    itemsPerPage
  );

  return (
    <div>
      <h2>Liste des clients</h2>
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
          {paginatedCustomers.map(customer => (
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
      {filteredCustomers.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          length={filteredCustomers.length}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default CustomersPage;

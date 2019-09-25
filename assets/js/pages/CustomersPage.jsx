import React, { useEffect, useState } from "react";
import Pagination from "../composants/Pagination";
import CustomersAPI from "../services/CustomersAPI";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import TableLoader from "../loaders/TableLoader";
const CustomersPage = props => {
  /* state variables */

  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [load, setLoad] = useState(true);

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
      setLoad(false);
    } catch (error) {
      toast.error("Chargement des clients : échoué");
    }
  };

  /* delete customer by id */
  const handleDelete = async id => {
    const lastCustomers = [...customers];
    setCustomers(customers.filter(customer => customer.id !== id));

    try {
      await CustomersAPI.delete(id);
      toast.success("Suppression du client : réussi");
    } catch (error) {
      setCustomers(lastCustomers);
      toast.error("Suppression du client : échoué");
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
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Liste des clients</h2>
        <Link to="/customers/new" className="btn btn-primary">
          Créer un client
        </Link>
      </div>
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
        {!load && (
          <tbody>
            {paginatedCustomers.map(customer => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>
                  <Link to={"customers/" + customer.id}>
                    {customer.firstName} {customer.lastName}
                  </Link>
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
        )}
      </table>
      {load && <TableLoader />}
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

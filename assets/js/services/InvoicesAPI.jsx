import Axios from "axios";
import { INVOICES_API } from "./Config";

function findAll() {
  return Axios.get(INVOICES_API).then(
    response => response.data["hydra:member"]
  );
}

function deleteInvoice(id) {
  return Axios.delete(INVOICES_API + "/" + id);
}

function create(invoice) {
  return Axios.post(INVOICES_API, {
    ...invoice,
    customer: `/api/customers/${invoice.customer}`
  });
}

function find(id) {
  return Axios.get(INVOICES_API + "/" + id).then(response => response.data);
}

function update(id, invoice) {
  return Axios.put(INVOICES_API + "/" + id, {
    ...invoice,
    customer: `/api/customers/${invoice.customer}`
  });
}

export default {
  findAll,
  delete: deleteInvoice,
  find,
  update,
  create
};

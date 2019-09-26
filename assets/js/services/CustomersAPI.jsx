import axios from "axios";
import Cache from "./Cache";
import { CUSTOMERS_API } from "./Config";

async function findAll() {
  const cachedCustomers = await Cache.get("customers");

  if (cachedCustomers) return cachedCustomers;

  return axios.get(CUSTOMERS_API).then(response => {
    const customers = response.data["hydra:member"];
    Cache.set("customers", customers);
    return customers;
  });
}

function create(customer) {
  return axios.post(CUSTOMERS_API, customer).then(async response => {
    const cachedCustomers = await Cache.get("customers");
    if (cachedCustomers) {
      Cache.set("customers", [...cachedCustomers, response.data]);
    }
    return response;
  });
}

async function find(id) {
  const cachedCustomer = await Cache.get("customer." + id);

  if (cachedCustomer) return cachedCustomer;

  return axios.get(CUSTOMERS_API + "/" + id).then(async response => {
    const customer = response.data;
    Cache.set("customer." + id, customer);
    return customer;
  });
}

function update(id, customer) {
  return axios.put(CUSTOMERS_API + "/" + id, customer).then(async response => {
    const cachedCustomer = await Cache.get("customer." + id);
    const cachedCustomers = await Cache.get("customers");

    if (cachedCustomer) {
      Cache.set("customer." + id, response.data);
    }

    if (cachedCustomers) {
      const index = cachedCustomers.findIndex(c => c.id === +id);
      const newCachedCustomer = response.data;

      cachedCustomers[index] = newCachedCustomer;
      Cache.set("customers", cachedCustomers);
    }
    return response;
  });
}

function deleteCustomer(id) {
  return axios.delete(CUSTOMERS_API + "/" + id).then(async response => {
    const cachedCustomer = await Cache.get("customer." + id);
    const cachedCustomers = await Cache.get("customers");

    if (cachedCustomer) Cache.invalidate("customers." + id);

    if (cachedCustomers)
      Cache.set("customers", cachedCustomers.filter(c => c.id !== id));
    return response;
  });
}

export default {
  findAll,
  create,
  find,
  update,
  delete: deleteCustomer
};

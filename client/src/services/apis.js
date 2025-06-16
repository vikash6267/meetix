
// const BASE_URL = process.env.REACT_APP_BASE_URL;

const BASE_URL = "https://meetix.mahitechnocrafts.in/api/v1"






export const subscription = {
  CREATE_PAYMENT: BASE_URL + "/subscription/create",
  VERIFY_PAYMENT: BASE_URL + "/subscription/payment-success",
  GET_ALL_SUB: BASE_URL + "/subscription/getAll",
}

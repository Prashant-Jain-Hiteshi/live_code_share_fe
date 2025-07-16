import axios from "axios";

const baseURL = "https://dummyjson.com";

export const apiServices = {
  fetchMyProduct: async () => {
    return await axios.get(`${baseURL}/products`);
  },
};

import axios from "axios";

const API_URL = "http://localhost:8080/api/public/products";

export const fetchProducts = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data.content;  // `content` zawiera listę produktów
    } catch (error) {
        console.error("Błąd przy pobieraniu produktów:", error);
        return [];
    }
};

export const fetchProductById = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/public/products/${id}`);
      return response.data;  // Zakładam, że odpowiedź zawiera produkt
    } catch (error) {
      console.error("Błąd przy pobieraniu produktu:", error);
      return null;
    }
  };
  
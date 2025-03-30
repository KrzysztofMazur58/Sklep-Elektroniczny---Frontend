import React, { useEffect, useState } from "react";
import { fetchProducts } from "../api"; // Funkcja do pobierania listy produktów
import { Link } from "react-router-dom"; // Link do szczegółów produktu
import axios from "axios";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    productName: "",
    description: "",
    price: "",
    quantity: "",
    categoryId: "", // Nowe pole na kategorię produktu
  });
  const [categories, setCategories] = useState([]); // Stan na listę kategorii
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // Funkcja do pobierania produktów
  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data); // Ustawienie listy produktów w stanie
    } catch (error) {
      console.error("Błąd przy pobieraniu produktów:", error);
    }
    setLoading(false);
  };

  // Załaduj produkty przy pierwszym renderowaniu komponentu
  useEffect(() => {
    loadProducts();
    fetchCategories(); // Załaduj kategorie produktów
  }, []);

  // Funkcja do pobierania dostępnych kategorii
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/public/categories");
      setCategories(response.data.content); // Załaduj kategorie do stanu (zakładając, że odpowiedź ma strukturę { content: [...] })
    } catch (error) {
      console.error("Błąd przy pobieraniu kategorii:", error);
    }
  };

  // Funkcja do odświeżania danych po kliknięciu przycisku
  const handleRefresh = () => {
    loadProducts(); // Ponowne załadowanie listy produktów
  };

  // Funkcja obsługująca zmiany w formularzu
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value,
    });
  };

  // Funkcja wysyłająca dane formularza
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Prosta walidacja formularza
    if (
      !newProduct.productName ||
      !newProduct.description ||
      !newProduct.price ||
      !newProduct.quantity ||
      !newProduct.categoryId
    ) {
      setFormError("Wszystkie pola są wymagane");
      return;
    }

    try {
      // Wysyłanie danych do backendu
      const response = await axios.post(
        `http://localhost:8080/api/admin/categories/${newProduct.categoryId}/product`,
        newProduct
      );
      console.log("Produkt dodany:", response.data);
      
      // Po udanym dodaniu produktu, załaduj listę produktów ponownie
      loadProducts();

      // Zresetuj formularz
      setNewProduct({
        productName: "",
        description: "",
        price: "",
        quantity: "",
        categoryId: "", // Zresetuj kategorię
      });
      setFormError("");
    } catch (error) {
      console.error("Błąd przy dodawaniu produktu:", error);
      setFormError("Wystąpił błąd przy dodawaniu produktu");
    }
  };

  return (
    <div>
      <h1>Lista produktów</h1>

      {/* Przycisk do odświeżenia listy produktów */}
      <button onClick={handleRefresh}>Odśwież listę</button>

      {loading && <p>Ładowanie...</p>}

      {/* Formularz do dodawania nowego produktu */}
      <h2>Dodaj nowy produkt</h2>
      {formError && <p style={{ color: "red" }}>{formError}</p>}

      <form onSubmit={handleFormSubmit}>
        <div>
          <label>Produkt:</label>
          <input
            type="text"
            name="productName"
            value={newProduct.productName}
            onChange={handleInputChange}
            placeholder="Nazwa produktu"
          />
        </div>
        <div>
          <label>Opis:</label>
          <input
            type="text"
            name="description"
            value={newProduct.description}
            onChange={handleInputChange}
            placeholder="Opis produktu"
          />
        </div>
        <div>
          <label>Cena:</label>
          <input
            type="number"
            name="price"
            value={newProduct.price}
            onChange={handleInputChange}
            placeholder="Cena"
          />
        </div>
        <div>
          <label>Ilość:</label>
          <input
            type="number"
            name="quantity"
            value={newProduct.quantity}
            onChange={handleInputChange}
            placeholder="Ilość"
          />
        </div>

        {/* Wybór kategorii produktu */}
        <div>
          <label>Kategoria:</label>
          <select
            name="categoryId"
            value={newProduct.categoryId}
            onChange={handleInputChange}
          >
            <option value="">Wybierz kategorię</option>
            {categories.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Dodaj produkt</button>
      </form>

      <ul>
        {products.map((product) => (
          <li key={product.productId}>
            <Link to={`/products/${product.productId}`}>{product.productName}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;


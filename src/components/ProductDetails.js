import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProductById } from "../api"; // Funkcja do pobierania produktu po ID

const ProductDetails = () => {
  const { id } = useParams(); // Pobieramy id produktu z URL
  const [product, setProduct] = useState(null);

  // Funkcja do pobierania danych o produkcie
  const loadProduct = async () => {
    const data = await fetchProductById(id);
    setProduct(data); // Ustawiamy dane o produkcie w stanie
  };

  // Załaduj dane przy pierwszym załadowaniu komponentu
  useEffect(() => {
    loadProduct();
  }, [id]); // Efekt uruchomi się, gdy id się zmieni

  // Funkcja do obsługi kliknięcia przycisku (odświeżenie danych)
  const handleRefresh = () => {
    loadProduct(); // Ponownie załaduj dane o produkcie
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div>
      <h2>Szczegóły produktu</h2>
      <p><strong>Nazwa:</strong> {product.productName}</p>
      <p><strong>Opis:</strong> {product.description}</p>
      <p><strong>Cena:</strong> {product.price} zł</p>
      <p><strong>Ilość:</strong> {product.quantity}</p>
      
      {/* Przycisk do odświeżania danych */}
      <button onClick={handleRefresh}>Odśwież dane</button>
    </div>
  );
};

export default ProductDetails;


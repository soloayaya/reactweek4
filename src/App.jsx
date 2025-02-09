import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import ProductPage from "./pages/ProductPage";
/* eslint-disable react/jsx-no-undef */

function App() {
  const [isAuth, setIsAuth] = useState(false);

  const getProducts = () => {
    console.log("Fetching products...");
  };

  return (
    <>
      {isAuth ? (
        <ProductPage setIsAuth={setIsAuth} />
      ) : (
        <LoginPage getProducts={getProducts} setIsAuth={setIsAuth} />
      )}
    </>
  );
}

export default App;

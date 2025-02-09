import { useEffect, useState } from "react";
import axios from "axios";

import Pagination from "../components/Pagination";
import ProductModal from "../components/ProductModal";
import DelProductModal from "../components/DelProductModal";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const defaultModalState = {
  imageUrl: "",
  title: "",
  category: "",
  unit: "",
  origin_price: "",
  price: "",
  description: "",
  content: "",
  is_enabled: 0,
  imagesUrl: [""],
};

function ProductPage() {
  const [products, setProducts] = useState([]);

  const [modalMode, setModalMode] = useState(null);

  const [isproductModalOpen, setIsproductModalOpen] = useState(false);

  const [isDelproductModalOpen, setIsDelproductModalOpen] = useState(false);

  if (!BASE_URL || !API_PATH) {
    console.error(
      "Environment variables are missing. Check VITE_BASE_URL and VITE_API_PATH."
    );
  }

  const getProducts = async (page = 1) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/v2/api/${API_PATH}/admin/products?page=${page}`
      );
      setProducts(res.data.products);
      setPageInfo(res.data.pagination);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("無法取得產品，請稍後再試");
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleOpenDelProductModal = (product) => {
    setTempProduct(product);

    setIsDelproductModalOpen(true);
  };

  const [tempProduct, setTempProduct] = useState(defaultModalState);

  const handleOpenProductModal = (mode, product) => {
    setModalMode(mode);

    switch (mode) {
      case "create":
        setTempProduct(defaultModalState);
        break;

      case "edit":
        setTempProduct(product);
        break;

      default:
        break;
    }

    setIsproductModalOpen(true);
  };

  const [pageInfo, setPageInfo] = useState({});
  const handlePageChange = (page) => {
    getProducts(page);
  };

  return (
    <>
      <div className="container py-5">
        <div className="row">
          <div className="col">
            <div className="d-flex justify-content-between">
              <h2>產品列表</h2>
              <button
                onClick={() => handleOpenProductModal("create")}
                type="button"
                className="btn btn-primary"
              >
                建立新的產品
              </button>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">產品名稱</th>
                  <th scope="col">原價</th>
                  <th scope="col">售價</th>
                  <th scope="col">是否啟用</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <th scope="row">{product.title}</th>
                    <td>{product.origin_price}</td>
                    <td>{product.price}</td>
                    <td>
                      {product.is_enabled ? (
                        <span className="text-success">啟用</span>
                      ) : (
                        <span>未啟用</span>
                      )}
                    </td>
                    <td>
                      <div className="btn-group">
                        <button
                          onClick={() =>
                            handleOpenProductModal("edit", product)
                          }
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                        >
                          編輯
                        </button>
                        <button
                          onClick={() => handleOpenDelProductModal(product)}
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                        >
                          刪除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Pagination
          pageInfo={pageInfo}
          handlePageChange={handlePageChange}
        ></Pagination>
      </div>

      <ProductModal
        tempProduct={tempProduct}
        getProducts={getProducts}
        modalMode={modalMode}
        isOpen={isproductModalOpen}
        setIsOpen={setIsproductModalOpen}
      ></ProductModal>

      <DelProductModal
        tempProduct={tempProduct}
        getProducts={getProducts}
        isOpen={isDelproductModalOpen}
        setIsOpen={setIsDelproductModalOpen}
      ></DelProductModal>
    </>
  );
}

export default ProductPage;

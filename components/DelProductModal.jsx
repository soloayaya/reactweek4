/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import axios from "axios";
import { Modal } from "bootstrap";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function DelProductModal({ getProducts, isOpen, setIsOpen, tempProduct = {} }) {
  const delproductModalRef = useRef(null);
  const modalInstance = useRef(null);

  // 初始化 Modal
  useEffect(() => {
    if (delproductModalRef.current) {
      modalInstance.current = new Modal(delproductModalRef.current, {
        backdrop: "static",
      });
    }

    return () => {
      if (modalInstance.current) {
        modalInstance.current.dispose(); // 卸載時清理 Modal
      }
    };
  }, []);

  // 監聽 `isOpen`，控制 Modal 顯示或隱藏
  useEffect(() => {
    if (modalInstance.current) {
      if (isOpen) {
        modalInstance.current.show();
      } else {
        modalInstance.current.hide();
      }
    }
  }, [isOpen]);

  // 關閉 Modal 的方法
  const handleCloseDelProductModal = () => {
    if (modalInstance.current) {
      modalInstance.current.hide();
    }
    setIsOpen(false);
  };

  // 刪除產品 API 請求
  const deleteProduct = async () => {
    try {
      await axios.delete(
        `${BASE_URL}/v2/api/${API_PATH}/admin/product/${tempProduct.id}`
      );
    } catch (error) {
      console.error("刪除產品失敗", error);
    }
  };

  // 按下「刪除」按鈕的處理
  const handleDeleteProduct = async () => {
    try {
      await deleteProduct();
      getProducts(); // 刪除成功後重新獲取產品列表
      handleCloseDelProductModal();
    } catch (error) {
      alert(`刪除產品失敗: ${error.message}`);
    }
  };

  return (
    <div
      ref={delproductModalRef}
      className="modal fade"
      id="delProductModal"
      tabIndex="-1"
      aria-hidden="true" // 提供無障礙支援
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5">刪除產品</h1>
            <button
              onClick={handleCloseDelProductModal}
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            你是否要刪除
            <span className="text-danger fw-bold">
              {tempProduct?.title || "（未選擇產品）"}
            </span>
          </div>

          <div className="modal-footer">
            <button
              onClick={handleCloseDelProductModal}
              type="button"
              className="btn btn-secondary"
            >
              取消
            </button>
            <button
              onClick={handleDeleteProduct}
              type="button"
              className="btn btn-danger"
            >
              刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DelProductModal;

import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function LoginPage({ getProducts, setIsAuth }) {
  const [account, setAccount] = useState({
    username: "admin@gmail.com",
    password: "admin",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccount((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("getProducts:", getProducts); // 檢查 getProducts 是否為函式
    if (typeof getProducts !== "function") {
      console.warn("getProducts 不是函式，請確認是否有正確傳入");
      return;
    }

    try {
      console.log("發送登入請求:", `${BASE_URL}/v2/admin/signin`, account);
      const res = await axios.post(`${BASE_URL}/v2/admin/signin`, account);
      console.log("登入成功，回應資料:", res.data);

      const { token, expired } = res.data;
      document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
      axios.defaults.headers.common["Authorization"] = token;

      setIsAuth(true);
      getProducts();
    } catch (error) {
      console.error("登入失敗，錯誤訊息：", error);
      alert(error.response?.data?.message || "登入失敗");
    }
  };

  const checkUserLogin = async () => {
    if (!BASE_URL) return;
    try {
      await axios.post(`${BASE_URL}/v2/api/user/check`);
      getProducts();
      setIsAuth(true);
    } catch (error) {
      console.warn("登入驗證失敗", error.response?.data?.message);
    }
  };

  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
      checkUserLogin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <h1 className="mb-5">請先登入</h1>
      <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
        <div className="form-floating mb-3">
          <input
            name="username"
            value={account.username}
            onChange={handleInputChange}
            type="email"
            className="form-control"
            id="username"
            placeholder="name@example.com"
            required
          />
          <label htmlFor="username">Email address</label>
        </div>
        <div className="form-floating">
          <input
            name="password"
            value={account.password}
            onChange={handleInputChange}
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
            required
          />
          <label htmlFor="password">Password</label>
        </div>
        <button className="btn btn-primary" type="submit">
          登入
        </button>
      </form>
      <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
    </div>
  );
}

LoginPage.propTypes = {
  getProducts: PropTypes.func.isRequired, // 確保 getProducts 是函式且為必要
  setIsAuth: PropTypes.func.isRequired, // 確保 setIsAuth 是函式且為必要
};

export default LoginPage;

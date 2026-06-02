import React, { useEffect, useState } from "react";
import { Plus, X, Trash2 } from "lucide-react";

const Products = () => {
  const [products, setProducts] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [productName, setProductName] = useState("");

  const [productType, setProductType] = useState("");

  // =========================
  // FETCH PRODUCTS
  // =========================

  const fetchProducts = async () => {
    try {
      const userId = localStorage.getItem("userId");

      const res = await fetch(
        `http://127.0.0.1:5000/products?user_id=${userId}`,
      );

      const data = await res.json();

      if (res.ok) {
        setProducts(data.products);
      } else {
        console.log(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // ADD PRODUCT
  // =========================

  const handleAddProduct = async () => {
    if (!productName || !productType) return;

    try {
      const res = await fetch("http://127.0.0.1:5000/products", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          user_id: localStorage.getItem("userId"),

          product_name: productName,

          product_type: productType,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // refresh products
        fetchProducts();

        // reset
        setProductName("");
        setProductType("");
        setShowModal(false);
      } else {
        console.log(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // DELETE PRODUCT
  // =========================

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/products/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setProducts((prev) => prev.filter((item) => item.id !== id));
      } else {
        console.log(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="px-6 py-8 pb-28">
      {/* HEADER */}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="app-page-title">Products</h1>
          <p className="app-page-subtitle">Manage your skincare products</p>
        </div>

        {/* ADD BUTTON */}
        <button
          onClick={() => setShowModal(true)}
          className="app-button app-button-primary w-14 h-14 rounded-2xl p-0"
        >
          <Plus size={30} />
        </button>
      </div>

      {/* PRODUCTS */}

      <div className="mt-10 space-y-4">
        {products.length > 0 ? (
          products.map((item, idx) => (
            <div
              key={idx}
              className="app-card p-5 flex justify-between items-start"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
                <p className="text-gray-500 mt-1">{item.type}</p>
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-400 hover:text-red-500 transition-all"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center mt-40 text-center">
            <div className="text-6xl mb-4">🧴</div>
            <h2 className="text-2xl font-semibold text-gray-700">No products added</h2>
            <p className="text-gray-400 mt-2 text-lg">Start building your skincare shelf</p>
          </div>
        )}
      </div>

      {/* MODAL */}

      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-6">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Add Product</h1>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-900">
                <X />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <input
                type="text"
                placeholder="Product name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="app-input"
              />

              <select
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className="app-input bg-white"
              >
                <option value="">Select Product Type</option>
                <option value="cleanser">Cleanser</option>
                <option value="sunscreen">Sunscreen</option>
                <option value="moisturizer">Moisturizer</option>
                <option value="serum">Serum</option>
                <option value="toner">Toner</option>
                <option value="face wash">Face Wash</option>
              </select>

              <button onClick={handleAddProduct} className="app-button app-button-primary w-full">
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;

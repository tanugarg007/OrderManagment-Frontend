import React, { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { Pencil, Plus, Trash2 } from "lucide-react";
import AddProductForm from "./AddProductForm";
import { getAuthorizationHeaders, getStoredSession } from "../auth.js";

const normalizeProduct = (item) => {
  const apiBaseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
  const image = String(item.image || "");
  const quantity = Number(item.quantity) || 0;
  const savedStatus = String(item.status || "").toLowerCase();

  const imageUrl =
    /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?/i.test(image)
      ? image.replace(
          /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?/i,
          apiBaseUrl
        )
      : /^(data:|blob:|https?:\/\/)/i.test(image)
      ? image
      : `${apiBaseUrl}${image.startsWith("/") ? image : `/${image}`}`;

  return {
    id: String(item._id || item.id || ""),
    name: String(item.name || ""),
    category: String(item.category || "Other"),
    price: Number(item.price) || 0,
    quantity,

    stock:
      quantity === 0
        ? "Out of Stock"
        : savedStatus.includes("low")
        ? "Low Stock"
        : "In Stock",

    image: imageUrl,
  };
};

function AdminProducts() {
  const { searchTerm = "" } = useOutletContext();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [deletingProductId, setDeletingProductId] = useState("");

  useEffect(() => {
    let isCurrent = true;

    const fetchProducts = async () => {
      setIsLoading(true);
      setLoadError("");

      try {
        const apiBaseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
        const response = await fetch(`${apiBaseUrl}/users/items`, {
          headers: getAuthorizationHeaders(),
        });

        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(
            payload.message ||
              `Products request failed (${response.status})`
          );
        }

        if (!Array.isArray(payload.items)) {
          throw new Error(
            "The products API returned an invalid response."
          );
        }

        if (isCurrent) {
          const normalizedProducts = payload.items.map(
            normalizeProduct
          );

          setProducts(normalizedProducts);
        }
      } catch (error) {
        if (isCurrent) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Something went wrong."
          );
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isCurrent = false;
    };
  }, [reloadKey]);

  const handleProductSubmit = async (formData, productId) => {
    try {
      const apiBaseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
      const response = await fetch(
        `${apiBaseUrl}/users/items${productId ? `/${encodeURIComponent(productId)}` : ""}`,
        {
        method: productId ? "PATCH" : "POST",
        headers: getAuthorizationHeaders(),
        body: formData,
        }




      );
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message || `Product could not be ${productId ? "updated" : "saved"} (${response.status}).`);
      }
      if (!payload.item) {
        throw new Error("The products API did not return the saved product.");
      }

      const savedProduct = normalizeProduct(payload.item);
      setProducts((currentProducts) =>
        productId
          ? currentProducts.map((product) =>
              product.id === productId ? savedProduct : product
            )
          : [savedProduct, ...currentProducts]
      );
    } catch (error) {
      throw error instanceof Error ? error : new Error("Could not save the product.");
    }
  };

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingProductId(product.id);
    setDeleteError("");

    try {
      const apiBaseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
      const response = await fetch(
        `${apiBaseUrl}/users/items/${encodeURIComponent(product.id)}`,
        {
          method: "DELETE",
          headers: getAuthorizationHeaders(),
        }
      );
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message || `Product could not be deleted (${response.status}).`);
      }

      setProducts((currentProducts) =>
        currentProducts.filter((currentProduct) => currentProduct.id !== product.id)
      );
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : "Could not delete the product."
      );
    } finally {
      setDeletingProductId("");
    }
  };

  const closeProductForm = () => {
    setIsProductFormOpen(false);
    setEditingProduct(null);
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const isInventoryRole = getStoredSession()?.user?.role === "inventory";

  const filteredProducts = products.filter((product) =>
    [
      product.name,
      product.category,
      String(product.price),
      String(product.quantity),
      product.stock,
    ].some((value) =>
      value.toLowerCase().includes(normalizedSearch)
    )
  );

  return (
    <section className="admin-section-page">

      <div className="admin-section-heading">
        <div>
          <span className="dashboard-label">
            CATALOG
          </span>

          <h1>Products</h1>

          <p>
            Your catalog at a glance. Keep stock healthy
            and products discoverable.
          </p>
        </div>

        {!isInventoryRole && (
          <Link className="section-back-link" to="/admin">
            Back to overview
          </Link>
        )}
      </div>

      <section className="premium-card section-table-card">

        <div className="premium-card-header">
          <div>
            <h2>All products</h2>

            <p>
              {products.length} products in your catalog
            </p>
          </div>
          <button
            className="add-product-btn"
            type="button"
            onClick={() => {
              setEditingProduct(null);
              setIsProductFormOpen(true);
            }}
          >
            <Plus size={16} />
            Add product
          </button>
        </div>

        <div className="section-table-scroll">

          <table className="section-data-table">

            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {isLoading && (
                <tr>
                  <td
                    className="section-empty"
                    colSpan={6}
                  >
                    Loading products...
                  </td>
                </tr>
              )}

              {!isLoading && loadError && (
                <tr>
                  <td
                    className="section-empty"
                    colSpan={6}
                  >
                    <div
                      className="admin-table-error"
                      role="alert"
                    >
                      <span>
                        Couldn't load products: {loadError}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setReloadKey((key) => key + 1)
                        }
                      >
                        Try again
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {!isLoading &&
                !loadError &&
                filteredProducts.map((product) => (
                  <tr key={product.id}>

                    <td>
                      <span className="product-table-name">

                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.name}
                          />
                        )}

                        {product.name}

                      </span>
                    </td>

                    <td>
                      {product.category}
                    </td>

                    <td>
                      ₹{product.price.toLocaleString("en-IN")}
                    </td>

                    <td>
                      {product.quantity}
                    </td>

                    <td>
                      {product.stock}
                    </td>

                    <td>
                      <div className="product-row-actions">
                        <button
                          className="product-row-action product-row-action-edit"
                          type="button"
                          aria-label={`Edit ${product.name}`}
                          onClick={() => {
                            setEditingProduct(product);
                            setIsProductFormOpen(true);
                          }}
                        >
                          <Pencil size={14} />
                          Edit
                        </button>
                        <button
                          className="product-row-action product-row-action-delete"
                          type="button"
                          aria-label={`Delete ${product.name}`}
                          disabled={deletingProductId === product.id}
                          onClick={() => handleDeleteProduct(product)}
                        >
                          <Trash2 size={14} />
                          {deletingProductId === product.id ? "Deleting…" : "Delete"}
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}

              {!isLoading && !loadError && deleteError && (
                <tr>
                  <td className="section-empty" colSpan={6}>
                    <div className="admin-table-error" role="alert">
                      <span>{deleteError}</span>
                      <button type="button" onClick={() => setDeleteError("")}>
                        Dismiss
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {!isLoading &&
                !loadError &&
                filteredProducts.length === 0 && (
                  <tr>
                    <td
                      className="section-empty"
                      colSpan={6}
                    >
                      {products.length === 0
                        ? "No products have been added yet."
                        : `No products match "${searchTerm}".`}
                    </td>
                  </tr>
                )}

            </tbody>

          </table>

        </div>

      </section>

      {isProductFormOpen && (
        <AddProductForm
          key={editingProduct?.id || "new-product"}
          product={editingProduct}
          onClose={closeProductForm}
          onSubmit={handleProductSubmit}
        />
      )}

    </section>
  );
}

export default AdminProducts;
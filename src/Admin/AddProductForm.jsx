import React, { useEffect, useState } from "react";
import {
  ImagePlus,
  Package,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";

const emptyProductForm = {
  name: "",
  category: "",
  price: "",
  quantity: "",
  image: "",
  imageFile: null,
};

function AddProductForm({ product = null, onClose, onSubmit }) {
  const [productForm, setProductForm] = useState(() => ({
    ...emptyProductForm,
    name: product?.name || "",
    category: product?.category || "",
    price: product ? String(product.price) : "",
    quantity: product ? String(product.quantity) : "",
    image: product?.image || "",
  }));
  const [productImageError, setProductImageError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && !isSaving) onClose();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isSaving, onClose]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/bmp",
    ];
    if (!allowedTypes.includes(file.type)) {
      setProductImageError("Choose a JPG, PNG, GIF, WEBP, or BMP image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setProductImageError("Image size must be 5 MB or less.");
      return;
    }

    setProductImageError("");
    setSubmitError("");
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProductForm((currentForm) => ({
          ...currentForm,
          image: reader.result,
          imageFile: file,
        }));
      } else {
        setProductImageError("Could not read this image. Please select another file.");
      }
    };
    reader.onerror = () => {
      setProductImageError("Could not read this image. Please select another file.");
    };
    reader.readAsDataURL(file);
  };

  const handleProductSubmit = async (event) => {
    event.preventDefault();
    if (productImageError) return;
    if (!product && !productForm.imageFile) {
      setProductImageError("Add a product image before saving.");
      return;
    }

    const quantity = Number(productForm.quantity);
    const status = quantity === 0
      ? "Out of Stock"
      : quantity <= 5
        ? "Low Stock"
        : "In Stock";
    const formData = new FormData();
    formData.append("name", productForm.name.trim());
    formData.append("price", String(Number(productForm.price)));
    formData.append("quantity", String(quantity));
    formData.append("category", productForm.category);
    formData.append("status", status);
    if (productForm.imageFile) {
      formData.append("image", productForm.imageFile);
    }

    setIsSaving(true);
    setSubmitError("");

    try {
      await onSubmit(formData, product?.id);
      onClose();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Could not save the product."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="product-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSaving) onClose();
      }}
    >
      <section
        className="product-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-product-title"
      >
        <div className="product-modal-header">
          <div className="product-modal-heading-icon"><Package size={19} /></div>
          <div>
            <span className="dashboard-label">PRODUCT CATALOG</span>
            <h2 id="add-product-title">{product ? "Edit product" : "Add a product"}</h2>
            <p>{product ? "Update product details or replace its image." : "Add product details and an image to your store."}</p>
          </div>
          <button
            className="product-modal-close"
            type="button"
            onClick={onClose}
            aria-label="Close add product form"
            disabled={isSaving}
          >
            <X size={18} />
          </button>
        </div>

        <form className="product-form" onSubmit={handleProductSubmit}>
          <label className="product-form-field product-form-field-full">
            <span>Product name <b>*</b></span>
            <input
              autoFocus
              required
              maxLength={100}
              value={productForm.name}
              onChange={(event) => setProductForm({ ...productForm, name: event.target.value })}
              placeholder="e.g. Studio Wireless Headphones"
            />
          </label>

          <label className="product-form-field">
            <span>Category <b>*</b></span>
            <select
              required
              value={productForm.category}
              onChange={(event) => setProductForm({ ...productForm, category: event.target.value })}
            >
              <option value="" disabled>Select category</option>
              <option>Fashion</option>
              <option>Sports</option>
              <option>Beauty</option>
              <option>Electronics</option>
              <option>Books</option>
              <option>Home & Kitchen</option>
            </select>
          </label>

          <label className="product-form-field">
            <span>Price <b>*</b></span>
            <div className="product-input-prefix">
              <span>₹</span>
              <input
                required
                type="number"
                min="0.01"
                step="0.01"
                value={productForm.price}
                onChange={(event) => setProductForm({ ...productForm, price: event.target.value })}
                placeholder="0.00"
              />
            </div>
          </label>

          <label className="product-form-field">
            <span>Inventory <b>*</b></span>
            <input
              required
              type="number"
              min="0"
              step="1"
              value={productForm.quantity}
              onChange={(event) => setProductForm({ ...productForm, quantity: event.target.value })}
              placeholder="Quantity in stock"
            />
          </label>

          <div className="product-form-field product-form-field-full">
            <span>Product image <b>*</b></span>
            <div className={`product-image-picker ${productForm.image ? "has-image" : ""}`}>
              {productForm.image ? (
                <>
                  <img className="product-image-preview" src={productForm.image} alt="Product preview" />
                  <div className="product-image-details">
                    <strong>{productForm.imageFile ? "Image ready to upload" : "Current product image"}</strong>
                    <span>{productForm.imageFile ? "Preview your product image before saving" : "You can keep this image or replace it"}</span>
                  </div>
                  <label className="product-image-change" htmlFor="product-image-upload">Replace</label>
                  {(!product || productForm.imageFile) && (
                    <button
                      className="product-image-remove"
                      type="button"
                      aria-label="Remove product image"
                      onClick={() => {
                        setProductForm((currentForm) => ({
                          ...currentForm,
                          image: product?.image || "",
                          imageFile: null,
                        }));
                        setProductImageError("");
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </>
              ) : (
                <label className="product-image-dropzone" htmlFor="product-image-upload">
                  <span className="product-image-upload-icon"><ImagePlus size={21} /></span>
                  <strong>Click to upload a product image</strong>
                  <span>JPG, PNG, GIF, WEBP or BMP · Max 5 MB</span>
                  <span className="product-image-browse"><Upload size={13} /> Choose image</span>
                </label>
              )}
              <input
                id="product-image-upload"
                className="product-image-input"
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp,image/bmp"
                onChange={handleImageChange}
                aria-label="Upload product image"
              />
            </div>
            {productImageError && (
              <span className="product-image-error" role="alert">{productImageError}</span>
            )}
          </div>

          {submitError && (
            <div className="product-submit-error" role="alert">{submitError}</div>
          )}

          <div className="product-form-footer">
            <span><b>*</b> Required fields</span>
            <div>
              <button className="product-cancel-btn" type="button" onClick={onClose} disabled={isSaving}>
                Cancel
              </button>
              <button className="product-save-btn" type="submit" disabled={isSaving}>
                {!isSaving && <Plus size={15} />}
                {isSaving ? "Saving…" : product ? "Save changes" : "Add product"}
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}

export default AddProductForm;

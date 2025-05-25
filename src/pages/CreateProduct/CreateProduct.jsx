import React, { useState } from "react";
import FloatingLabelInput from "../../components/Input/FloatingLabelInput";

export default function CreateProduct() {
  const [formData, setFormData] = useState({
    productName: "",
    productDescription: "",
    productPrice: "",
    discount: "",
    discountType: "percentage",
    offerEndsAt: "",
    stock: "",
    category: "",
    subCategory: "",
    brand: "",
    seller: "",
    isReturnable: false,
    returnDays: "",
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === "checkbox" ? checked : value,
    });
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) setThumbnail(file);
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length) setImages(files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));

    if (thumbnail) data.append("productThumbnail", thumbnail);
    images.forEach((img) => data.append("productImages", img));

    console.log("Submitting form...");
    // You can send `data` using fetch or axios
    // Example:
    // await axios.post('/api/products', data);
  };

  return (
    <section>
      <form
        onSubmit={handleSubmit}
        className="p-6 max-w-2xl mx-auto space-y-6"
        encType="multipart/form-data"
      >
        <FloatingLabelInput
          id="productName"
          type="text"
          value={formData.productName}
          onChange={handleChange}
        >
          Product Name
        </FloatingLabelInput>

        <FloatingLabelInput
          id="productDescription"
          type="text"
          value={formData.productDescription}
          onChange={handleChange}
        >
          Product Description
        </FloatingLabelInput>

        <FloatingLabelInput
          id="productPrice"
          type="number"
          value={formData.productPrice}
          onChange={handleChange}
        >
          Price
        </FloatingLabelInput>

        <FloatingLabelInput
          id="discount"
          type="number"
          value={formData.discount}
          onChange={handleChange}
        >
          Discount
        </FloatingLabelInput>

        <div className="mt-6">
          <label className="block text-sm font-medium mb-1 text-gray-600">
            Discount Type
          </label>
          <select
            id="discountType"
            value={formData.discountType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="percentage">Percentage</option>
            <option value="flat">Flat</option>
          </select>
        </div>

        <FloatingLabelInput
          id="offerEndsAt"
          type="datetime-local"
          value={formData.offerEndsAt}
          onChange={handleChange}
        >
          Offer Ends At
        </FloatingLabelInput>

        <FloatingLabelInput
          id="stock"
          type="number"
          value={formData.stock}
          onChange={handleChange}
        >
          Stock
        </FloatingLabelInput>

        <FloatingLabelInput
          id="category"
          type="text"
          value={formData.category}
          onChange={handleChange}
        >
          Category
        </FloatingLabelInput>

        <FloatingLabelInput
          id="subCategory"
          type="text"
          value={formData.subCategory}
          onChange={handleChange}
        >
          Subcategory
        </FloatingLabelInput>

        <FloatingLabelInput
          id="brand"
          type="text"
          value={formData.brand}
          onChange={handleChange}
        >
          Brand
        </FloatingLabelInput>

        <FloatingLabelInput
          id="seller"
          type="text"
          value={formData.seller}
          onChange={handleChange}
        >
          Seller
        </FloatingLabelInput>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isReturnable"
            checked={formData.isReturnable}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="isReturnable" className="text-sm text-gray-700">
            Is Returnable?
          </label>
        </div>

        {formData.isReturnable && (
          <FloatingLabelInput
            id="returnDays"
            type="number"
            value={formData.returnDays}
            onChange={handleChange}
          >
            Return Days
          </FloatingLabelInput>
        )}

        {/* === Thumbnail Upload === */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-600">
            Product Thumbnail
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            className="block w-full text-sm text-gray-700 border rounded-xl cursor-pointer focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
          {thumbnail && (
            <p className="mt-1 text-sm text-gray-500">
              Selected: {thumbnail.name}
            </p>
          )}
        </div>

        {/* === Multiple Images Upload === */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-600">
            Product Images
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImagesChange}
            className="block w-full text-sm text-gray-700 border rounded-xl cursor-pointer focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
          {images.length > 0 && (
            <ul className="mt-2 space-y-1 text-sm text-gray-500">
              {images.map((img, i) => (
                <li key={i}>{img.name}</li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-xl hover:bg-blue-700"
        >
          Create Product
        </button>
      </form>
    </section>
  );
}

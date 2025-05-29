import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FloatingLabelInput from "../../components/Input/FloatingLabelInput";

export default function CreateProduct() {
  const [form, setForm] = useState({
    // Required fields
    slug: "",
    productName: "",
    productDescription: "",
    productPrice: "",
    discount: "0",
    discountType: "percentage",
    category: "",
    subCategory: "",
    brand: "",
    manufacturer: "",
    modelNumber: "",
    sku: "",
    barcode: "",
    stock: "0",
    seller: "",
    isReturnable: true,
    returnDays: "30",
    warrantyType: "manufacturer",
    warrantyPeriod: "365",
    // Optional fields
    productNameLocal: "",
    productDescriptionLocal: "",
    originalPrice: "",
    offerEndsAt: "",
    addedBy: "",
    minOrderQuantity: "1",
    maxOrderQuantity: "100",
    metaTitle: "",
    metaDescription: "",
    tags: "",
    metaKeywords: "",
    // Flags
    isFeatured: false,
    isHot: false,
    isNewArrival: false,
    isBestSeller: false,
    isRecommended: false,
    isTrending: false,
    notAvailable: false,
    isOutOfStock: false,
  });

  const [files, setFiles] = useState({
    thumbnail: null,
    images: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value, type, checked, files: inputFiles } = e.target;

    if (type === "file") {
      if (id === "thumbnail") {
        setFiles((prev) => ({ ...prev, thumbnail: inputFiles[0] }));
      } else if (id === "images") {
        setFiles((prev) => ({ ...prev, images: Array.from(inputFiles) }));
      }
    } else if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [id]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [id]: value }));
    }
  };

  const validateForm = () => {
    const requiredFields = [
      "slug",
      "productName",
      "productDescription",
      "productPrice",
      "category",
      "subCategory",
      "brand",
      "manufacturer",
      "modelNumber",
      "sku",
      "barcode",
      "stock",
      "seller",
      "returnDays",
      "warrantyType",
      "warrantyPeriod",
    ];

    for (const field of requiredFields) {
      if (!form[field] || form[field].toString().trim() === "") {
        toast.error(
          `${field.replace(/([A-Z])/g, " $1").toLowerCase()} is required`
        );
        return false;
      }
    }

    if (!files.thumbnail) {
      toast.error("Product thumbnail is required");
      return false;
    }

    if (parseFloat(form.productPrice) <= 0) {
      toast.error("Product price must be greater than 0");
      return false;
    }

    if (parseInt(form.stock) < 0) {
      toast.error("Stock cannot be negative");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Append basic fields
      Object.keys(form).forEach((key) => {
        if (form[key] !== "" && form[key] !== null && form[key] !== undefined) {
          formData.append(key, form[key]);
        }
      });

      // Append files
      if (files.thumbnail) {
        formData.append("thumbnail", files.thumbnail);
      }

      files.images.forEach((file) => {
        formData.append("images", file);
      });

      // Convert arrays to JSON strings
      const tagsArray = form.tags
        ? form.tags
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t)
        : [];
      const metaKeywordsArray = form.metaKeywords
        ? form.metaKeywords
            .split(",")
            .map((k) => k.trim())
            .filter((k) => k)
        : [];

      formData.append("tags", JSON.stringify(tagsArray));
      formData.append("metaKeywords", JSON.stringify(metaKeywordsArray));
      formData.append("specification", JSON.stringify([]));
      formData.append("variants", JSON.stringify([]));
      formData.append("customFields", JSON.stringify([]));
      formData.append("shippingInfo", JSON.stringify({}));

      const response = await fetch(
        "https://whispering-pages-backend.vercel.app:5000/api/products",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create product");
      }

      const result = await response.json();

      if (result.success) {
        toast.success("Product created successfully!");
        // Reset form
        setForm({
          slug: "",
          productName: "",
          productDescription: "",
          productPrice: "",
          discount: "0",
          discountType: "percentage",
          category: "",
          subCategory: "",
          brand: "",
          manufacturer: "",
          modelNumber: "",
          sku: "",
          barcode: "",
          stock: "0",
          seller: "",
          isReturnable: true,
          returnDays: "30",
          warrantyType: "manufacturer",
          warrantyPeriod: "365",
          productNameLocal: "",
          productDescriptionLocal: "",
          originalPrice: "",
          offerEndsAt: "",
          addedBy: "",
          minOrderQuantity: "1",
          maxOrderQuantity: "100",
          metaTitle: "",
          metaDescription: "",
          tags: "",
          metaKeywords: "",
          isFeatured: false,
          isHot: false,
          isNewArrival: false,
          isBestSeller: false,
          isRecommended: false,
          isTrending: false,
          notAvailable: false,
          isOutOfStock: false,
        });
        setFiles({ thumbnail: null, images: [] });
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error(
        error.message || "Something went wrong while creating the product."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="container p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-libre-baskerville mb-8 text-center">
        Create New Product
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4 text-secondary">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FloatingLabelInput
              id="slug"
              value={form.slug}
              onChange={handleChange}
              className="col-span-full"
              required
            >
              Unique Slug
            </FloatingLabelInput>
            <FloatingLabelInput
              id="productName"
              value={form.productName}
              onChange={handleChange}
              required
            >
              Product Name
            </FloatingLabelInput>
            <FloatingLabelInput
              id="productNameLocal"
              value={form.productNameLocal}
              onChange={handleChange}
            >
              Product Name (Local)
            </FloatingLabelInput>
            <FloatingLabelInput
              id="productDescription"
              value={form.productDescription}
              onChange={handleChange}
              className="col-span-full"
              required
            >
              Product Description
            </FloatingLabelInput>
            <FloatingLabelInput
              id="productDescriptionLocal"
              value={form.productDescriptionLocal}
              onChange={handleChange}
              className="col-span-full"
            >
              Product Description (Local)
            </FloatingLabelInput>
          </div>
        </div>

        {/* Pricing Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4 text-secondary">
            Pricing & Discount
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FloatingLabelInput
              id="productPrice"
              type="number"
              step="0.01"
              value={form.productPrice}
              onChange={handleChange}
              required
            >
              Product Price
            </FloatingLabelInput>
            <FloatingLabelInput
              id="originalPrice"
              type="number"
              step="0.01"
              value={form.originalPrice}
              onChange={handleChange}
            >
              Original Price
            </FloatingLabelInput>
            <FloatingLabelInput
              id="discount"
              type="number"
              step="0.01"
              value={form.discount}
              onChange={handleChange}
              required
            >
              Discount
            </FloatingLabelInput>
            <select
              id="discountType"
              value={form.discountType}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-primary"
              required
            >
              <option value="percentage">Percentage</option>
              <option value="flat">Flat Amount</option>
            </select>
            <FloatingLabelInput
              id="offerEndsAt"
              type="datetime-local"
              value={form.offerEndsAt}
              onChange={handleChange}
            >
              Offer Ends At
            </FloatingLabelInput>
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4 text-secondary">
            Product Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FloatingLabelInput
              id="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              Category
            </FloatingLabelInput>
            <FloatingLabelInput
              id="subCategory"
              value={form.subCategory}
              onChange={handleChange}
              required
            >
              Subcategory
            </FloatingLabelInput>
            <FloatingLabelInput
              id="brand"
              value={form.brand}
              onChange={handleChange}
              required
            >
              Brand
            </FloatingLabelInput>
            <FloatingLabelInput
              id="manufacturer"
              value={form.manufacturer}
              onChange={handleChange}
              required
            >
              Manufacturer
            </FloatingLabelInput>
            <FloatingLabelInput
              id="modelNumber"
              value={form.modelNumber}
              onChange={handleChange}
              required
            >
              Model Number
            </FloatingLabelInput>
            <FloatingLabelInput
              id="sku"
              value={form.sku}
              onChange={handleChange}
              required
            >
              SKU
            </FloatingLabelInput>
            <FloatingLabelInput
              id="barcode"
              value={form.barcode}
              onChange={handleChange}
              required
            >
              Barcode
            </FloatingLabelInput>
            <FloatingLabelInput
              id="stock"
              type="number"
              value={form.stock}
              onChange={handleChange}
              required
            >
              Stock Quantity
            </FloatingLabelInput>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4 text-secondary">
            Product Images
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail Image <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                id="thumbnail"
                accept="image/*"
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images (Multiple)
              </label>
              <input
                type="file"
                id="images"
                accept="image/*"
                multiple
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Seller & Business Info */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4 text-secondary">
            Business Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FloatingLabelInput
              id="seller"
              value={form.seller}
              onChange={handleChange}
              required
            >
              Seller
            </FloatingLabelInput>
            <FloatingLabelInput
              id="addedBy"
              value={form.addedBy}
              onChange={handleChange}
            >
              Added By
            </FloatingLabelInput>
            <FloatingLabelInput
              id="minOrderQuantity"
              type="number"
              value={form.minOrderQuantity}
              onChange={handleChange}
            >
              Min Order Quantity
            </FloatingLabelInput>
            <FloatingLabelInput
              id="maxOrderQuantity"
              type="number"
              value={form.maxOrderQuantity}
              onChange={handleChange}
            >
              Max Order Quantity
            </FloatingLabelInput>
          </div>
        </div>

        {/* Return & Warranty */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4 text-secondary">
            Return & Warranty
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isReturnable"
                checked={form.isReturnable}
                onChange={handleChange}
                className="w-4 h-4 text-primary"
              />
              <label htmlFor="isReturnable">Is Returnable</label>
            </div>
            <FloatingLabelInput
              id="returnDays"
              type="number"
              value={form.returnDays}
              onChange={handleChange}
              required
            >
              Return Days
            </FloatingLabelInput>
            <select
              id="warrantyType"
              value={form.warrantyType}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-primary"
              required
            >
              <option value="manufacturer">Manufacturer Warranty</option>
              <option value="seller">Seller Warranty</option>
            </select>
            <FloatingLabelInput
              id="warrantyPeriod"
              type="number"
              value={form.warrantyPeriod}
              onChange={handleChange}
              required
            >
              Warranty Period (Days)
            </FloatingLabelInput>
          </div>
        </div>

        {/* SEO Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4 text-secondary">
            SEO Information
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <FloatingLabelInput
              id="metaTitle"
              value={form.metaTitle}
              onChange={handleChange}
            >
              Meta Title
            </FloatingLabelInput>
            <FloatingLabelInput
              id="metaDescription"
              value={form.metaDescription}
              onChange={handleChange}
            >
              Meta Description
            </FloatingLabelInput>
            <FloatingLabelInput
              id="tags"
              value={form.tags}
              onChange={handleChange}
            >
              Tags (comma separated)
            </FloatingLabelInput>
            <FloatingLabelInput
              id="metaKeywords"
              value={form.metaKeywords}
              onChange={handleChange}
            >
              Meta Keywords (comma separated)
            </FloatingLabelInput>
          </div>
        </div>

        {/* Product Flags */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4 text-secondary">
            Product Flags
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "isFeatured",
              "isHot",
              "isNewArrival",
              "isBestSeller",
              "isRecommended",
              "isTrending",
              "notAvailable",
              "isOutOfStock",
            ].map((flag) => (
              <label key={flag} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={flag}
                  checked={form[flag]}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm capitalize">
                  {flag.replace(/([A-Z])/g, " $1").toLowerCase()}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating Product..." : "Create Product"}
          </button>
        </div>
      </form>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </section>
  );
}

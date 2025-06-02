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

  const [tags, setTags] = useState([]);
  const [metaKeywords, setMetaKeywords] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [currentKeyword, setCurrentKeyword] = useState("");

  // Add image preview states
  const [imagePreview, setImagePreview] = useState({
    isOpen: false,
    imageSrc: null,
    imageName: null,
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

  // Add image handling functions
  const removeThumbnail = () => {
    setFiles((prev) => ({ ...prev, thumbnail: null }));
    // Reset the input
    const thumbnailInput = document.getElementById("thumbnail");
    if (thumbnailInput) thumbnailInput.value = "";
  };

  const removeImage = (indexToRemove) => {
    setFiles((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
    // Reset the input to allow re-selecting the same files
    const imagesInput = document.getElementById("images");
    if (imagesInput) imagesInput.value = "";
  };

  const openImagePreview = (file, name) => {
    const imageUrl = URL.createObjectURL(file);
    setImagePreview({
      isOpen: true,
      imageSrc: imageUrl,
      imageName: name,
    });
  };

  const closeImagePreview = () => {
    if (imagePreview.imageSrc) {
      URL.revokeObjectURL(imagePreview.imageSrc);
    }
    setImagePreview({
      isOpen: false,
      imageSrc: null,
      imageName: null,
    });
  };

  const handleTagKeyPress = (e) => {
    if (e.key === "Enter" && currentTag.trim()) {
      e.preventDefault();
      if (!tags.includes(currentTag.trim())) {
        setTags([...tags, currentTag.trim()]);
      }
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeywordKeyPress = (e) => {
    if (e.key === "Enter" && currentKeyword.trim()) {
      e.preventDefault();
      if (!metaKeywords.includes(currentKeyword.trim())) {
        setMetaKeywords([...metaKeywords, currentKeyword.trim()]);
      }
      setCurrentKeyword("");
    }
  };

  const removeKeyword = (keywordToRemove) => {
    setMetaKeywords(
      metaKeywords.filter((keyword) => keyword !== keywordToRemove)
    );
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

      // Append tags and metaKeywords as JSON arrays
      formData.append("tags", JSON.stringify(tags));
      formData.append("metaKeywords", JSON.stringify(metaKeywords));
      formData.append("specification", JSON.stringify([]));
      formData.append("variants", JSON.stringify([]));
      formData.append("customFields", JSON.stringify([]));
      formData.append("shippingInfo", JSON.stringify({}));

      const response = await fetch(
        // "http://localhost:5000/api/products", // Change to your backend URL
        "https://whispering-pages-backend.vercel.app/api/products",
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
        // Reset form including tags and keywords
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
        setTags([]);
        setMetaKeywords([]);
        setCurrentTag("");
        setCurrentKeyword("");
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
              {/* Thumbnail Preview */}
              {files.thumbnail && (
                <div className="mt-2">
                  <div className="inline-flex items-center bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg">
                    <button
                      type="button"
                      onClick={() =>
                        openImagePreview(files.thumbnail, files.thumbnail.name)
                      }
                      className="text-blue-600 hover:text-blue-800 text-sm mr-2 underline"
                    >
                      {files.thumbnail.name}
                    </button>
                    <button
                      type="button"
                      onClick={removeThumbnail}
                      className="text-red-500 hover:text-red-700 ml-2"
                      title="Remove thumbnail"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
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
              {/* Images Preview */}
              {files.images.length > 0 && (
                <div className="mt-2 space-y-2">
                  {files.images.map((file, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center bg-green-50 border border-green-200 px-3 py-2 rounded-lg mr-2 mb-2"
                    >
                      <button
                        type="button"
                        onClick={() => openImagePreview(file, file.name)}
                        className="text-green-600 hover:text-green-800 text-sm mr-2 underline"
                      >
                        {file.name}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="text-red-500 hover:text-red-700 ml-2"
                        title="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
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

            {/* Tags Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={handleTagKeyPress}
                placeholder="Enter a tag and press Enter"
                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-primary"
              />
              {/* Tags Preview */}
              {tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-primary hover:text-primary/70"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Meta Keywords Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Keywords
              </label>
              <input
                type="text"
                value={currentKeyword}
                onChange={(e) => setCurrentKeyword(e.target.value)}
                onKeyPress={handleKeywordKeyPress}
                placeholder="Enter a keyword and press Enter"
                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-primary"
              />
              {/* Keywords Preview */}
              {metaKeywords.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {metaKeywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => removeKeyword(keyword)}
                        className="ml-2 text-secondary hover:text-secondary/70"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
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

      {/* Image Preview Dialog */}
      {imagePreview.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full overflow-hidden">
            {/* Dialog Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {imagePreview.imageName}
              </h3>
              <button
                onClick={closeImagePreview}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Dialog Content */}
            <div className="p-4 flex justify-center">
              <img
                src={imagePreview.imageSrc}
                alt={imagePreview.imageName}
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>

            {/* Dialog Footer */}
            <div className="flex justify-end p-4 border-t">
              <button
                onClick={closeImagePreview}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FloatingLabelInput from "../../components/Input/FloatingLabelInput";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
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

  const [files, setFiles] = useState({
    thumbnail: null,
    images: [],
  });

  const [currentImages, setCurrentImages] = useState({
    thumbnail: "",
    images: [],
  });

  const [tags, setTags] = useState([]);
  const [metaKeywords, setMetaKeywords] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [currentKeyword, setCurrentKeyword] = useState("");

  const [imagePreview, setImagePreview] = useState({
    isOpen: false,
    imageSrc: null,
    imageName: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL =
    "https://whispering-pages-backend.vercel.app/api/products";

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) throw new Error("Failed to fetch product");

        const product = await response.json();

        // Format date for datetime-local input
        const formatDate = (dateString) => {
          if (!dateString) return "";
          const date = new Date(dateString);
          return date.toISOString().slice(0, 16);
        };

        // Populate form with product data
        setForm({
          slug: product.slug || "",
          productName: product.productName || "",
          productDescription: product.productDescription || "",
          productPrice: product.productPrice?.toString() || "",
          discount: product.discount?.toString() || "0",
          discountType: product.discountType || "percentage",
          category: product.category || "",
          subCategory: product.subCategory || "",
          brand: product.brand || "",
          manufacturer: product.manufacturer || "",
          modelNumber: product.modelNumber || "",
          sku: product.sku || "",
          barcode: product.barcode || "",
          stock: product.stock?.toString() || "0",
          seller: product.seller || "",
          isReturnable: product.isReturnable || false,
          returnDays: product.returnDays?.toString() || "30",
          warrantyType: product.warrantyType || "manufacturer",
          warrantyPeriod: product.warrantyPeriod?.toString() || "365",
          productNameLocal: product.productNameLocal || "",
          productDescriptionLocal: product.productDescriptionLocal || "",
          originalPrice: product.originalPrice?.toString() || "",
          offerEndsAt: formatDate(product.offerEndsAt) || "",
          addedBy: product.addedBy || "",
          minOrderQuantity: product.minOrderQuantity?.toString() || "1",
          maxOrderQuantity: product.maxOrderQuantity?.toString() || "100",
          metaTitle: product.metaTitle || "",
          metaDescription: product.metaDescription || "",
          isFeatured: product.isFeatured || false,
          isHot: product.isHot || false,
          isNewArrival: product.isNewArrival || false,
          isBestSeller: product.isBestSeller || false,
          isRecommended: product.isRecommended || false,
          isTrending: product.isTrending || false,
          notAvailable: product.notAvailable || false,
          isOutOfStock: product.isOutOfStock || false,
        });

        // Set current images
        setCurrentImages({
          thumbnail: product.productThumbnail || "",
          images: product.productImages ? product.productImages.split(",") : [],
        });

        // Set tags and keywords
        setTags(product.tags || []);
        setMetaKeywords(product.metaKeywords || []);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to fetch product details");
        navigate("/products");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, navigate]);

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

  const removeThumbnail = () => {
    setFiles((prev) => ({ ...prev, thumbnail: null }));
    const thumbnailInput = document.getElementById("thumbnail");
    if (thumbnailInput) thumbnailInput.value = "";
  };

  const removeImage = (indexToRemove) => {
    setFiles((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
    const imagesInput = document.getElementById("images");
    if (imagesInput) imagesInput.value = "";
  };

  const openImagePreview = (file, name) => {
    let imageUrl;
    if (typeof file === "string") {
      imageUrl = file; // Already a URL
    } else {
      imageUrl = URL.createObjectURL(file);
    }

    setImagePreview({
      isOpen: true,
      imageSrc: imageUrl,
      imageName: name,
    });
  };

  const closeImagePreview = () => {
    if (imagePreview.imageSrc && !imagePreview.imageSrc.startsWith("http")) {
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

      // Append files only if new files are selected
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

      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error response:", errorData);
        throw new Error(errorData.message || "Failed to update product");
      }

      const result = await response.json();
      console.log("Success response:", result);

      if (result.success) {
        toast.success("Product updated successfully!");
        setTimeout(() => {
          navigate("/products");
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(
        error.message || "Something went wrong while updating the product."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/products")}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-libre-baskerville text-secondary">
              Edit Product
            </h1>
            <p className="text-gray-600">
              Update product information and details
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
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
        <div className="bg-white p-6 rounded-xl shadow-sm border">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Type <span className="text-red-500">*</span>
              </label>
              <select
                id="discountType"
                value={form.discountType}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                required
              >
                <option value="percentage">Percentage</option>
                <option value="flat">Flat Amount</option>
              </select>
            </div>
            <FloatingLabelInput
              id="offerEndsAt"
              type="datetime-local"
              value={form.offerEndsAt}
              onChange={handleChange}
              className="col-span-full"
            >
              Offer Ends At
            </FloatingLabelInput>
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
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

        {/* Images Section with Current Images Display */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-xl font-semibold mb-4 text-secondary">
            Product Images
          </h2>

          {/* Current Images Display */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Current Images</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Current Thumbnail */}
              {currentImages.thumbnail && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Thumbnail
                  </label>
                  <div className="relative inline-block">
                    <img
                      src={currentImages.thumbnail}
                      alt="Current thumbnail"
                      className="w-32 h-32 object-cover rounded-lg border cursor-pointer"
                      onClick={() =>
                        openImagePreview(
                          currentImages.thumbnail,
                          "Current Thumbnail"
                        )
                      }
                    />
                  </div>
                </div>
              )}

              {/* Current Images */}
              {currentImages.images.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Images
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {currentImages.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Current image ${index + 1}`}
                        className="w-24 h-24 object-cover rounded-lg border cursor-pointer"
                        onClick={() =>
                          openImagePreview(image, `Current Image ${index + 1}`)
                        }
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* New Images Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Thumbnail Image (Optional)
              </label>
              <input
                type="file"
                id="thumbnail"
                accept="image/*"
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-primary"
              />
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
                New Product Images (Optional)
              </label>
              <input
                type="file"
                id="images"
                accept="image/*"
                multiple
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-primary"
              />
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

          <p className="text-sm text-gray-500 mt-2">
            * Leave empty to keep current images. Upload new images to replace
            them.
          </p>
        </div>

        {/* Seller & Business Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
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
        <div className="bg-white p-6 rounded-xl shadow-sm border">
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
              <label
                htmlFor="isReturnable"
                className="text-sm font-medium text-gray-700"
              >
                Is Returnable
              </label>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Warranty Type <span className="text-red-500">*</span>
              </label>
              <select
                id="warrantyType"
                value={form.warrantyType}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                required
              >
                <option value="manufacturer">Manufacturer Warranty</option>
                <option value="seller">Seller Warranty</option>
              </select>
            </div>
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
        <div className="bg-white p-6 rounded-xl shadow-sm border">
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
                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
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
                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
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
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-xl font-semibold mb-4 text-secondary">
            Product Flags
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { key: "isFeatured", label: "Is Featured" },
              { key: "isHot", label: "Is Hot" },
              { key: "isNewArrival", label: "Is New Arrival" },
              { key: "isBestSeller", label: "Is Best Seller" },
              { key: "isRecommended", label: "Is Recommended" },
              { key: "isTrending", label: "Is Trending" },
              { key: "notAvailable", label: "Not Available" },
              { key: "isOutOfStock", label: "Is Out Of Stock" },
            ].map((flag) => (
              <label key={flag.key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={flag.key}
                  checked={form[flag.key]}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm font-medium text-gray-700">
                  {flag.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Updating Product..." : "Update Product"}
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
            <div className="p-4 flex justify-center">
              <img
                src={imagePreview.imageSrc}
                alt={imagePreview.imageName}
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>
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
    </div>
  );
}

import React, { useState } from "react";
import FloatingLabelInput from "../../components/Input/FloatingLabelInput";

export default function CreateProduct() {
  const [form, setForm] = useState({});

  const handleChange = (e) => {
    const { id, value, type, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      // Append primitive and string fields
      data.append("slug", form.slug);
      data.append("productName", form.productName);
      data.append("productNameLocal", form.productNameLocal || "");
      data.append("productDescription", form.productDescription);
      data.append(
        "productDescriptionLocal",
        form.productDescriptionLocal || ""
      );
      data.append("productPrice", form.productPrice);
      data.append("originalPrice", form.originalPrice || "");
      data.append("discount", form.discount);
      data.append("discountType", form.discountType);
      data.append("offerEndsAt", form.offerEndsAt || "");
      data.append("category", form.category);
      data.append("subCategory", form.subCategory);
      data.append("brand", form.brand);
      data.append("manufacturer", form.manufacturer);
      data.append("modelNumber", form.modelNumber);
      data.append("sku", form.sku);
      data.append("barcode", form.barcode);
      data.append("stock", form.stock);
      data.append("minOrderQuantity", form.minOrderQuantity);
      data.append("maxOrderQuantity", form.maxOrderQuantity);
      data.append("seller", form.seller);
      data.append("addedBy", form.addedBy || "");
      data.append("isReturnable", form.isReturnable);
      data.append("returnDays", form.returnDays);
      data.append("warrantyType", form.warrantyType);
      data.append("warrantyPeriod", form.warrantyPeriod);

      // Boolean Flags
      data.append("isFeatured", form.isFeatured);
      data.append("isHot", form.isHot);
      data.append("isNewArrival", form.isNewArrival);
      data.append("isBestSeller", form.isBestSeller);
      data.append("isRecommended", form.isRecommended);
      data.append("isTrending", form.isTrending);
      data.append("notAvailable", form.notAvailable);
      data.append("isOutOfStock", form.isOutOfStock);

      // Shipping Info (nested)
      // data.append("shippingInfo.weight", form.shippingInfo.weight);
      // data.append("shippingInfo.length", form.shippingInfo.length);
      // data.append("shippingInfo.width", form.shippingInfo.width);
      // data.append("shippingInfo.height", form.shippingInfo.height);
      // data.append("shippingInfo.shippingFrom", form.shippingInfo.shippingFrom);
      // data.append("shippingInfo.shippingTo", form.shippingInfo.shippingTo);
      // data.append("shippingInfo.shippingCost", form.shippingInfo.shippingCost);

      // Append tags & metaKeywords (arrays)
      const tagsArray = Array.isArray(form.tags)
        ? form.tags
        : typeof form.tags === "string" && form.tags.length > 0
        ? form.tags.split(",").map((t) => t.trim())
        : [];
      tagsArray.forEach((tag, i) => data.append(`tags[${i}]`, tag));

      const metaKeywordsArray = Array.isArray(form.metaKeywords)
        ? form.metaKeywords
        : typeof form.metaKeywords === "string" && form.metaKeywords.length > 0
        ? form.metaKeywords.split(",").map((kw) => kw.trim())
        : [];
      metaKeywordsArray.forEach((kw, i) =>
        data.append(`metaKeywords[${i}]`, kw)
      );

      // Append specifications and variants (arrays of objects)
      data.append("specification", JSON.stringify(form.specification));
      data.append("variants", JSON.stringify(form.variants));
      data.append("customFields", JSON.stringify(form.customFields));

      // File inputs
      if (form.productThumbnail) {
        data.append("productThumbnail", form.productThumbnail);
      }

      if (form.productImages && form.productImages.length > 0) {
        Array.from(form.productImages).forEach((file) => {
          data.append("productImages", file);
        });
      }

      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        body: data,
      });

      if (!res.ok) throw new Error("Failed to submit product");

      const result = await res.json();
      console.log("Product submitted:", result);
      alert("Product created successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong while creating the product.");
    }
  };

  return (
    <section className=" container p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-libre-baskerville mb-6  text-nowrap flex justify-center items-center">
        Create New Product
      </h1>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Product Name,Description & Price  */}
        <FloatingLabelInput
          id="slug"
          onChange={handleChange}
          className="col-span-full"
        >
          Unique Name
        </FloatingLabelInput>
        <FloatingLabelInput id="productName" onChange={handleChange}>
          Product Name
        </FloatingLabelInput>
        <FloatingLabelInput id="productNameLocal" onChange={handleChange}>
          Product Name (Local)
        </FloatingLabelInput>
        <FloatingLabelInput id="productDescription" onChange={handleChange}>
          Product Description
        </FloatingLabelInput>
        <FloatingLabelInput
          id="productDescriptionLocal"
          onChange={handleChange}
        >
          Product Description (Local)
        </FloatingLabelInput>
        <FloatingLabelInput
          id="productPrice"
          type="number"
          onChange={handleChange}
        >
          Product Price
        </FloatingLabelInput>
        <FloatingLabelInput
          id="originalPrice"
          type="number"
          onChange={handleChange}
        >
          Original Price
        </FloatingLabelInput>
        {/* Discount */}
        <FloatingLabelInput id="discount" type="number" onChange={handleChange}>
          Discount
        </FloatingLabelInput>
        <select
          id="discountType"
          onChange={handleChange}
          className="border p-2 rounded-xl"
        >
          <option value="">Select Discount Type</option>
          <option value="percentage">Percentage</option>
          <option value="flat">Flat</option>
        </select>
        {/* Offer Ends At */}
        <FloatingLabelInput
          id="offerEndsAt"
          type="datetime-local"
          onChange={handleChange}
        >
          Offer Ends At
        </FloatingLabelInput>
        {/* Category  */}
        <FloatingLabelInput id="category" onChange={handleChange}>
          Category
        </FloatingLabelInput>
        <FloatingLabelInput id="subCategory" onChange={handleChange}>
          Subcategory
        </FloatingLabelInput>
        {/* Brand & Manufacturer */}
        <FloatingLabelInput id="brand" onChange={handleChange}>
          Brand
        </FloatingLabelInput>
        <FloatingLabelInput id="manufacturer" onChange={handleChange}>
          Manufacturer
        </FloatingLabelInput>
        <FloatingLabelInput id="modelNumber" onChange={handleChange}>
          Model Number
        </FloatingLabelInput>
        <FloatingLabelInput id="sku" onChange={handleChange}>
          SKU
        </FloatingLabelInput>
        <FloatingLabelInput id="barcode" onChange={handleChange}>
          Barcode
        </FloatingLabelInput>
        {/* Seller & Stock Info */}
        <FloatingLabelInput id="stock" type="number" onChange={handleChange}>
          Stock
        </FloatingLabelInput>{" "}
        <FloatingLabelInput id="seller" onChange={handleChange}>
          Seller
        </FloatingLabelInput>{" "}
        <FloatingLabelInput id="addedBy" onChange={handleChange}>
          Added By
        </FloatingLabelInput>
        <FloatingLabelInput id="isReturnable" onChange={handleChange}>
          Returnable (true/false)
        </FloatingLabelInput>
        <FloatingLabelInput
          id="returnDays"
          type="number"
          onChange={handleChange}
        >
          Return Days
        </FloatingLabelInput>
        <select
          id="warrantyType"
          onChange={handleChange}
          className="border p-2 rounded-xl"
        >
          <option value="">Select Warranty Type</option>
          <option value="manufacturer">Manufacturer</option>
          <option value="seller">Seller</option>
        </select>
        <FloatingLabelInput
          id="warrantyPeriod"
          type="number"
          onChange={handleChange}
        >
          Warranty Period (Days)
        </FloatingLabelInput>
        <FloatingLabelInput
          id="minOrderQuantity"
          type="number"
          onChange={handleChange}
        >
          Min Order Quantity
        </FloatingLabelInput>
        <FloatingLabelInput
          id="maxOrderQuantity"
          type="number"
          onChange={handleChange}
        >
          Max Order Quantity
        </FloatingLabelInput>
        {/* SEO & Meta Info */}
        <FloatingLabelInput id="tags" onChange={handleChange}>
          Tags (comma separated)
        </FloatingLabelInput>
        <FloatingLabelInput id="metaTitle" onChange={handleChange}>
          Meta Title
        </FloatingLabelInput>
        <FloatingLabelInput id="metaDescription" onChange={handleChange}>
          Meta Description
        </FloatingLabelInput>
        <FloatingLabelInput id="metaKeywords" onChange={handleChange}>
          Meta Keywords (comma separated)
        </FloatingLabelInput>
        {/* Shipping Info */}
        {/* <FloatingLabelInput id="weight" type="number" onChange={handleChange}>
          Weight
        </FloatingLabelInput> */}
        {/* <FloatingLabelInput id="length" type="number" onChange={handleChange}>
          Length
        </FloatingLabelInput>
        <FloatingLabelInput id="width" type="number" onChange={handleChange}>
          Width
        </FloatingLabelInput>
        <FloatingLabelInput id="height" type="number" onChange={handleChange}>
          Height
        </FloatingLabelInput>
        <FloatingLabelInput id="shippingFrom" onChange={handleChange}>
          Shipping From
        </FloatingLabelInput>
        <FloatingLabelInput id="shippingTo" onChange={handleChange}>
          Shipping To
        </FloatingLabelInput>
        <FloatingLabelInput
          id="shippingCost"
          type="number"
          onChange={handleChange}
        >
          Shipping Cost
        </FloatingLabelInput> */}
        {/* Flags */}
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
              checked={!!form[flag]}
              onChange={handleChange}
              className="mr-2"
            />
            {flag}
          </label>
        ))}
        <button
          type="submit"
          className="col-span-full mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl"
        >
          Create Product
        </button>
      </form>
    </section>
  );
}

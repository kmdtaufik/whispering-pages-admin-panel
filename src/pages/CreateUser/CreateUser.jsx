import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FloatingLabelInput from "../../components/Input/FloatingLabelInput";
import { Navigate } from "react-router";

export default function CreateUser() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [files, setFiles] = useState({
    avatar: null,
  });

  // Add image preview states
  const [imagePreview, setImagePreview] = useState({
    isOpen: false,
    imageSrc: null,
    imageName: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value, type, files: inputFiles } = e.target;

    if (type === "file") {
      if (id === "avatar") {
        setFiles((prev) => ({ ...prev, avatar: inputFiles[0] }));
      }
    } else {
      setForm((prev) => ({ ...prev, [id]: value }));
    }
  };

  // Add image handling functions
  const removeAvatar = () => {
    setFiles((prev) => ({ ...prev, avatar: null }));
    // Reset the input
    const avatarInput = document.getElementById("avatar");
    if (avatarInput) avatarInput.value = "";
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

  const validateForm = () => {
    const requiredFields = ["name", "email", "password"];

    for (const field of requiredFields) {
      if (!form[field] || form[field].toString().trim() === "") {
        toast.error(
          `${field.replace(/([A-Z])/g, " $1").toLowerCase()} is required`
        );
        return false;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    // Password validation
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
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

      // Append avatar file
      if (files.avatar) {
        formData.append("avatar", files.avatar);
      }

      const response = await fetch(
        "https://whispering-pages-backend.vercel.app/api/users",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error response:", errorData);
        throw new Error(errorData.message || "Failed to create user");
      }

      const result = await response.json();
      console.log("Success response:", result);

      if (result.success) {
        toast.success("User created successfully!");
        // Reset form
        setForm({
          name: "",
          email: "",
          password: "",
          role: "user",
        });
        setFiles({ avatar: null });
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error(
        error.message || "Something went wrong while creating the user."
      );
    } finally {
      setIsSubmitting(false);
      // Navigate("/dashboard");
    }
  };

  return (
    <section className="container p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-libre-baskerville mb-8 text-center">
        Create New User
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4 text-secondary">
            User Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FloatingLabelInput
              id="name"
              value={form.name}
              onChange={handleChange}
              required
            >
              Full Name
            </FloatingLabelInput>
            <FloatingLabelInput
              id="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            >
              Email Address
            </FloatingLabelInput>
            <FloatingLabelInput
              id="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            >
              Password
            </FloatingLabelInput>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                value={form.role}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-primary"
                required
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
              </select>
            </div>
          </div>
        </div>

        {/* Avatar */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4 text-secondary">
            Profile Picture
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Avatar Image
            </label>
            <input
              type="file"
              id="avatar"
              accept="image/*"
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-primary"
            />
            {/* Avatar Preview */}
            {files.avatar && (
              <div className="mt-2">
                <div className="inline-flex items-center bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg">
                  <button
                    type="button"
                    onClick={() =>
                      openImagePreview(files.avatar, files.avatar.name)
                    }
                    className="text-blue-600 hover:text-blue-800 text-sm mr-2 underline"
                  >
                    {files.avatar.name}
                  </button>
                  <button
                    type="button"
                    onClick={removeAvatar}
                    className="text-red-500 hover:text-red-700 ml-2"
                    title="Remove avatar"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating User..." : "Create User"}
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

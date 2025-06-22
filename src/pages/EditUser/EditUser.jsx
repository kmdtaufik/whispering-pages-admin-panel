import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FloatingLabelInput from "../../components/Input/FloatingLabelInput";

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [files, setFiles] = useState({
    avatar: null,
  });

  const [currentAvatar, setCurrentAvatar] = useState("");

  const [imagePreview, setImagePreview] = useState({
    isOpen: false,
    imageSrc: null,
    imageName: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = "https://whispering-pages-backend.vercel.app/api/users";

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) throw new Error("Failed to fetch user");

        const data = await response.json();
        const user = data.user;
        // Populate form with user data
        setForm({
          name: user.name || "",
          email: user.email || "",
          password: "", // Don't populate password for security
          role: user.role || "viewer",
        });

        // Set current avatar
        setCurrentAvatar(user.avatar || "");
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Failed to fetch user details");
        navigate("/users");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id, navigate]);

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

  const removeAvatar = () => {
    setFiles((prev) => ({ ...prev, avatar: null }));
    const avatarInput = document.getElementById("avatar");
    if (avatarInput) avatarInput.value = "";
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

  const validateForm = () => {
    const requiredFields = ["name", "email"];

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

    // Password validation (only if password is provided)
    if (form.password && form.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
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

      // Append basic fields (exclude password if empty)
      Object.keys(form).forEach((key) => {
        if (key === "password") {
          // Only include password if it's not empty
          if (form[key] && form[key].trim() !== "") {
            formData.append(key, form[key]);
          }
        } else if (
          form[key] !== "" &&
          form[key] !== null &&
          form[key] !== undefined
        ) {
          formData.append(key, form[key]);
        }
      });

      // Append avatar file only if new file is selected
      if (files.avatar) {
        formData.append("avatar", files.avatar);
      }

      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error response:", errorData);
        throw new Error(errorData.message || "Failed to update user");
      }

      const result = await response.json();
      console.log("Success response:", result);

      if (result.success) {
        toast.success("User updated successfully!");
        setTimeout(() => {
          navigate("/users/list");
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(
        error.message || "Something went wrong while updating the user."
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
          <p className="text-gray-600 font-medium">Loading user details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/users")}
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
              Edit User
            </h1>
            <p className="text-gray-600">Update user information and details</p>
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
              className="col-span-full"
            >
              New Password (Leave empty to keep current password)
            </FloatingLabelInput>
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                value={form.role}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                required
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
                <option value="editor">Editor</option>
              </select>
            </div>
          </div>
        </div>

        {/* Avatar Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-xl font-semibold mb-4 text-secondary">
            User Avatar
          </h2>

          {/* Current Avatar Display */}
          {currentAvatar && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Current Avatar</h3>
              <div className="relative inline-block">
                <img
                  src={currentAvatar}
                  alt="Current avatar"
                  className="w-32 h-32 object-cover rounded-full border cursor-pointer"
                  onClick={() =>
                    openImagePreview(currentAvatar, "Current Avatar")
                  }
                />
              </div>
            </div>
          )}

          {/* New Avatar Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Avatar (Optional)
            </label>
            <input
              type="file"
              id="avatar"
              accept="image/*"
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-primary"
            />
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

          <p className="text-sm text-gray-500 mt-2">
            * Leave empty to keep current avatar. Upload a new image to replace
            it.
          </p>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/users")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Updating User..." : "Update User"}
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
        draggable
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
                className="max-w-full max-h-[70vh] object-contain rounded-full"
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

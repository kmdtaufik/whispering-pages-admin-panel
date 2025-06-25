import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FloatingLabelInput from "../../components/Input/FloatingLabelInput";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [files, setFiles] = useState({
    avatar: null,
  });

  // Add image preview states
  const [imagePreview, setImagePreview] = useState({
    isOpen: false,
    imageSrc: null,
    imageName: null,
  });

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

  const handleChange = (e) => {
    if (e.target.type === "file") {
      const file = e.target.files[0];
      setFiles((prev) => ({ ...prev, [e.target.name]: file }));
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };
  // Add image handling functions
  const removeAvatar = () => {
    setFiles((prev) => ({ ...prev, avatar: null }));
    // Reset the input
    const avatarInput = document.getElementById("avatar");
    if (avatarInput) avatarInput.value = "";
  };
  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!formData.password.trim()) {
      toast.error("Password is required");
      return false;
    }
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch(
        "https://whispering-pages-backend.vercel.app/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("User registered successfully! Redirecting to login...");
        setFormData({ name: "", email: "", password: "", avatar: "" });
        setTimeout(() => {
          navigate("/auth/login");
        }, 2000);
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      toast.error("Network error occurred. Please try again.");
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-libre-baskerville text-secondary mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">Join Whispering Pages Admin Panel</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <FloatingLabelInput
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            >
              Full Name
            </FloatingLabelInput>

            {/* Email Field */}
            <FloatingLabelInput
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            >
              Email Address
            </FloatingLabelInput>

            {/* Password Field */}
            <div>
              <FloatingLabelInput
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              >
                Password
              </FloatingLabelInput>
            </div>

            {/* Avatar Field */}
            <div>
              <label
                htmlFor="avatar"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Avatar (Optional)
              </label>
              <input
                type="file"
                id="avatar"
                name="avatar"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/auth/login"
                className="text-primary font-medium hover:text-primary/80 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="text-center mt-6">
          <div className="text-center mt-6">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-800 transition-colors text-sm flex items-center justify-center gap-2"
            >
              <svg
                className="w-4 h-4"
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
              Back to Dashboard
            </Link>
          </div>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            className="mt-16"
          />

          {/* Image Preview Modal */}
          {imagePreview.isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded-lg max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">
                    {imagePreview.imageName}
                  </h3>
                  <button
                    onClick={closeImagePreview}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
                <img
                  src={imagePreview.imageSrc}
                  alt="Preview"
                  className="w-full h-auto max-h-96 object-contain"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

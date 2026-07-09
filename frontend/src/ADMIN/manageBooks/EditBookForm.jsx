import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

// Are you sure you want to delete confirm prompt
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

import { backend_server } from "../../main";
import "./editbook.css";
import {
  HiOutlineArrowLeft,
  HiOutlinePhoto,
  HiOutlineBookOpen,
  HiOutlineUser,
  HiOutlineTag,
  HiOutlineLanguage,
  HiOutlineDocumentText,
  HiOutlineTrash,
  HiOutlineArrowPath,
} from "react-icons/hi2";

const EditBookForm = () => {
  const API_URL = `${backend_server}/api/v1/books`;
  const { id } = useParams();
  const navigate = useNavigate();

  const [bookData, setBookData] = useState({
    title: "",
    category: "",
    author: "",
    available: false,
    featured: false,
    description: "",
    language: "",
  });
  const [imagePath, setImagePath] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchBookData = async () => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      setBookData(response.data.data);
      setImagePath(`${backend_server}/${response.data.data.image}`);
    } catch (error) {
      console.log("ERROR FETCHING BOOK data using _id");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookData();
  }, []);

  const handleOnChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setBookData({ ...bookData, [name]: value });
  };

  const handleCategoryOnChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setBookData({ ...bookData, [name]: value.toUpperCase() });
  };

  const handleLanguageOnChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setBookData({ ...bookData, [name]: value.toUpperCase() });
  };

  const [updatingBook, setUpdatingBook] = useState(false);

  const handleUpdateButton = async (e) => {
    e.preventDefault();
    const { title, category, author, description, language } = bookData;

    if (!title || !category || !author || !description || !language) {
      toast.error("Please fill in all required fields");
      return;
    }

    setUpdatingBook(true);
    try {
      await axios.patch(`${API_URL}/${id}`, bookData);
      toast.success("Book Updated Success");
      fetchBookData();
    } catch (error) {
      console.log(error.response);
      toast.error("Error updating book");
    } finally {
      setUpdatingBook(false);
    }
  };

  const showConfirmation = () => {
    confirmAlert({
      title: "Confirm Delete",
      message: "Are you sure you want to delete this Book?",
      buttons: [
        {
          label: "Yes, Delete",
          onClick: handleDeleteButton,
        },
        {
          label: "Cancel",
          onClick: () => console.log("Cancelled!"),
        },
      ],
    });
  };

  const handleDeleteButton = async () => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success("Delete Success");
      setTimeout(() => {
        navigate("/admin/managebooks");
      }, 1000);
    } catch (error) {
      console.log(error.response);
      toast.error("Error deleting book");
    }
  };

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState();
  const [updatingImage, setUpdatingImage] = useState(false);

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!selectedImage) {
      setImagePreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImage);
    setImagePreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImage]);

  const handleImageChange = (event) => {
    if (event.target.files?.[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };

  const handleImageUpdateFormSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) return;

    setUpdatingImage(true);
    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      await axios.patch(`${API_URL}/updateImage/${id}`, formData);
      toast.success("Image Updated Successfully");
      fetchBookData();
      setSelectedImage(null);
    } catch (error) {
      console.log(error.response);
      toast.error("Error updating Image");
    } finally {
      setUpdatingImage(false);
    }
  };

  return (
    <div className="page-content">
      <div className="eb-page">
        {/* ── Header ─────────────────────────── */}
        <div className="eb-header">
          <button type="button" className="eb-back-btn" onClick={() => navigate(-1)}>
            <HiOutlineArrowLeft size={16} /> Back
          </button>
          <div>
            <h1 className="eb-title">Edit Book</h1>
            <p className="eb-subtitle">Modify book information, check availability, or update the cover image.</p>
          </div>
        </div>

        {loading ? (
          <div className="rt-skeleton-wrap">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="rt-skeleton-row" />
            ))}
          </div>
        ) : (
          <div className="eb-form-card">
            <div className="eb-form-grid">
              
              {/* ── LEFT — Image / Cover column ── */}
              <div className="eb-image-col">
                <span className="eb-section-label">Book Cover</span>
                <div className="eb-cover-container">
                  <img
                    src={selectedImage ? imagePreview : imagePath}
                    alt="book cover"
                    className="eb-cover-img"
                  />
                </div>

                <form style={{ width: "100%" }} onSubmit={handleImageUpdateFormSubmit}>
                  <label className="eb-file-label" htmlFor="eb-image-input">
                    <HiOutlinePhoto size={16} />
                    {selectedImage ? "Change Cover Image" : "Choose New Image"}
                  </label>
                  <input
                    id="eb-image-input"
                    type="file"
                    accept="image/*"
                    className="eb-file-input"
                    onChange={handleImageChange}
                  />

                  {selectedImage && (
                    <div className="eb-image-actions">
                      <button
                        type="submit"
                        className="eb-img-update-btn"
                        disabled={updatingImage}
                      >
                        <HiOutlineArrowPath size={14} />
                        {updatingImage ? "Saving..." : "Save Image"}
                      </button>
                      <button
                        type="button"
                        className="eb-cancel-img-btn"
                        onClick={() => setSelectedImage(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </form>
              </div>

              {/* ── RIGHT — Details Form column ── */}
              <div className="eb-fields-col">
                <span className="eb-section-label">Book Details</span>

                <form className="eb-fields-grid" onSubmit={handleUpdateButton}>
                  {/* Title */}
                  <div className="eb-field eb-field--full">
                    <label className="eb-label" htmlFor="title">
                      <HiOutlineBookOpen size={14} /> Title
                    </label>
                    <input
                      id="title"
                      type="text"
                      className="eb-input"
                      required
                      value={bookData.title}
                      onChange={handleOnChange}
                      name="title"
                      autoComplete="off"
                    />
                  </div>

                  {/* Author */}
                  <div className="eb-field">
                    <label className="eb-label" htmlFor="author">
                      <HiOutlineUser size={14} /> Author
                    </label>
                    <input
                      id="author"
                      type="text"
                      className="eb-input"
                      required
                      value={bookData.author}
                      onChange={handleOnChange}
                      name="author"
                      autoComplete="off"
                    />
                  </div>

                  {/* Category */}
                  <div className="eb-field">
                    <label className="eb-label" htmlFor="category">
                      <HiOutlineTag size={14} /> Category
                    </label>
                    <input
                      id="category"
                      type="text"
                      className="eb-input"
                      required
                      value={bookData.category}
                      onChange={handleCategoryOnChange}
                      name="category"
                      autoComplete="off"
                    />
                  </div>

                  {/* Language */}
                  <div className="eb-field">
                    <label className="eb-label" htmlFor="language">
                      <HiOutlineLanguage size={14} /> Language
                    </label>
                    <input
                      id="language"
                      type="text"
                      className="eb-input"
                      required
                      value={bookData.language}
                      onChange={handleLanguageOnChange}
                      name="language"
                      autoComplete="off"
                    />
                  </div>

                  {/* Checkboxes (Available / Featured) */}
                  <div className="eb-field" style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                    <div className="eb-checkbox-group">
                      <label className="eb-checkbox-label" htmlFor="available">
                        <input
                          id="available"
                          type="checkbox"
                          className="eb-checkbox-input"
                          checked={bookData.available}
                          onChange={() =>
                            setBookData({ ...bookData, available: !bookData.available })
                          }
                        />
                        Available
                      </label>

                      <label className="eb-checkbox-label" htmlFor="featured">
                        <input
                          id="featured"
                          type="checkbox"
                          className="eb-checkbox-input"
                          checked={bookData.featured}
                          onChange={() =>
                            setBookData({ ...bookData, featured: !bookData.featured })
                          }
                        />
                        Featured
                      </label>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="eb-field eb-field--full">
                    <label className="eb-label" htmlFor="description">
                      <HiOutlineDocumentText size={14} /> Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows="5"
                      className="eb-input eb-textarea"
                      value={bookData.description}
                      onChange={handleOnChange}
                      required
                      autoComplete="off"
                    />
                  </div>

                  {/* Actions Row */}
                  <div className="eb-field eb-field--full eb-actions">
                    <button
                      type="button"
                      className="eb-delete-btn"
                      onClick={showConfirmation}
                    >
                      <HiOutlineTrash size={15} />
                      Delete Book
                    </button>

                    <button
                      type="submit"
                      className="eb-update-btn"
                      disabled={updatingBook}
                    >
                      {updatingBook ? "Updating..." : "Save Changes"}
                    </button>
                  </div>
                </form>

              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditBookForm;

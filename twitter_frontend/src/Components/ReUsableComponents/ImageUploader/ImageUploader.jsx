import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

const ImageUploader = ({
  onClose,
  onImageUpload,
  isImageUpload,
  savedImage,
}) => {
  const [selectedImage, setSelectedImage] = useState(savedImage);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleUploadImage = () => {
    if (selectedImage) {
      onImageUpload(selectedImage);
      setSelectedImage(null);
      onClose();
    }
  };

  return (
    <div className={`relative`}>
      <button className="absolute right-1" onClick={onClose}>
        <FontAwesomeIcon icon={faCircleXmark} />
      </button>
      <div className="modal-content p-4 max-w-sm bg-white rounded-lg shadow-md">
        {isImageUpload ? (
          <div className="file is-boxed is-centered mb-4">
            <label className="file-label">
              <input
                className="file-input hidden"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
              />
              <span className="file-cta bg-blue-500 text-white rounded-lg py-2 px-4 cursor-pointer">
                <span className="file-icon">
                  <i className="fas fa-upload" />
                </span>
                <span className="file-label">Choose a file…</span>
              </span>
            </label>
          </div>
        ) : null}
        {selectedImage && (
          <div className="selected-image-preview mb-4">
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Selected"
              className="max-w-full h-auto"
            />
          </div>
        )}
        {isImageUpload ? (
          <button
            className="button bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={handleUploadImage}
          >
            Upload
          </button>
        ) : null}
      </div>
      {/*<button*/}
      {/*  className="modal-close absolute top-0 right-0 mt-4 mr-4 text-gray-500 hover:text-gray-800"*/}
      {/*  aria-label="close"*/}
      {/*  onClick={onClose}*/}
      {/*>*/}
      {/*  <i className="fas fa-times"/>*/}
      {/*</button>*/}
    </div>
  );
};

export default ImageUploader;

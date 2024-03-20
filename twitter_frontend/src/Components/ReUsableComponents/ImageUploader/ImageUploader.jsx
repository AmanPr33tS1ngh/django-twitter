import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

const ImageUploader = ({
  onClose,
  onImageUpload,
  isImageUpload,
  savedImage,
}) => {
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchImageBlob();
  }, []);

  const fetchImageBlob = async () => {
    try {
      const response = await fetch(`http://localhost:8000/media/${savedImage}`);
      const blob = await response.blob();
      if (blob?.type?.startsWith("image/")) {
        setSelectedImage(blob);
      }
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };
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
      {console.log("selectedImage", selectedImage)}
      <div
        className={`modal-content p-4 bg-white rounded-lg shadow-md ${
          selectedImage && "w-[80vw] h-[80vh]"
        }`}
      >
        {selectedImage && (
          <div className="selected-image-preview mb-4 flex justify-center">
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Selected"
              className="max-w-full h-[70vh]"
            />
          </div>
        )}
        {isImageUpload ? (
          <div className="grid grid-cols-2">
            <div className="file col-span-1  flex justify-center ">
              <label className="file-label flex items-center">
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
                  <span className="file-label">Choose a file</span>
                </span>
              </label>
            </div>
            <div className="col-span-1 flex justify-center ">
              <button
                className="is-boxed is-centered bg-blue-500 text-white px-4 py-2 rounded-lg button"
                onClick={handleUploadImage}
              >
                Upload
              </button>
            </div>
          </div>
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

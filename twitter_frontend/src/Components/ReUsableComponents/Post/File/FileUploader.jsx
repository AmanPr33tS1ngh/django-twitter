import React, { useRef, useState } from "react";
import ReactPlayer from "react-player";

const FileUploadComponent = ({ addPost }) => {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  return (
    <div>
      <div>
        {file && (
          <div className="flex justify-center items-center">
            {file.type.startsWith("image/") ? (
              <img
                className=" w-80"
                src={URL.createObjectURL(file)}
                alt="Selected File"
              />
            ) : file.type.startsWith("video/") ? (
              <ReactPlayer
                url={URL.createObjectURL(file)}
                controls
                width="400px"
                height="300px"
                playing
                // loop
              />
            ) : (
              <p>Unsupported file type</p>
            )}
          </div>
        )}
      </div>
      <div className="flex justify-center">
        <input
          className="bg-blue-500 text-white px-5 py-2 text-base cursor-pointer mt-4 mr-5 hidden"
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
        <button
          className="bg-blue-500 rounded-lg text-white px-5 py-2 text-base cursor-pointer mt-4 mr-5"
          onClick={() => fileInputRef.current.click()}
        >
          Add Image/Video
        </button>

        <button
          className="bg-blue-500 rounded-lg text-white px-5 py-2 text-base cursor-pointer mt-4"
          onClick={() => addPost(file)}
        >
          Post
        </button>
      </div>
    </div>
    // <div>
    //   <input
    //     className="bg-blue-500 text-white px-5 py-2 text-base cursor-pointer mt-4 mr-5 hidden"
    //     type="file"
    //     accept="image/*,video/*"
    //     onChange={handleImageChange}
    //     ref={fileInputRef}
    //   />
    //   <button onClick={() => fileInputRef.current.click()}>
    //     Add Image/Video
    //   </button>
    //   <div>
    //     {file && (
    //       <>
    //         {file.type.startsWith("image/") ? (
    //           <img src={URL.createObjectURL(file)} alt="Selected File" />
    //         ) : file.type.startsWith("video/") ? (
    //           <ReactPlayer url={URL.createObjectURL(file)} />
    //         ) : (
    //           //   <video loop autoPlay controls width="400" height="300">
    //           //     <source src={} type={file.type} />
    //           //     Your browser does not support the video tag.
    //           //   </video>
    //           <p>Unsupported file type</p>
    //         )}
    //       </>
    //     )}
    //   </div>
    // </div>
  );
};

export default FileUploadComponent;

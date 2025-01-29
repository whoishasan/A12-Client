import axios from "axios";

const Upload = (file) => {
  const dataFile = new FormData();
  dataFile.append("file", file);
  dataFile.append("upload_preset", `${import.meta.env.VITE_CLOUDINARY_PRESET}`);
  dataFile.append(
    "cloud_name",
    `${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}`
  );

  return axios
    .post(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
      }/image/upload`,
      dataFile,
      { headers: { "Content-Type": "multipart/form-data" } }
    )
    .then((response) => response.data) // Extract the data from the response
    .catch((error) => {
      // Handle errors
      console.error(error);
      return "Something went wrong uploading file";
    });
};

export default Upload;

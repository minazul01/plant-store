import axios from "axios";

export const imgUpload = async imgData => {
     // get image from form
    const formData = new FormData();
    formData.append("image", imgData);

  const { data } = await axios.post(
    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_URL}`,
    formData
  );
 
    return data;
};

import { Helmet } from "react-helmet-async";
import AddPlantForm from "../../../components/Form/AddPlantForm";
import { imgUpload } from "../../../Api/ImgHost";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AddPlant = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure()
  const navigate = useNavigate();
  const [load, setLoad] = useState(false);
  const [upload, setUpload] = useState({
    image: { name: "upload image" }
  });
  const handleAddPlant = async (e) => {
    e.preventDefault();
    const form = e.target;

    const name = form.name.value;
    const category = form.category.value;
    const description = form.description.value;
    const price = parseFloat(form.price.value);
    const quantity = parseInt(form.quantity.value);
    // img host imgbb
    const images = form.image.files[0];
    setLoad(true);
    const data = await imgUpload(images);

    const image = data.data.display_url;
    // add all data to object
    const formData = {
      email: user?.email,
      name,
      category,
      description,
      price,
      quantity,
      image,
    };
    //  // size validation
    const validated = data.data.size;

    const imgSize = 5 * 1024 * 1024;
    if (validated > imgSize) {
      setLoad(false);
      return toast.error("Image size should be less than 5MB");
    }

    try {
      await axiosSecure.post('/plants', formData)
      toast.success("plants add Successful");
      form.reset();
      navigate("/dashboard/my-inventory");
    } catch (err) {
      console.log(err);
    } finally {
      setLoad(false);
    }
  };
  return (
    <div>
      <Helmet>
        <title>Add Plant | Dashboard</title>
      </Helmet>

      {/* Form */}
      <AddPlantForm
        handleAddPlant={handleAddPlant}
        load={load}
        upload={upload}
        setUpload={setUpload}
      />
    </div>
  );
};

export default AddPlant;

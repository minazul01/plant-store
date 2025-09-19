import { useRef, useState } from "react";
import { imgUpload } from "../../Api/ImgHost";
import LoadingSpinner from "../Shared/LoadingSpinner";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const UpdatePlantForm = ({ data, setIsEditModalOpen, refetch }) => {
  const axiosSecure = useAxiosSecure();
  const { name, category, price, quantity, image, description, _id } =
    data || {};
  const [cat, setCat] = useState(category);
  const [img, setImage] = useState(image || null);
  const [selectedFile, setSelectedFile] = useState(null);
  console.log(img);
  const [upload, setUpload] = useState({
    image: { name: "upload image" },
  });
  const [load, setLoad] = useState(false);

  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      // নতুন image preview দেখানোর জন্য temporary URL বানানো
      setImage(URL.createObjectURL(file));
    }
  };

  // const handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();


    const form = e.target;
    const name = form.name.value;
    const category = form.category.value;
    const description = form.description.value;
    const price = parseFloat(form.price.value);
    const quantity = parseInt(form.quantity.value);

    setLoad(true);

    let imageUrl = img; // default to existing image

    // Only upload if user selected a new file
    if (selectedFile) {
      const data = await imgUpload(selectedFile);
      imageUrl = data?.data?.display_url;

      const validated = data.data.size;
      const imgSize = 5 * 1024 * 1024;
      if (validated > imgSize) {
        toast.error("Image size should be less than 5MB");
        setLoad(false);
        return;
      }
    }

    // Prepare updated plant data
    const updatedPlant = {
      name,
      category,
      description,
      price,
      quantity,
      image: imageUrl,
    };

    // put method use
    try {
      const { data } = await axiosSecure.put(
        `/update-plant/${_id}`,
        updatedPlant
      );
      console.log(data);
      toast.success("update data has been success!!");
      setIsEditModalOpen(false);
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data);
    } finally {
      setLoad(false);
      refetch();
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center text-gray-800 rounded-xl bg-gray-50">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-10">
          <div className="space-y-6">
            {/* Name */}
            <div className="space-y-1 text-sm">
              <label htmlFor="name" className="block text-gray-600">
                Name
              </label>
              <input
                defaultValue={name}
                className="w-full px-4 py-3 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white"
                name="name"
                id="name"
                type="text"
                placeholder="Plant Name"
                required
              />
            </div>
            {/* Category */}
            <div className="space-y-1 text-sm">
              <label htmlFor="category" className="block text-gray-600 ">
                Category
              </label>
              <select
                required
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                className="w-full px-4 py-3 border-lime-300 focus:outline-lime-500 rounded-md bg-white"
                name="category"
              >
                <option value="Indoor">Indoor</option>
                <option value="Outdoor">Outdoor</option>
                <option value="Succulent">Succulent</option>
                <option value="Flowering">Flowering</option>
              </select>
            </div>
            {/* Description */}
            <div className="space-y-1 text-sm">
              <label htmlFor="description" className="block text-gray-600">
                Description
              </label>

              <textarea
                defaultValue={description}
                id="description"
                placeholder="Write plant description here..."
                className="block rounded-md focus:lime-300 w-full h-32 px-4 py-3 text-gray-800  border border-lime-300 bg-white focus:outline-lime-500 "
                name="description"
              ></textarea>
            </div>
          </div>
          <div className="space-y-6 flex flex-col">
            {/* Price & Quantity */}
            <div className="flex justify-between gap-2">
              {/* Price */}
              <div className="space-y-1 text-sm">
                <label htmlFor="price" className="block text-gray-600 ">
                  Price
                </label>
                <input
                  defaultValue={price}
                  className="w-full px-4 py-3 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white"
                  name="price"
                  id="price"
                  type="number"
                  placeholder="Price per unit"
                  required
                />
              </div>

              {/* Quantity */}
              <div className="space-y-1 text-sm">
                <label htmlFor="quantity" className="block text-gray-600">
                  Quantity
                </label>
                <input
                  defaultValue={quantity}
                  className="w-full px-4 py-3 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white"
                  name="quantity"
                  id="quantity"
                  type="number"
                  placeholder="Available quantity"
                  required
                />
              </div>
            </div>
            {/* Image */}
            <div className=" p-4  w-full  m-auto rounded-lg flex-grow">
              <div className="file_upload px-5 py-3 relative border-4 border-dotted border-gray-300 rounded-lg">
                <div className="flex flex-col w-max mx-auto text-center">
                  <label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      name="image"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    {load && <LoadingSpinner />}
                    <div className="bg-lime-500 text-white border border-gray-300 rounded font-semibold cursor-pointer p-1 px-3 hover:bg-lime-600">
                      Upload Image
                    </div>
                  </label>

                  {/* Image Preview */}
                  <div className="mt-3 flex-col  items-center justify-center border-2">
                    {img ? (
                      <>
                        <img
                          src={img}
                          alt="Preview"
                          className="w-32 h-32 mx-auto object-cover border rounded"
                        />
                        {img.length > 20
                          ? img.slice(0, 15) + "..." + img.slice(-7)
                          : img}
                      </>
                    ) : (
                      <p className="text-gray-500 text-sm">No image selected</p>
                    )}
                    {/* File Size */}
                    {selectedFile ? (
                      <p className="text-red-500">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    ) : (
                      <p className="text-gray-500 text-sm">
                        Please select a new image then show image size.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full p-3 mt-5 text-center font-medium text-white transition duration-200 rounded shadow-md bg-lime-500 "
            >
              Update Plant
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdatePlantForm;

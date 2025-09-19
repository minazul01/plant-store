import PropTypes from "prop-types";
import { useState } from "react";
import DeleteModal from "../../Modal/DeleteModal";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const SellerOrderDataRow = ({ data, refetch, }) => {
  const axiosSecure = useAxiosSecure()
  const { name, email, price, quantity, status, address , _id } = data || {};

  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => setIsOpen(false);

  const [category, setCategory] = useState(status || "Pending"); // use status after destructure


   // handleDelete the order
    const handleDelete = async () => {
      try {
        //  fetch the delete func
        await axiosSecure.delete(`/order-delete/${_id}`);
        toast.success("The order has been cancel !!");
        // increase quantity by db
        // await axiosSecure.patch(`/plant-quantity/${plant?.plantId}`, {
        //   quantityUpdate: quantity,
        //   status: "increase",
        // });
        // refresh data
        refetch();
      } catch (err) {
        console.log(err);
        toast.error(err?.response?.data);
      } finally {
        
      }
    };
  return (
    <tr>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{name}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{email}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">${price}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{quantity}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{address}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{status}</p>
      </td>

      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <div className="flex items-center gap-2">
          <select
            required
            defaultValue={status}
            className="p-1 border-2 border-lime-300 focus:outline-lime-500 rounded-md text-gray-900 whitespace-no-wrap bg-white"
            name="category"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">Start Processing</option>
            <option value="Delivered">Delivered</option>
          </select>
          <button
            onClick={() => setIsOpen(true)}
            className="relative disabled:cursor-not-allowed cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-red-200 opacity-50 rounded-full"
            ></span>
            <span className="relative">Cancel</span>
          </button>
        </div>
        <DeleteModal handleDelete={handleDelete} isOpen={isOpen} closeModal={closeModal} />
      </td>
    </tr>
  );
};

SellerOrderDataRow.propTypes = {
  data: PropTypes.object,
  refetch: PropTypes.func,
};

export default SellerOrderDataRow;

import { useState } from "react";
import UpdateUserModal from "../../Modal/UpdateUserModal";
import PropTypes from "prop-types";
import toast from "react-hot-toast"
import useAxiosSecure from "../../../hooks/useAxiosSecure";


const UserDataRow = ({ data, refetch }) => {
  const axiosSecure = useAxiosSecure();

  const [isOpen, setIsOpen] = useState(false);
  const { email, role, status } = data || {};


  const handleUpdate = async (selected) => {
    if(role === selected){
       return toast.error('already has been added')
    }
   
    try{
      await axiosSecure.patch(`/update-seller/${email}`, {
        role: selected,
      })
   
      toast.success('status has been verified!!')
      refetch();
    }catch(err){
      toast.error(err?.response?.data)
      console.log(err)
    }finally{
      setIsOpen(false);
    }
    
  }

  return (
    <tr>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{email}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{role}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        {status ? (
          <p
            className={`whitespace-no-wrap ${
              status === "Requested" && "text-yellow-500"
            } ${status === "Verified" && "text-green-500"}`}
          >
            {status ? status : "Unavailable"}
          </p>
        ) : (
          <p className="text-red-500 whitespace-no-wrap">Unavailable</p>
        )}
      </td>

      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <span
          onClick={() => setIsOpen(true)}
          className="relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
          ></span>
          <button
            disabled={data?.status !== "Requested"}
            className={`relative ${data?.status !== 'Requested' ? 'cursor-not-allowed' : ''}`}
          >
            Update Role
          </button>
        </span>
        {/* Modal */}
        <UpdateUserModal handleUpdate={handleUpdate} role={role} isOpen={isOpen} setIsOpen={setIsOpen} />
      </td>
    </tr>
  );
};

UserDataRow.propTypes = {
  user: PropTypes.object,
  refetch: PropTypes.func,
};

export default UserDataRow;

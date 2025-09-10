/* eslint-disable react/prop-types */
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Fragment, useState } from "react";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import Button from "../Shared/Button/Button";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";

const PurchaseModal = ({ closeModal, isOpen, plant, refetch }) => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  // Total Price Calculation
  const { category, name, price, quantity, _id } = plant || {};

  // quantity validation

  const [plantQuantity, setPlantQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(price || 0);
  const [purchaseInfo, setPurchaseInfo] = useState({
    quantity: plantQuantity,
    price: price,
    address: "",
  });

  const handleQuantity = (value) => {
    const num = parseInt(value);
    console.log(value);
    if (value === "") {
      setPlantQuantity("");
      return;
    }

    if (num < 1) {
      return toast.error("Quantity cannot be less than 1!");
    }

    if (num > quantity) {
      return toast.error(`Only ${quantity} items available in stock!`);
    }

    // update state
    setPlantQuantity(num);
    setTotalPrice(num * price);

    setPurchaseInfo((prev) => ({
      ...prev,
      quantity: num,
      price: num * price,
    }));
  };

  const handlePurchase = async () => {
    // Address validation
    if (!purchaseInfo.address || purchaseInfo.address.trim() === "") {
      return toast.error("Please type your shipping address!!");
    }
    const orderData = {
      customer: {
        name: user?.displayName,
        email: user?.email,
        image: user?.photoURL,
      },
      plantId: plant?._id, // fresh value
      price: totalPrice,
      quantity: plantQuantity,
      address: purchaseInfo.address,
      status: "pending",
    };

    if (purchaseInfo == "") {
      return toast.error("Please type your shipping address!!");
    }
    // console.table(purchaseInfo);
    // purchase order data save in db
    try {
      await axiosSecure.post("/orders", orderData);
      toast.success("order successful");
      navigate('/dashboard/my-orders')
      // decrease quantity by db
      await axiosSecure.patch(`/plant-quantity/${_id}`, {
        quantityUpdate: plantQuantity,
        status: "decrease",
      });
      refetch();
    } catch (err) {
      console.log(err);
    } finally {
      closeModal();
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium text-center leading-6 text-gray-900"
                >
                  Review Info Before Purchase
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Plant: {name}</p>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Category: {category}</p>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Customer: {user?.email}
                  </p>
                </div>

                <div className="mt-2">
                  <p className="text-sm text-gray-500">Price: $ {price}</p>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Available Quantity: {quantity}
                  </p>
                </div>
                <div>
                  {/* quantity input */}
                  <div className="space-x-1 mb-2 mt-2 text-sm flex items-center">
                    <label htmlFor="price" className="block text-gray-600 ">
                      quantity:
                    </label>
                    <input
                      className=" px-4 py-1 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white"
                      name="parches"
                      onChange={(e) => handleQuantity(e.target.value)}
                      value={plantQuantity}
                      id="parches"
                      type="number"
                      placeholder="parches number"
                      required
                    />
                  </div>

                  {/* address */}
                  <div className="space-x-1 text-sm flex items-center">
                    <label htmlFor="price" className="block text-gray-600 ">
                      Address:
                    </label>
                    <input
                      onChange={(e) =>
                        setPurchaseInfo((prev) => {
                          return { ...prev, address: e.target.value };
                        })
                      }
                      className=" px-4 py-1 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white"
                      name="address"
                      max={quantity}
                      id="address"
                      type="text"
                      placeholder="Shipping address"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Button
                    onClick={handlePurchase}
                    label={`Pay ${totalPrice}`}
                  />
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PurchaseModal;

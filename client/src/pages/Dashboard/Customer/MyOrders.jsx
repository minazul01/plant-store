import { Helmet } from "react-helmet-async";
import CustomerOrderDataRow from "../../../components/Dashboard/TableRows/CustomerOrderDataRow";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";

const MyOrders = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const {
    data: plant = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["plant", user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/customer-plant/${user?.email}`);
      return data;
    },
  });
  {
    isLoading && <LoadingSpinner />;
  }
  console.log("plant is ok", plant);
  return (
    <>
      <Helmet>
        <title>My Orders</title>
      </Helmet>
      <div className="container mx-auto px-4 sm:px-8">
        <div className="py-8">
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Image
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Quantity
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Status
                    </th>

                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {plant?.length > 0 ? (
                    plant?.map((plant) => (
                      <CustomerOrderDataRow
                        key={plant?._id}
                        data={plant}
                        refetch={refetch}
                      />
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-red-500 font-bold text-center py-10"
                      >
                        No order data !!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyOrders;

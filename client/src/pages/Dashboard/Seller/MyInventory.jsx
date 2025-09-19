import { Helmet } from "react-helmet-async";

import PlantDataRow from "../../../components/Dashboard/TableRows/PlantDataRow";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";

const MyInventory = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const {
    data: plant = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["plant", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const { data } = await axiosSecure.get(`/plants?email=${user?.email}`);
      console.log("Plants from server:", data);
      return data;
    },
  });

  if (isLoading) return <LoadingSpinner />;
  console.log(plant);


  return (
    <>
      <Helmet>
        <title>My Inventory</title>
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
                      Delete
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Update
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {plant?.length > 0 ? (
                    plant?.map((plant) => (
                      <PlantDataRow
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

export default MyInventory;

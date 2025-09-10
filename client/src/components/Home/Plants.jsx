import Card from "./Card";
import Container from "../Shared/Container";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Plants = () => {
  const { data: plants = [] } = useQuery({
    queryKey: ["plants"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/plants`
      );
      return data;
    },
  });
  console.log(plants);
  return (
    <Container>
      {plants && plants?.length > 0 ? (
        <div className="pt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
          {plants?.map((plant) => (
            <Card key={plant?._id} data={plant} />
          ))}
        </div>
      ) : (
        <p className="text-center my-10 text-red-500 font-bold">
          No Data Available !!!
        </p>
      )}
    </Container>
  );
};

export default Plants;

import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

const useRole = () => {
    const {user, loading} = useAuth()
    const axiosSecure  = useAxiosSecure()
  const { data: role , isLoading } = useQuery({
    queryKey: ['user'],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
        const {data} = await axiosSecure.get(`/user-role/${user?.email}`)
        return data;
    }
  })
  return [role, isLoading]
};
export default useRole;

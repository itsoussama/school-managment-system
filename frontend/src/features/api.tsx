import AxiosProvider from "@services/axiosProvider";
const axiosApi = AxiosProvider();

const getTeachers = async (page = 1, perPage = 5) => {
  const response = await axiosApi.get(
    "/api/users?page=" + page + "&per_page=" + perPage,
  );
  return response;
};

const getTeacher = async (id: string) => {
  const response = await axiosApi.get("/api/users/" + id);
  return response;
};

export { getTeachers, getTeacher };

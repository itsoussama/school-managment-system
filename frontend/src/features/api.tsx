import AxiosProvider from "@services/axiosProvider";
import { FormData } from "@admin/pages/teachers/viewTeachers";
const axiosApi = AxiosProvider();

const getTeachers = async (
  page = 1,
  perPage = 5,
  sortColumn = "id",
  sortDirection = "asc",
) => {
  const response = await axiosApi.get(
    "/api/teacher?page=" +
      page +
      "&per_page=" +
      perPage +
      "&sort_column=" +
      sortColumn +
      "&sort_direction=" +
      sortDirection,
  );
  return response;
};

const getStudents = async (
  page = 1,
  perPage = 5,
  sortColumn = "id",
  sortDirection = "asc",
) => {
  const response = await axiosApi.get(
    "/api/student?page=" +
      page +
      "&per_page=" +
      perPage +
      "&sort_column=" +
      sortColumn +
      "&sort_direction=" +
      sortDirection,
  );
  return response;
};

const getUser = async (id: string) => {
  const response = await axiosApi.get("/api/users/" + id);
  return response;
};

const setUser = async (formData: FormData) => {
  const response = await axiosApi.put("/api/users/" + formData?.id, formData);
  return response;
};

const deleteUser = async (id: string) => {
  const response = await axiosApi.delete("/api/users/" + id);
  return response;
};

export { getTeachers, getStudents, getUser, setUser, deleteUser };

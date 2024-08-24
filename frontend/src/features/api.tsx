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
    "/api/users?page=" +
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

const getTeacher = async (id: string) => {
  const response = await axiosApi.get("/api/users/" + id);
  return response;
};

const setTeacher = async (formData: FormData) => {
  const response = await axiosApi.put("/api/users/" + formData?.id, formData);
  return response;
};

const deleteTeacher = async (id: string) => {
  const response = await axiosApi.delete("/api/users/" + id);
  return response;
};

export { getTeachers, getTeacher, setTeacher, deleteTeacher };

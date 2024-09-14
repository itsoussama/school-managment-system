import AxiosProvider from "@services/axiosProvider";
import { FormData as UpdateTeacherFromData } from "@admin/pages/teachers/viewTeachers";
import { FormData as AddTeacherFromData } from "@src/admin/pages/teachers/addTeacher";
import { FormData as AddStudentFromData } from "@src/admin/pages/students/addStudent";
import { FormData as AddParentFromData } from "@src/admin/pages/parents/addParent";
const axiosApi = AxiosProvider();

const getTeachers = async (
  page = 1,
  perPage = 5,
  sortColumn = "id",
  sortDirection = "asc",
  schoolId: string,
) => {
  const response = await axiosApi.get(
    "/api/teacher?page=" +
      page +
      "&per_page=" +
      perPage +
      "&sort_column=" +
      sortColumn +
      "&sort_direction=" +
      sortDirection +
      "&school_id=" +
      schoolId,
  );
  return response;
};

const getStudents = async (
  page = 1,
  perPage = 5,
  sortColumn = "id",
  sortDirection = "asc",
  schoolId = 1,
) => {
  const response = await axiosApi.get(
    "/api/student?page=" +
      page +
      "&per_page=" +
      perPage +
      "&sort_column=" +
      sortColumn +
      "&sort_direction=" +
      sortDirection +
      "&school_id=" +
      schoolId,
  );
  return response;
};

const getParents = async (
  page = 1,
  perPage = 5,
  sortColumn = "id",
  sortDirection = "asc",
  schoolId = 1,
) => {
  const response = await axiosApi.get(
    "/api/parent?page=" +
      page +
      "&per_page=" +
      perPage +
      "&sort_column=" +
      sortColumn +
      "&sort_direction=" +
      sortDirection +
      "&school_id=" +
      schoolId,
  );
  return response;
};

const getUser = async (id: number) => {
  const response = await axiosApi.get("/api/users/" + id);
  return response;
};

const addTeacher = async (formData: AddTeacherFromData) => {
  const response = await axiosApi.post("/api/users/", formData);
  return response;
};

const addStudent = async (formData: AddStudentFromData) => {
  const response = await axiosApi.post("/api/users/", formData);
  return response;
};

const addParent = async (formData: AddParentFromData) => {
  const response = await axiosApi.post("/api/add-parent/", formData);
  return response;
};

const setUser = async (formData: UpdateTeacherFromData) => {
  const response = await axiosApi.put("/api/users/" + formData?.id, formData);
  return response;
};

const deleteUser = async (id: number) => {
  const response = await axiosApi.delete("/api/users/" + id);
  return response;
};

const getSubjects = async () => {
  const response = await axiosApi.get("/api/subjects/");
  return response;
};

const getGrades = async () => {
  const response = await axiosApi.get("/api/grades/");
  return response;
};

export {
  getTeachers,
  getStudents,
  getParents,
  getUser,
  addStudent,
  addTeacher,
  addParent,
  setUser,
  deleteUser,
  getSubjects,
  getGrades,
};

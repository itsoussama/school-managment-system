import AxiosProvider from "@services/axiosProvider";
import { FormData as UpdateTeacherFromData } from "@admin/pages/teachers/viewTeachers";
import { FormData as UpdateStudentFromData } from "@admin/pages/students/viewStudents";
import { FormData as UpdateParentFromData } from "@admin/pages/parents/viewParents";
import { FormData as AddTeacherFromData } from "@src/admin/pages/teachers/addTeacher";
import { FormData as AddStudentFromData } from "@src/admin/pages/students/addStudent";
import { FormData as AddParentFromData } from "@src/admin/pages/parents/addParent";
const axiosApi = AxiosProvider();

const getTeachers = async (
  page = 1,
  perPage = 5,
  sortColumn = "id",
  sortDirection = "asc",
  schoolId: number,
  name: string = "",
  subject: string = "",
  grades: string = "",
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
      schoolId +
      "&name=" +
      name +
      "&subject=" +
      subject +
      "&grades=" +
      grades,
  );
  return response;
};

const getStudents = async (
  page = 1,
  perPage = 5,
  sortColumn = "id",
  sortDirection = "asc",
  schoolId: number,
  name: string = "",
  grades: string = "",
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
      schoolId +
      "&name=" +
      name +
      "&grades=" +
      grades,
  );
  return response;
};

const getParents = async (
  page = 1,
  perPage = 5,
  sortColumn = "id",
  sortDirection = "asc",
  schoolId: number,
  name: string = "",
  childName: string = "",
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
      schoolId +
      "&name=" +
      name +
      "&childName=" +
      childName,
  );
  return response;
};

const getUser = async (id: number, role?: string) => {
  const response = await axiosApi.get("/api/users/" + id + "?role=" + role);
  return response;
};

const addTeacher = async (formData: AddTeacherFromData) => {
  const response = await axiosApi.post("/api/users/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

const addStudent = async (formData: AddStudentFromData) => {
  const response = await axiosApi.post("/api/users/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

const addParent = async (formData: AddParentFromData) => {
  const response = await axiosApi.post("/api/add-parent/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

const setTeacher = async (formData: UpdateTeacherFromData) => {
  const response = await axiosApi.post("/api/users/" + formData?.id, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

const setStudent = async (formData: UpdateStudentFromData) => {
  const response = await axiosApi.post("/api/users/" + formData?.id, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

const setParent = async (formData: UpdateParentFromData) => {
  const response = await axiosApi.post("/api/users/" + formData?.id, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
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

const assignChilds = async (formData: {
  parent_id: number;
  childrens: number[];
}) => {
  const response = await axiosApi.post("/api/assign-childs", formData);
  return response;
};

const assignParent = async (formData: { child_id: number; parent: number }) => {
  const response = await axiosApi.post("/api/assign-parent", formData);
  return response;
};

const exportUser = async () => {
  const response = await axiosApi.get("/api/export-users", {
    responseType: "blob",
  });
  return { response: response };
};

export {
  getTeachers,
  getStudents,
  getParents,
  getUser,
  addStudent,
  addTeacher,
  addParent,
  setTeacher,
  setStudent,
  setParent,
  deleteUser,
  getSubjects,
  getGrades,
  assignChilds,
  assignParent,
  exportUser,
};

import AxiosProvider from "@src/api/axiosProvider";
import { Data as UpdateAdministratorFromData } from "@src/pages/administrators/viewAdministrators";
import { Data as UpdateTeacherFromData } from "@pages/teacher/viewTeachers";
import { Data as UpdateStudentFromData } from "@pages/student/viewStudents";
import { Data as UpdateParentFromData } from "@pages/parent/viewParents";
import { Data as UpdateResourceFromData } from "@pages/resource/viewResources";
import { Data as UpdateClassroomFromData } from "@src/pages/classrooms/viewClassrooms";
import { Data as UpdateSubjectFromData } from "@pages/configuration/school/subjects";
import { Data as UpdateSchoolFromData } from "@pages/configuration/school/generalSettings";
import { Data as UpdateProfileFromData } from "@pages/profile/profile";
import { StageData as UpdateStageFromData } from "@pages/configuration/school/schoolLevels";
import { GradeData as UpdateGradeFormData } from "@pages/configuration/school/schoolLevels";
import { GroupData as UpdateGroupFormData } from "@pages/configuration/school/schoolLevels";
import { Data as UpdateEventFromData } from "@pages/configuration/school/timetable";

import {
  Status,
  Data as UpdateMaintenanceRequestFromData,
} from "@pages/resource/maintenanceRequests";
import { Data as AddAdministratorFromData } from "@src/pages/administrators/addAdministrators";
import { Data as AddTeacherFromData } from "@pages/teacher/addTeacher";
import { Data as AddStudentFromData } from "@pages/student/addStudent";
import { Data as AddParentFromData } from "@pages/parent/addParent";
import { Data as AddResourceFromData } from "@pages/resource/addResources";
import { Data as AddClassroomFromData } from "@src/pages/classrooms/addClassroom";
import { Data as AddSubjectFromData } from "@pages/configuration/school/subjects";
import { Data as AddMaintenanceRequestFromData } from "@pages/resource/maintenanceRequests";
import { StageData as AddStageFromData } from "@pages/configuration/school/schoolLevels";
import { GradeData as AddGradeFromData } from "@pages/configuration/school/schoolLevels";
import { GroupData as AddGroupFromData } from "@pages/configuration/school/schoolLevels";
import { Data as AddEventFromData } from "@pages/configuration/school/timetable";
const axiosApi = AxiosProvider();

const getAdministrators = async (
  page = 1,
  perPage = 5,
  sortColumn = "id",
  sortDirection = "asc",
  schoolId: string,
  name: string = "",
) => {
  const response = await axiosApi.get(
    "/api/administrator?page=" +
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
      name,
  );
  return response.data;
};

const getTeachers = async (
  page = 1,
  perPage = 5,
  sortColumn = "id",
  sortDirection = "asc",
  schoolId: string,
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
  return response.data;
};

const getStudents = async (
  page = 1,
  perPage = 5,
  sortColumn = "id",
  sortDirection = "asc",
  schoolId: string,
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
  return response.data;
};

const getParents = async (
  page = 1,
  perPage = 5,
  sortColumn = "id",
  sortDirection = "asc",
  schoolId: string,
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
  return response.data;
};

const getUser = async (id: number, role?: string) => {
  const response = await axiosApi.get("/api/users/" + id + "?role=" + role);
  return response.data;
};

const getSchoolStaff = async (school_id: string) => {
  const response = await axiosApi.get(
    "/api/school-staffs?school_id=" + school_id,
  );
  return response.data;
};

const getRoles = async (id: number) => {
  const response = await axiosApi.get("/api/roles/" + id);
  return response.data;
};

const addAdministrator = async (formData: AddAdministratorFromData) => {
  const response = await axiosApi.post("/api/add-adminStaff/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const addTeacher = async (formData: AddTeacherFromData) => {
  const response = await axiosApi.post("/api/add-teacher/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const addStudent = async (formData: AddStudentFromData) => {
  const response = await axiosApi.post("/api/add-student/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const addParent = async (formData: AddParentFromData) => {
  const response = await axiosApi.post("/api/add-parent/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const setAdministrator = async (formData: UpdateAdministratorFromData) => {
  const response = await axiosApi.post("/api/users/" + formData?.id, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const setTeacher = async (formData: UpdateTeacherFromData) => {
  const response = await axiosApi.post("/api/users/" + formData?.id, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const setStudent = async (formData: UpdateStudentFromData) => {
  const response = await axiosApi.post("/api/users/" + formData?.id, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const setParent = async (formData: UpdateParentFromData) => {
  const response = await axiosApi.post("/api/users/" + formData?.id, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const deleteUser = async (id: number) => {
  const response = await axiosApi.delete("/api/users/" + id);
  return response.data;
};

const deleteUsers = async (formData: DeleteUsersFormData) => {
  const response = await axiosApi.post("/api/users/destroy-many", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const getSubjects = async (
  page = 1,
  perPage = 5,
  sortColumn = "id",
  sortDirection = "asc",
  schoolId: string,
) => {
  const response = await axiosApi.get(
    "/api/subjects?page=" +
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
  return response.data;
};

const getSubject = async (id: number) => {
  const response = await axiosApi.get("/api/subjects/" + id);
  return response.data;
};

const addSubject = async (formData: AddSubjectFromData) => {
  const response = await axiosApi.post("/api/subjects/", formData);
  return response.data;
};

const setSubject = async (formData: UpdateSubjectFromData) => {
  const response = await axiosApi.post(
    "/api/subjects/" + formData?.id,
    formData,
  );
  return response.data;
};

const assignSubjetTeacher = async (formData: {
  teacher_id: number;
  subject: number[];
}) => {
  const response = await axiosApi.post("/api/assign-teacher-subject", formData);
  return response.data;
};

const deleteSubject = async (id: number) => {
  const response = await axiosApi.delete("/api/subjects/" + id);
  return response.data;
};

const getGrades = async (
  page = 1,
  perPage = 5,
  sortColumn = "id",
  sortDirection = "asc",
  schoolId: string,
) => {
  const response = await axiosApi.get(
    "/api/grades?page=" +
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
  return response.data;
};

const getGrade = async (id: number) => {
  const response = await axiosApi.get("/api/grades/" + id);
  return response.data;
};

const addGrade = async (formData: AddGradeFromData) => {
  const response = await axiosApi.post("/api/grades/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const setGrade = async (formData: UpdateGradeFormData) => {
  const response = await axiosApi.post(
    "/api/grades/" + formData?.id,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

const deleteGrade = async (id: number) => {
  const response = await axiosApi.delete("/api/grades/" + id);
  return response.data;
};

const getGradeGroup = async (gradeId: number, groupId: number) => {
  const response = await axiosApi.get(
    "/api/gradeGroup?grade_id=" + gradeId + "&group_id=" + groupId,
  );
  return response.data;
};

const getGroups = async (
  page = 1,
  perPage = 5,
  sortColumn = "id",
  sortDirection = "asc",
  schoolId: string,
) => {
  const response = await axiosApi.get(
    "/api/groups?page=" +
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
  return response.data;
};

const getGroup = async (id: number) => {
  const response = await axiosApi.get("/api/groups/" + id);
  return response.data;
};

const getGroupWithoutGrades = async (schoolId: string) => {
  const response = await axiosApi.get(
    "/api/groups-no-grades?school_id=" + schoolId,
  );
  return response.data;
};

const addGroup = async (formData: AddGroupFromData) => {
  const response = await axiosApi.post("/api/groups/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const setGroup = async (formData: UpdateGroupFormData) => {
  const response = await axiosApi.post(
    "/api/groups/" + formData?.id,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

const deleteGroup = async (id: number) => {
  const response = await axiosApi.delete("/api/grades/" + id);
  return response.data;
};

const assignChilds = async (formData: {
  parent_id: number;
  childrens: number[];
}) => {
  const response = await axiosApi.post("/api/assign-childs", formData);
  return response.data;
};

const assignParent = async (formData: { child_id: number; parent: number }) => {
  const response = await axiosApi.post("/api/assign-parent", formData);
  return response.data;
};

const blockUser = async (formData: { user_id: number }) => {
  const response = await axiosApi.post("/api/block", formData);
  return response.data;
};

const unblockUser = async (formData: { user_id: number }) => {
  const response = await axiosApi.post("/api/unblock", formData);
  return response.data;
};

const exportUser = async () => {
  const response = await axiosApi.get("/api/export-users", {
    responseType: "blob",
  });
  return { response: response };
};

const getResources = async (
  page = 1,
  perPage = 5,
  sortColumn = "id",
  sortDirection = "asc",
  schoolId: string,
  label = "",
  maxQty = 0,
  minQty = 0,
  category_id = 0,
) => {
  const response = await axiosApi.get(
    "/api/resources?page=" +
      page +
      "&per_page=" +
      perPage +
      "&sort_column=" +
      sortColumn +
      "&sort_direction=" +
      sortDirection +
      "&school_id=" +
      schoolId +
      "&label=" +
      label +
      "&maxQty=" +
      maxQty +
      "&minQty=" +
      minQty +
      "&category_id=" +
      category_id,
  );
  return response.data;
};

const getResource = async (id: number) => {
  const response = await axiosApi.get("/api/resources/" + id);
  return response?.data;
};

const addResource = async (formData: AddResourceFromData) => {
  const response = await axiosApi.post("/api/resources", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const setResource = async (formData: UpdateResourceFromData) => {
  const response = await axiosApi.post(
    "/api/resources/" + formData?.id,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

const deleteResource = async (id: number) => {
  const response = await axiosApi.delete("/api/resources/" + id);
  return response.data;
};

const getClassrooms = async (
  page = 1,
  perPage = 5,
  sortColumn = "id",
  sortDirection = "asc",
  name = "",
  schoolId: string,
) => {
  const response = await axiosApi.get(
    "/api/class_rooms?page=" +
      page +
      "&per_page=" +
      perPage +
      "&sort_column=" +
      sortColumn +
      "&sort_direction=" +
      sortDirection +
      "&name=" +
      name +
      "&school_id=" +
      schoolId,
  );
  return response.data;
};

const getClassroom = async (id: number) => {
  const response = await axiosApi.get("/api/class_rooms/" + id);
  return response?.data;
};

const addClassroom = async (formData: AddClassroomFromData) => {
  const response = await axiosApi.post("/api/class_rooms", formData);
  return response.data;
};

const setClassroom = async (formData: UpdateClassroomFromData) => {
  const response = await axiosApi.post(
    "/api/class_rooms/" + formData?.id,
    formData,
  );
  return response.data;
};

const deleteClassroom = async (id: number) => {
  const response = await axiosApi.delete("/api/class_rooms/" + id);
  return response.data;
};

const getCategories = async (
  page = 1,
  perPage = 5,
  sortColumn = "id",
  sortDirection = "asc",
  schoolId: string,
) => {
  const response = await axiosApi.get(
    "/api/categories?page=" +
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
  return response?.data;
};

const getMaintenanceRequests = async (
  page = 1,
  perPage = 5,
  sortColumn = "id",
  sortDirection = "asc",
  schoolId: string,
  title = "",
  status = "",
  // minQty = 0,
  // category_id = 0,
) => {
  const response = await axiosApi.get(
    "/api/maintenance?page=" +
      page +
      "&per_page=" +
      perPage +
      "&sort_column=" +
      sortColumn +
      "&sort_direction=" +
      sortDirection +
      "&school_id=" +
      schoolId +
      "&title=" +
      title +
      "&status=" +
      status,
    // "&maxQty=" +
    // maxQty +
    // "&minQty=" +
    // minQty +
    // "&category_id=" +
    // category_id,
  );
  return response.data;
};

const getMaintenanceRequest = async (id: number) => {
  const response = await axiosApi.get("/api/maintenance/" + id);
  return response?.data;
};

const addMaintenanceRequest = async (
  formData: AddMaintenanceRequestFromData,
) => {
  const response = await axiosApi.post("/api/maintenance", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const setMaintenanceRequest = async (
  formData: UpdateMaintenanceRequestFromData,
) => {
  const response = await axiosApi.post(
    "/api/maintenance/" + formData?.id,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

const deleteMaintenanceRequest = async (id: number) => {
  const response = await axiosApi.delete("/api/maintenance/" + id);
  return response.data;
};

const setMaintenanceRequestStatus = async (formData: {
  _method: string;
  id: number;
  status: Status;
}) => {
  const response = await axiosApi.post(
    "/api/maintenance/status/" + formData?.id,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

const getSchool = async (id: string) => {
  const response = await axiosApi.get("/api/schools/" + id);
  return response.data;
};

const setSchool = async (formData: UpdateSchoolFromData) => {
  const response = await axiosApi.post(
    "/api/schools/" + formData?.id,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

const setProfile = async (formData: UpdateProfileFromData) => {
  const response = await axiosApi.post("/api/users/" + formData?.id, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const getStages = async (schoolId: string) => {
  const response = await axiosApi.get("/api/stages?school_id=" + schoolId);
  return response.data;
};

const getStage = async (id: number) => {
  const response = await axiosApi.get("/api/stages/" + id);
  return response.data;
};

const addStage = async (formData: AddStageFromData) => {
  const response = await axiosApi.post("/api/stages/", formData);
  return response.data;
};

const setStage = async (formData: UpdateStageFromData) => {
  const response = await axiosApi.post("/api/stages/" + formData?.id, formData);
  return response.data;
};

const deleteStage = async (id: number) => {
  const response = await axiosApi.delete("/api/stages/" + id);
  return response.data;
};

const getEvents = async (schoolId: string) => {
  const response = await axiosApi.get("/api/events?school_id=" + schoolId);
  return response.data;
};

const getEvent = async (id: string) => {
  const response = await axiosApi.get("/api/events/" + id);
  return response.data;
};

const addEvent = async (formData: AddEventFromData) => {
  const response = await axiosApi.post("/api/events/", formData);
  return response.data;
};

const setEvent = async (formData: UpdateEventFromData) => {
  const response = await axiosApi.post("/api/events/" + formData?.id, formData);
  return response.data;
};

const deleteEvent = async (id: string) => {
  const response = await axiosApi.delete("/api/events/" + id);
  return response.data;
};

const getBudgets = async (page = 1, perPage = 5) => {
  const response = await axiosApi.get(
    "/api/budgets/?page=" + page + "&per_page=" + perPage + "&sort_column=",
  );
  return response.data;
};

const getBudgetTransactions = async (id?: number) => {
  const budgetId = id ?? null;
  const response = await axiosApi.get("/api/budgets/transactions/" + budgetId);
  return response.data;
};

const getBudgetUsage = async () => {
  const response = await axiosApi.get("/api/budgets-usage");
  return response.data;
};

const getFees = async (
  page = 1,
  perPage = 5,
  sortColumn = "status",
  sortDirection = "desc",
) => {
  const response = await axiosApi.get(
    "/api/fees/?page=" +
      page +
      "&per_page=" +
      perPage +
      "&sort_column=" +
      sortColumn +
      "&sort_direction=" +
      sortDirection,
  );
  return response.data;
};

const getFee = async (id: number) => {
  const response = await axiosApi.get("/api/fees/" + id);
  return response.data;
};

const getPayrolls = async (page = 1, perPage = 5) => {
  const response = await axiosApi.get(
    "/api/payrolls/?page=" + page + "&per_page=" + perPage + "&sort_column=",
  );
  return response.data;
};

export {
  getRoles,
  getAdministrators,
  addAdministrator,
  setAdministrator,
  getTeachers,
  addTeacher,
  setTeacher,
  getStudents,
  addStudent,
  setStudent,
  getParents,
  addParent,
  setParent,
  getUser,
  getSchoolStaff,
  deleteUser,
  deleteUsers,
  assignChilds,
  assignParent,
  blockUser,
  unblockUser,
  exportUser,
  getSubjects,
  getSubject,
  addSubject,
  setSubject,
  assignSubjetTeacher,
  deleteSubject,
  getGrades,
  getGrade,
  addGrade,
  setGrade,
  deleteGrade,
  getGradeGroup,
  getGroups,
  getGroup,
  getGroupWithoutGrades,
  addGroup,
  setGroup,
  deleteGroup,
  getResources,
  getResource,
  addResource,
  setResource,
  deleteResource,
  getClassrooms,
  getClassroom,
  addClassroom,
  setClassroom,
  deleteClassroom,
  getCategories,
  getMaintenanceRequests,
  getMaintenanceRequest,
  addMaintenanceRequest,
  setMaintenanceRequest,
  deleteMaintenanceRequest,
  setMaintenanceRequestStatus,
  getSchool,
  setSchool,
  setProfile,
  getStages,
  getStage,
  addStage,
  setStage,
  deleteStage,
  getEvents,
  getEvent,
  addEvent,
  setEvent,
  deleteEvent,
  getBudgets,
  getBudgetTransactions,
  getBudgetUsage,
  getFees,
  getFee,
  getPayrolls,
};

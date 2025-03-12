export const PERMISSIONS = {
  Administrator: ["administrator", "teacher", "student", "parent", "finance", "resource", "classroom", "configuration", "view_administrators", "add_administrator", "view_teachers", "add_teacher", "view_students", "add_student", "add_parent", "view_parents", "budget_management", "fee_management", "payroll_management", "view_resources", "add_resource", "manage_resources_requests", "view_resources_requests", "add_resources_request" , "view_classrooms", "add_classroom", "data_export", "general_settings", "school_levels_config", "subjects_config", "timetable_config"],
  Administration_staff: ["view_teachers", "add_teacher", "view_students", "add_student", "add_parent", "view_parents", "view_resources", "add_resource","view_resources_requests", "add_resources_request" , "view_classrooms", "add_classroom", "general_settings", "levels_grades_config", "subjects_config", "timetable_config"],
  Teacher: ["view_students", "add_grades"],
  Student: ["view_own_grades"],
  Parent: ["view_child_grades"],
};

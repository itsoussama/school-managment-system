import { Button, Input, MultiSelect } from "@src/components/input";
import { useFormValidation } from "@src/hooks/useFormValidation";
import { RefObject, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { pluck } from "@src/utils/arrayMethod";
import { Grades } from "../school/subjects";
import { Teacher } from "@src/pages/teacher/viewTeachers";
import { useAppSelector } from "@src/hooks/useReduxEvent";

interface Subject {
  id: number;
  name: string;
  coef: string;
  grades: Grades[];
  teachers: Teacher[];
}

export interface FormData {
  id?: number;
  name: string;
  coef: string;
  grades: number[];
  teachers: number[];
}

export interface Data {
  _method?: string;
  id?: number;
  name: string;
  coef: string;
  grades: number[];
  teachers: number[];
  school_id?: string;
}

interface FormSubjectProps {
  action: "Create" | "Edit";
  initialData: FormData;
  oldData?: Subject;
  formSubmitRef?: RefObject<HTMLFormElement>;
  grades?: Grades[];
  teachers?: Teacher[];
  onFormData: (data: Data) => void;
}

export default function SubjectForm({
  action,
  initialData,
  oldData,
  formSubmitRef,
  grades,
  teachers,
  onFormData,
}: FormSubjectProps) {
  const { t } = useTranslation();
  const { formData, setFormData, setData, validateForm } =
    useFormValidation<FormData>(initialData);
  const user = useAppSelector((state) => state.userSlice.user);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationResult = validateForm();
    if (validationResult.isValid) {
      const form: Data = {
        name: formData?.name,
        coef: formData?.coef,
        grades: formData?.grades,
        teachers: formData?.teachers,
        school_id: user.school_id,
      };

      if (action === "Edit") {
        form["_method"] = "PUT";
        form["id"] = formData?.id;
      }

      onFormData(form);
    }
  };

  useEffect(() => {
    if (oldData) {
      setData({
        id: oldData.id,
        coef: oldData?.coef,
        name: oldData.name,
        teachers: oldData.teachers.map(pluck("id")),
        grades: oldData.grades.map(pluck("id")),
      });
    }
  }, [oldData, setData]);

  return (
    <form
      onSubmit={onSubmit}
      ref={formSubmitRef}
      className="box-border flex w-full flex-col gap-6"
    >
      <Input
        type="text"
        id="name"
        name="name"
        label={t("form.fields.label")}
        placeholder={t("form.fields.label")}
        value={formData?.name || ""}
        onChange={(e) => setFormData(e.target.id, e.target.value)}
      />

      <Input
        type="text"
        id="coef"
        name="coef"
        label={t("form.fields.coefficient")}
        placeholder={t("form.fields.coefficient")}
        value={formData?.coef || ""}
        onChange={(e) => setFormData(e.target.id, e.target.value)}
      />

      <MultiSelect
        name="grades"
        label={t("form.fields.grade_levels")}
        onSelect={(items) => setFormData("grades", items)}
        selectedValue={formData?.grades}
      >
        <MultiSelect.List>
          {grades?.map((grade, key) => (
            <MultiSelect.Option
              key={key}
              value={grade.id}
              label={grade.label}
            />
          ))}
        </MultiSelect.List>
      </MultiSelect>

      <MultiSelect
        name="teachers"
        label={t("entities.teacher")}
        onSelect={(items) => setFormData("teachers", items)}
        selectedValue={formData?.teachers}
      >
        <MultiSelect.List>
          {teachers?.map((teacher, key) => (
            <MultiSelect.Option
              key={key}
              value={teacher.id}
              label={teacher.name}
            />
          ))}
        </MultiSelect.List>
      </MultiSelect>

      {!formSubmitRef && (
        <Button className="btn-default" type="submit">
          {t("form.buttons.create", { label: t("form.fields.subject") })}
        </Button>
      )}
    </form>
  );
}

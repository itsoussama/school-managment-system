import { Button, Input, MultiSelect } from "@src/components/input";
import { customModal } from "@src/utils/flowbite";
import { Modal } from "flowbite-react";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useRef, useState } from "react";
import Alert from "@src/components/alert";
import { alertIntialState, Alert as AlertType } from "@src/utils/alert";
import { FaPlus } from "react-icons/fa";
import { useFormValidation } from "@src/hooks/useFormValidation";
import { Student } from "@src/pages/student/viewStudents";
import { Teacher } from "@src/pages/teacher/viewTeachers";
import { GradeData, Group, ModalProps } from "../school/schoolLevels";
import { pluck } from "@src/utils/arrayMethod";
import { useAppSelector } from "@src/hooks/useReduxEvent";
import AddGroupModal from "./addGroupModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addGroup } from "@src/pages/shared/utils/api";

interface Grade {
  id?: number;
  label: string;
  stage_id?: number;
  students?: Student[];
  teachers?: Teacher[];
  groups?: Group[];
  group_ids?: number[];
  total_groups?: number;
  total_teachers?: number;
  total_students?: number;
}

interface FormData {
  id?: number;
  label: string;
  stage_id: number;
  groups?: number[];
  students?: number[];
  teachers?: number[];
  school_id?: string;
}

interface EditGradeModalProps {
  modal: ModalProps;
  oldData?: Grade;
  onClose: (isClose?: boolean) => void;
  onFormData: (data: GradeData) => void;
}

const GRADE_INITIALDATA = {
  label: "",
  group_ids: [],
  stage_id: 0,
  school_id: "",
};

export default function EditGradeModal({
  modal,
  oldData,
  onClose,
  onFormData,
}: EditGradeModalProps) {
  const queryClient = useQueryClient();
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);
  const [openModal, setOpenModal] = useState<ModalProps>();
  const { formData, setFormData, setData, validateForm } =
    useFormValidation<FormData>(GRADE_INITIALDATA);
  const formRef = useRef<HTMLFormElement>(null);
  const user = useAppSelector((state) => state.userSlice.user);
  const { t } = useTranslation();

  const addGroupMutation = useMutation({
    mutationFn: addGroup,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["getStages"] });
      await queryClient.invalidateQueries({ queryKey: ["getGrades"] });
      await queryClient.invalidateQueries({ queryKey: ["getGrade"] });
      await queryClient.invalidateQueries({ queryKey: ["getGroups"] });
      await queryClient.invalidateQueries({ queryKey: ["getGroup"] });

      setOpenModal(undefined);

      toggleAlert({
        id: new Date().getTime(),
        status: "success",
        message: t("notifications.created_success"),
        state: true,
      });
    },

    onError: () => {
      toggleAlert({
        id: new Date().getTime(),
        status: "fail",
        message: t("notifications.submission_failed"),
        state: true,
      });
    },
  });

  const onCloseModal = () => {
    onClose(true);
  };

  const closeAlert = useCallback((value: AlertType) => {
    toggleAlert(value);
  }, []);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationResult = validateForm();
    if (validationResult.isValid) {
      const form: GradeData = {
        _method: "PUT",
        id: formData?.id,
        label: formData?.label,
        stage_id: formData?.stage_id as number,
        groups: formData?.groups as number[],
        students: formData?.students,
        teachers: formData?.teachers,
        school_id: user.school_id,
      };

      onFormData(form);
    }
  };

  useEffect(() => {
    if (oldData) {
      setData({
        id: oldData?.id,
        label: oldData?.label,
        stage_id: oldData?.stage_id as number,
        groups: oldData?.groups?.map(pluck("id")),
        students: oldData.students?.map(pluck("id")),
        teachers: oldData.teachers?.map(pluck("id")),
      });
    }
  }, [oldData, setData, modal]);

  return (
    <>
      <Alert
        id={alert.id}
        status={alert.status}
        state={alert.state}
        message={alert.message}
        close={closeAlert}
      />

      <AddGroupModal
        modal={openModal as ModalProps}
        onClose={() => setOpenModal(undefined)}
        onFormData={(data) => addGroupMutation.mutate(data)}
      />

      <Modal
        show={modal?.type === "editGrade" ? modal?.open : false}
        theme={customModal}
        onClose={onCloseModal}
        size="md"
      >
        <Modal.Header>
          {t("actions.edit_entity", {
            entity: t("form.fields.grade_level"),
          })}
        </Modal.Header>
        <Modal.Body>
          <form ref={formRef} onSubmit={onSubmit}>
            <div className="flex flex-col gap-y-8">
              <Input
                type="text"
                id="label"
                name="label"
                onChange={(e) => setFormData(e.target.id, e.target.value)}
                value={formData?.label}
                label={t("form.fields.grade_level")}
                placeholder={t("form.fields.grade_level")}
              />
              <MultiSelect
                label={t("form.fields.group")}
                name="groups"
                onSelect={(items) => setFormData("groups", items)}
                selectedValue={formData?.groups}
              >
                <MultiSelect.List>
                  {oldData?.groups?.map((group, key) => (
                    <MultiSelect.Option
                      key={key}
                      value={group.id as number}
                      label={group.name}
                    />
                  ))}
                  <Button
                    className="btn-outline !m-0 flex min-h-6 items-center justify-center"
                    onClick={() =>
                      setOpenModal({
                        id: formData.id as number,
                        type: "addGroup",
                        open: true,
                      })
                    }
                  >
                    <FaPlus size={12} className="me-2" />
                    {t("actions.add_entity", {
                      entity: t("form.fields.group"),
                    })}
                  </Button>
                </MultiSelect.List>
              </MultiSelect>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="submit"
            onClick={() => formRef.current?.requestSubmit()}
            className="btn-default !w-auto"
          >
            {t("general.accept")}
          </Button>
          <Button className="btn-danger !w-auto" onClick={onCloseModal}>
            {t("general.decline")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

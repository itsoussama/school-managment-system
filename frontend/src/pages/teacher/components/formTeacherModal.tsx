import { customModal } from "@src/utils/flowbite";
import { Modal } from "flowbite-react";
import TeachersForm, { FormData } from "./teacherForm";
import { Button } from "@src/components/input";
import { useCallback, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser, setTeacher } from "@src/pages/shared/utils/api";
import Alert from "@src/components/alert";
import { alertIntialState, Alert as AlertType } from "@src/utils/alert";
import { useTranslation } from "react-i18next";

interface Modal {
  id: number;
  type?: "view" | "edit" | "delete" | "block";
  open: boolean;
}

interface FormTeacherModalProps {
  modal: Modal;
  action: "Create" | "Edit";
  onClose: (isClose?: boolean) => void;
}

const TEACHER_INITIALDATA: FormData = {
  id: 0,
  firstName: "",
  lastName: "",
  email: "",
  address: "",
  phone: "",
  password: "",
  password_confirmation: "",
  payroll_frequency: "monthly",
  hourly_rate: 0,
  net_salary: 0,
  grades: [],
  subjects: [],
};

export default function FormTeacherModal({
  modal,
  action,
  onClose,
}: FormTeacherModalProps) {
  const queryClient = useQueryClient();
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { t } = useTranslation();

  const getTeacherQuery = useQuery({
    queryKey: ["getTeacher", modal?.id, "teacher"],
    queryFn: () => getUser(modal?.id as number, "teacher"),
    enabled: !!modal?.open,
  });

  const teacherMutation = useMutation({
    mutationFn: setTeacher,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["getTeacher"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["getTeachers"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["getAllTeachers"],
      });

      toggleAlert({
        id: new Date().getTime(),
        status: "success",
        message: t("notifications.saved_success"),
        state: true,
      });

      onCloseModal();
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

  return (
    <>
      <Alert
        id={alert.id}
        status={alert.status}
        state={alert.state}
        message={alert.message}
        close={closeAlert}
      />
      <Modal
        show={modal?.type === "edit" ? modal?.open : false}
        size={"5xl"}
        theme={customModal}
        onClose={onCloseModal}
      >
        <Modal.Header>
          <b>{getTeacherQuery.data?.teacher?.ref}</b>
        </Modal.Header>
        <Modal.Body className="max-h-[70vh] overflow-auto">
          <TeachersForm
            action={action}
            initialData={TEACHER_INITIALDATA}
            oldData={getTeacherQuery.data}
            onFormData={(data) => teacherMutation.mutate(data)}
            formSubmitRef={formRef}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="submit"
            onClick={() => formRef.current?.requestSubmit()}
            className="btn-default !w-auto"
          >
            {t("general.accept")}
          </Button>
          <button className="btn-danger !w-auto" onClick={onCloseModal}>
            {t("general.decline")}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

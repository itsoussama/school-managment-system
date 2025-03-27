import { customModal } from "@src/utils/flowbite";
import { Modal } from "flowbite-react";
import StudentsForm, { FormData } from "./studentForm";
import { Button } from "@src/components/input";
import { useCallback, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser, setStudent } from "@src/pages/shared/utils/api";
import Alert from "@src/components/alert";
import { alertIntialState, Alert as AlertType } from "@src/utils/alert";
import { useTranslation } from "react-i18next";

interface Modal {
  id: number;
  type?: "view" | "edit" | "delete" | "block";
  open: boolean;
}

interface FormStudentModalProps {
  modal: Modal;
  action: "Create" | "Edit";
  onClose: (isClose?: boolean) => void;
}

const STUDENT_INITIALDATA: FormData = {
  id: 0,
  firstName: "",
  lastName: "",
  email: "",
  address: "",
  phone: "",
  password: "",
  password_confirmation: "",
  grades: [],
  // subjects: [],
};

export default function FormStudentModal({
  modal,
  action,
  onClose,
}: FormStudentModalProps) {
  const queryClient = useQueryClient();
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { t } = useTranslation();

  const getStudentQuery = useQuery({
    queryKey: ["getStudent", modal?.id, "student"],
    queryFn: () => getUser(modal?.id as number, "student"),
    enabled: !!modal?.open,
  });

  const studentMutation = useMutation({
    mutationFn: setStudent,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["getStudent"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["getStudents"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["getAllStudents"],
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
          <b>{getStudentQuery.data?.student?.ref}</b>
        </Modal.Header>
        <Modal.Body className="max-h-[70vh] overflow-auto">
          <StudentsForm
            action={action}
            initialData={STUDENT_INITIALDATA}
            oldData={getStudentQuery.data}
            onFormData={(data) => studentMutation.mutate(data)}
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

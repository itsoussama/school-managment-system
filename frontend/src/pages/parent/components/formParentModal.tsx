import { customModal } from "@src/utils/flowbite";
import { Modal } from "flowbite-react";
import { FormData } from "./parentForm"; // Changed from teacherForm to parentForm
import { Button } from "@src/components/input";
import { useCallback, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser, setParent } from "@src/pages/shared/utils/api"; // Changed from setTeacher to setParent
import Alert from "@src/components/alert";
import { alertIntialState, Alert as AlertType } from "@src/utils/alert";
import { useTranslation } from "react-i18next";
import ParentForm from "./parentForm";

interface Modal {
  id: number;
  type?: "view" | "edit" | "delete" | "block";
  open: boolean;
}

interface FormParentModalProps {
  // Changed from FormTeacherModalProps to FormParentModalProps
  modal: Modal;
  action: "Create" | "Edit";
  onClose: (isClose?: boolean) => void;
}

const PARENT_INITIALDATA: FormData = {
  // Changed from TEACHER_INITIALDATA to PARENT_INITIALDATA
  id: 0,
  firstName: "",
  lastName: "",
  email: "",
  address: "",
  childrens: [],
  phone: "",
  password: "",
  password_confirmation: "",
};

export default function FormParentModal({
  // Changed from FormTeacherModal to FormParentModal
  modal,
  action,
  onClose,
}: FormParentModalProps) {
  // Changed from FormTeacherModalProps to FormParentModalProps
  const queryClient = useQueryClient();
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { t } = useTranslation();

  const getParentQuery = useQuery({
    // Changed from getTeacherQuery to getParentQuery
    queryKey: ["getParent", modal?.id, "parent"], // Changed from getTeacher to getParent
    queryFn: () => getUser(modal?.id as number, "parent"), // Changed from teacher to parent
    enabled: !!modal?.open,
  });

  const parentMutation = useMutation({
    // Changed from teacherMutation to parentMutation
    mutationFn: setParent, // Changed from setTeacher to setParent
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["getParent"], // Changed from getTeacher to getParent
      });

      await queryClient.invalidateQueries({
        queryKey: ["getParents"], // Changed from getTeachers to getParents
      });

      await queryClient.invalidateQueries({
        queryKey: ["getAllParents"], // Changed from getAllTeachers to getAllParents
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
          <b>{getParentQuery.data?.parent?.ref}</b>{" "}
          {/* Changed from teacher to parent */}
        </Modal.Header>
        <Modal.Body className="max-h-[70vh] overflow-auto">
          <ParentForm
            action={action}
            initialData={PARENT_INITIALDATA}
            oldData={getParentQuery.data}
            onFormData={(data) => parentMutation.mutate(data)}
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

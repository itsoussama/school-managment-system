import { useCallback, useRef, useState } from "react";
import { Button } from "@src/components/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addSubject } from "@src/pages/shared/utils/api";
import Alert from "@src/components/alert";
import { alertIntialState, Alert as AlertType } from "@src/utils/alert";
import { Grades, ModalProps } from "../school/subjects";
import { Teacher } from "@src/pages/teacher/viewTeachers";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@src/hooks/useReduxEvent";
import { Modal } from "flowbite-react";
import SubjectForm from "./subjectForm";
import { customModal } from "@src/utils/flowbite";

interface AddSubjectModalProps {
  modal: ModalProps;
  onClose: (isClose?: boolean) => void;
  grades?: Grades[];
  teachers?: Teacher[];
}

const SUBJECT_INITIALDATA = {
  id: 0,
  name: "",
  coef: "",
  grades: [],
  teachers: [],
};

export default function AddSubjectModal({
  modal,
  onClose,
  grades,
  teachers,
}: AddSubjectModalProps) {
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.userSlice.user);
  const formRef = useRef<HTMLFormElement>(null);

  const addSubjectMutation = useMutation({
    mutationFn: addSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getSubjects"] });
      toggleAlert({
        id: new Date().getTime(),
        status: "success",
        message: t("notifications.deleted_success"),
        state: true,
      });
      onClose(true);
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
        show={modal?.type === "addSubject" ? modal?.open : false}
        theme={customModal}
        onClose={onCloseModal}
        size="md"
      >
        <Modal.Header>Add New Subject</Modal.Header>
        <Modal.Body>
          <SubjectForm
            action="Create"
            initialData={SUBJECT_INITIALDATA}
            formSubmitRef={formRef}
            onFormData={(data) => addSubjectMutation.mutate(data)}
            grades={grades}
            teachers={teachers}
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
          <Button
            type="button"
            className="btn-danger !w-auto"
            onClick={onCloseModal}
          >
            {t("modals.delete.cancel_button")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

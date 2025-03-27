import { Button } from "@src/components/input";
import { getSubject, setSubject } from "@src/pages/shared/utils/api";
import { Teacher } from "@src/pages/teacher/viewTeachers";
import { customModal } from "@src/utils/flowbite";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Modal } from "flowbite-react";
import { useTranslation } from "react-i18next";
import SubjectForm from "./subjectForm";
import { useCallback, useRef, useState } from "react";
import Alert from "@src/components/alert";
import { alertIntialState, Alert as AlertType } from "@src/utils/alert";
import { ModalProps } from "../school/subjects";

interface Subject {
  id: number;
  name: string;
  grades: Grades[];
  teachers: Teacher[];
}

interface Grades {
  id: number;
  label: string;
}

interface EditSubjectModalProps {
  modal: ModalProps;
  subjectData?: Subject;
  grades: Grades[];
  teachers: Teacher[];
  onClose: (isClose?: boolean) => void;
}

const SUBJECT_INITIALDATA = {
  id: 0,
  name: "",
  coef: "",
  grades: [],
  teachers: [],
};

function EditSubjectModal({
  modal,
  grades,
  teachers,
  onClose,
}: EditSubjectModalProps) {
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);
  const queryClient = useQueryClient();
  const formRef = useRef<HTMLFormElement>(null);
  const { t } = useTranslation();

  const getSubjectQuery = useQuery({
    queryKey: ["getSubject", modal?.id],
    queryFn: () => getSubject(modal?.id as number),
    enabled: !!modal?.open,
  });

  const setSubjectQuery = useMutation({
    mutationFn: setSubject,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getSubject"],
      });

      queryClient.invalidateQueries({
        queryKey: ["getSubjects"],
      });

      queryClient.invalidateQueries({
        queryKey: ["getAllTeachers"],
      });

      onClose(true);

      toggleAlert({
        id: new Date().getTime(),
        status: "success",
        message: "Operation Successful",
        state: true,
      });
    },

    onError: () => {
      toggleAlert({
        id: new Date().getTime(),
        status: "fail",
        message: "Operation Failed",
        state: true,
      });
    },
  });

  const onCloseModal = () => {
    onClose(true);
    queryClient.invalidateQueries({ queryKey: ["getSubject"] });
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
        theme={customModal}
        onClose={onCloseModal}
        size="lg"
      >
        <Modal.Header>
          {t("actions.edit_entity", { entity: t("form.fields.subject") })}
        </Modal.Header>
        <Modal.Body>
          <SubjectForm
            action="Edit"
            initialData={SUBJECT_INITIALDATA}
            oldData={getSubjectQuery.data}
            onFormData={(data) => setSubjectQuery.mutate(data)}
            formSubmitRef={formRef}
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
          <Button className="btn-danger !w-auto" onClick={onCloseModal}>
            {t("general.decline")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EditSubjectModal;

import { customModal } from "@src/utils/flowbite";
import { Modal } from "flowbite-react";
import { FormData } from "./resourceForm";
import { Button } from "@src/components/input";
import { useCallback, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getResource, setResource } from "@src/pages/shared/utils/api";
import Alert from "@src/components/alert";
import { alertIntialState, Alert as AlertType } from "@src/utils/alert";
import { useTranslation } from "react-i18next";
import ResourceForm from "./resourceForm";

interface Modal {
  id: number;
  type?: "view" | "edit" | "delete";
  open: boolean;
}

interface FormResourceModalProps {
  modal: Modal;
  action: "Create" | "Edit";
  onClose: (isClose?: boolean) => void;
}

const RESOURCE_INITIALDATA: FormData = {
  id: 0,
  label: "",
  qty: 0,
  category_id: 0,
};

export default function FormResourceModal({
  modal,
  action,
  onClose,
}: FormResourceModalProps) {
  const queryClient = useQueryClient();
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { t } = useTranslation();

  const getResourceQuery = useQuery({
    queryKey: ["getResource", modal?.id],
    queryFn: () => getResource(modal?.id as number),
    enabled: !!modal?.open,
  });

  const resourceMutation = useMutation({
    mutationFn: setResource,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["getResource"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["getResources"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["getAllResources"],
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
          <b>{getResourceQuery.data?.label}</b>
        </Modal.Header>
        <Modal.Body className="max-h-[70vh] overflow-auto">
          <ResourceForm
            action={action}
            initialData={RESOURCE_INITIALDATA}
            oldData={getResourceQuery.data}
            onFormData={(data) => resourceMutation.mutate(data)}
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

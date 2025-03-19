import { customModal } from "@src/utils/flowbite";
import { Modal } from "flowbite-react";
import AdministratorsForm, { FormData } from "./administratorsForm";
import { Button } from "@src/components/input";
import { useCallback, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser, setAdministrator } from "@src/pages/shared/utils/api";
import Alert from "@src/components/alert";
import { alertIntialState, Alert as AlertType } from "@src/utils/alert";
import { useTranslation } from "react-i18next";

interface Modal {
  id: number;
  type?: "view" | "edit" | "delete" | "block";
  open: boolean;
}

interface FormAdministratorModalProps {
  modal: Modal;
  action: "Create" | "Edit";
  onClose: (isClose?: boolean) => void;
}

const ADMINISTRATOR_INITIALDATA: FormData = {
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
};

export default function FormAdministratorModal({
  modal,
  action,
  onClose,
}: FormAdministratorModalProps) {
  const queryClient = useQueryClient();
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { t } = useTranslation();

  const getAdministratorQuery = useQuery({
    queryKey: ["getAdministrator", modal?.id, "administrator"],
    queryFn: () => getUser(modal?.id as number, "administrator"),
    enabled: !!modal?.open,
  });

  const administratorMutation = useMutation({
    mutationFn: setAdministrator,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["getAdministrator"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["getAdministrators"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["getAllAdministrators"],
      });

      // setData({
      //   id: data?.id,
      //   firstName: getUserName(data?.name).firstName,
      //   lastName: getUserName(data?.name).lastName,
      //   address: data?.address,
      //   email: data?.email,
      //   phone: data?.phone,
      //   payroll_frequency: data?.payroll.payroll_frequency,
      //   hourly_rate: data?.payroll.hourly_rate,
      //   net_salary: data?.payroll.net_salary,
      // });

      toggleAlert({
        id: new Date().getTime(),
        status: "success",
        message: t("notifications.saved_success"),
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
    //       toggleChangePassword(false);
    //       setPreviewImg(undefined);

    //   setData({
    //     id: 0,
    //     firstName: "",
    //     lastName: "",
    //     email: "",
    //     address: "",
    //     phone: "",
    //     password: "",
    //     password_confirmation: "",
    //     payroll_frequency: "monthly",
    //     hourly_rate: 0,
    //     net_salary: 0,
    //   });
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
          {t("form.fields.id", { entity: t("entities.administrators") })}:
          <b>{modal?.id}</b>
        </Modal.Header>
        <Modal.Body className="max-h-[70vh] overflow-auto">
          <AdministratorsForm
            action={action}
            initialData={ADMINISTRATOR_INITIALDATA}
            oldData={getAdministratorQuery.data}
            onFormData={(data) => administratorMutation.mutate(data)}
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

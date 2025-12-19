import { customModal } from "@src/utils/flowbite";
import { Modal } from "flowbite-react";
import { Input, Button } from "@src/components/input";
import { useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteUser, getUser } from "@src/pages/shared/utils/api";
import Alert from "@src/components/alert";
import { alertIntialState, Alert as AlertType } from "@src/utils/alert";
import { Trans, useTranslation } from "react-i18next";
import { FaExclamationTriangle } from "react-icons/fa";

interface Modal {
  id: number;
  type?: "view" | "edit" | "delete" | "block";
  open: boolean;
}

interface DeleteTeacherModalProps {
  modal: Modal;
  onClose: (isClose?: boolean) => void;
}

export default function DeleteTeacherModal({
  modal,
  onClose,
}: DeleteTeacherModalProps) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);
  const [isVerficationMatch, setIsVerficationMatch] = useState<boolean>(true);

  const getTeacherQuery = useQuery({
    queryKey: ["getTeacher", modal?.id, "teacher"],
    queryFn: () => getUser(modal?.id as number, "teacher"),
    enabled: !!modal?.open,
  });

  const deleteUserQuery = useMutation({
    mutationFn: deleteUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["getTeachers"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["getAllTeachers"],
      });

      onCloseModal();

      toggleAlert({
        id: new Date().getTime(),
        status: "success",
        message: t("notifications.deleted_success"),
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

  const onSubmitDelete = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsVerficationMatch(true);
    const input = event.target as HTMLFormElement;

    if (
      (input.verfication.value as string).toLowerCase() !==
      getTeacherQuery.data?.name.toLowerCase()
    ) {
      setIsVerficationMatch(false);
      return;
    }

    deleteUserQuery.mutate(modal?.id as number);
  };

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
        show={modal?.type === "delete" ? modal?.open : false}
        onClose={onCloseModal}
        size={"md"}
        theme={customModal}
      >
        <form
          onSubmit={onSubmitDelete}
          className="relative box-border flex max-h-[90vh] flex-col rounded-lg bg-white shadow dark:bg-gray-700"
        >
          <Modal.Header>
            {t("actions.delete_entity", {
              entity: t("entities.teachers"),
            })}
          </Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-x-8">
              <p className="mb-3 text-gray-600 dark:text-gray-300">
                <Trans
                  i18nKey="modals.delete.title"
                  values={{ item: getTeacherQuery.data?.name }}
                  components={{ bold: <strong /> }}
                />
              </p>
              <div className="mb-3 flex items-center space-x-4 rounded-s bg-red-600 px-4 py-2">
                <FaExclamationTriangle className="text-white" size={53} />
                <p className="text-white">{t("modals.delete.message")}</p>
              </div>
              <p className="text-gray-900 dark:text-white">
                <Trans
                  i18nKey="modals.delete.label"
                  values={{ item: getTeacherQuery.data?.name }}
                  components={{ bold: <strong /> }}
                />
              </p>
              <Input
                type="text"
                id="verfication"
                name="verfication"
                placeholder="John doe"
                error={!isVerficationMatch ? t("modals.delete.error") : null}
                required
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" className="btn-danger !w-auto">
              {t("modals.delete.delete_button")}
            </Button>
            <Button className="btn-outline !w-auto" onClick={onCloseModal}>
              {t("modals.delete.cancel_button")}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}

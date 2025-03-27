import { customModal } from "@src/utils/flowbite";
import { Modal } from "flowbite-react";
import { Input, Button } from "@src/components/input";
import { useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteSubject, getSubject } from "@src/pages/shared/utils/api";
import Alert from "@src/components/alert";
import { alertIntialState, Alert as AlertType } from "@src/utils/alert";
import { Trans, useTranslation } from "react-i18next";
import { FaExclamationTriangle } from "react-icons/fa";
import { ModalProps } from "../school/subjects";

interface DeleteSubjectModalProps {
  modal: ModalProps;
  onClose: (isClose?: boolean) => void;
}

export default function DeleteSubjectModal({
  modal,
  onClose,
}: DeleteSubjectModalProps) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);
  const [isVerificationMatch, setIsVerificationMatch] = useState<boolean>(true);

  const getSubjectQuery = useQuery({
    queryKey: ["getSubject", modal?.id],
    queryFn: () => getSubject(modal?.id as number),
    enabled: !!modal?.id,
  });

  const deleteSubjectQuery = useMutation({
    mutationFn: deleteSubject,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["getSubjects"],
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
    setIsVerificationMatch(true);
    const input = event.target as HTMLFormElement;

    if (
      (input.verification.value as string).toLowerCase() !==
      getSubjectQuery.data?.name.toLowerCase()
    ) {
      setIsVerificationMatch(false);
      return;
    }

    deleteSubjectQuery.mutate(modal?.id as number);
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
        <form onSubmit={onSubmitDelete}>
          <Modal.Header>
            {t("actions.delete_entity", {
              entity: t("entities.subjects"),
            })}
          </Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-x-8">
              <p className="mb-3 text-gray-600 dark:text-gray-300">
                <Trans
                  i18nKey="modals.delete.title"
                  values={{ item: getSubjectQuery.data?.name }}
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
                  values={{ item: getSubjectQuery.data?.name }}
                  components={{ bold: <strong /> }}
                />
              </p>
              <Input
                type="text"
                id="verification"
                name="verification"
                placeholder={t("modals.delete.placeholder")}
                error={!isVerificationMatch ? t("modals.delete.error") : null}
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

import { customModal } from "@src/utils/flowbite";
import { Modal } from "flowbite-react";
import { useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { blockUser, getUser, unblockUser } from "@src/pages/shared/utils/api";
import Alert from "@src/components/alert";
import { alertIntialState, Alert as AlertType } from "@src/utils/alert";
import { Trans, useTranslation } from "react-i18next";
import { Button } from "@src/components/input";

interface Modal {
  id: number;
  type?: "view" | "edit" | "delete" | "block";
  open: boolean;
}

interface BlockStudentModalProps {
  modal: Modal;
  onClose: (isClose?: boolean) => void;
}

export default function BlockStudentModal({
  modal,
  onClose,
}: BlockStudentModalProps) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);

  const getStudentQuery = useQuery({
    queryKey: ["getStudent", modal?.id, "student"],
    queryFn: () => getUser(modal?.id as number, "student"),
    enabled: !!modal?.open,
  });

  const blockUserMutation = useMutation({
    mutationFn: blockUser,
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

      onCloseModal();

      toggleAlert({
        id: new Date().getTime(),
        status: "success",
        message: t("notifications.saved_success"),
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

  const unBlockUserMutation = useMutation({
    mutationFn: unblockUser,
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

      onCloseModal();

      toggleAlert({
        id: new Date().getTime(),
        status: "success",
        message: t("notifications.saved_success"),
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

  const onSubmitBlock = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const userId: number = modal?.id as number;

    if (!getStudentQuery.data?.blocked) {
      blockUserMutation.mutate({ user_id: userId });
    } else {
      unBlockUserMutation.mutate({ user_id: userId });
    }
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
        show={modal?.type === "block" ? modal?.open : false}
        onClose={onCloseModal}
        size={"md"}
        theme={customModal}
      >
        <form
          onSubmit={onSubmitBlock}
          className="relative box-border flex max-h-[90vh] flex-col rounded-lg bg-white shadow dark:bg-gray-700"
        >
          <Modal.Header>
            {t("actions.block_entity", { entity: t("general.user") })}
          </Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-x-8">
              <p className="text-gray-900 dark:text-white">
                <Trans
                  i18nKey="modals.block.title"
                  values={{ item: getStudentQuery.data?.name }}
                  components={{ bold: <strong /> }}
                />
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" className="btn-danger !w-auto">
              {getStudentQuery.data?.blocked == 0
                ? t("modals.block.block_button")
                : t("modals.block.unblock_button")}
            </Button>
            <Button className="btn-outline !w-auto" onClick={onCloseModal}>
              {t("modals.block.cancel_button")}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}

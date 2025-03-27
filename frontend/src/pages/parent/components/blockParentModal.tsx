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

interface BlockParentModalProps {
  modal: Modal;
  onClose: (isClose?: boolean) => void;
}

export default function BlockParentModal({
  modal,
  onClose,
}: BlockParentModalProps) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);

  const getParentQuery = useQuery({
    queryKey: ["getParent", modal?.id, "parent"],
    queryFn: () => getUser(modal?.id as number, "parent"),
    enabled: !!modal?.open,
  });

  const blockUserMutation = useMutation({
    mutationFn: blockUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["getParent"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["getParents"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["getAllParents"],
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
        queryKey: ["getParent"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["getParents"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["getAllParents"],
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

    if (!getParentQuery.data?.blocked) {
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
        <form onSubmit={onSubmitBlock}>
          <Modal.Header>
            {t("actions.block_entity", { entity: t("general.user") })}
          </Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-x-8">
              <p className="text-gray-900 dark:text-white">
                <Trans
                  i18nKey="modals.block.title"
                  values={{ item: getParentQuery.data?.name }}
                  components={{ bold: <strong /> }}
                />
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" className="btn-danger !w-auto">
              {getParentQuery.data?.blocked == 0
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

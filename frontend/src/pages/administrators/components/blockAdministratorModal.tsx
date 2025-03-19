import { customModal } from "@src/utils/flowbite";
import { Modal } from "flowbite-react";
import { useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { blockUser, getUser, unblockUser } from "@src/pages/shared/utils/api";
import Alert from "@src/components/alert";
import { alertIntialState, Alert as AlertType } from "@src/utils/alert";
import { useTranslation } from "react-i18next";

interface Modal {
  id: number;
  type?: "view" | "edit" | "delete" | "block";
  open: boolean;
}

interface BlockSwitch {
  [key: string]: boolean;
}

interface BlockAdministratorModalProps {
  modal: Modal;
  onClose: (isClose?: boolean) => void;
}

export default function BlockAdministratorModal({
  modal,
  onClose,
}: BlockAdministratorModalProps) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);
  const [blockSwitch, setBlockSwitch] = useState<BlockSwitch>({});

  const getAdministratorQuery = useQuery({
    queryKey: ["getAdministrator", modal?.id, "administrator"],
    queryFn: () => getUser(modal?.id as number, "administrator"),
    enabled: !!modal?.open,
  });

  const blockUserMutation = useMutation({
    mutationFn: blockUser,
    onSuccess: async (_, { user_id }) => {
      await queryClient.invalidateQueries({
        queryKey: ["getAdministrator"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["getAdministrators"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["getAllAdministrators"],
      });

      setBlockSwitch((prev) => ({
        ...prev,
        // [userId]: !prev?.[userId],
        [user_id]: true,
      }));

      toggleAlert({
        id: new Date().getTime(),
        status: "success",
        message: t("notifications.saved_success"),
        state: true,
      });
    },

    onError: (_, { user_id }) => {
      setBlockSwitch((prev) => ({
        ...prev,
        // [userId]: !prev?.[userId],
        [user_id]: prev?.[user_id],
      }));

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
    onSuccess: async (_, { user_id }) => {
      await queryClient.invalidateQueries({
        queryKey: ["getAdministrator"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["getAdministrators"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["getAllAdministrators"],
      });

      setBlockSwitch((prev) => ({
        ...prev,
        // [userId]: !prev?.[userId],
        [user_id]: false,
      }));

      toggleAlert({
        id: new Date().getTime(),
        status: "success",
        message: t("notifications.saved_success"),
        state: true,
      });
    },

    onError: (_, { user_id }) => {
      setBlockSwitch((prev) => ({
        ...prev,
        // [userId]: !prev?.[userId],
        [user_id]: prev?.[user_id],
      }));
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

    if (!blockSwitch[userId]) {
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
              <p className="mb-3 text-gray-600 dark:text-gray-300">
                {t("modals.block.title")}{" "}
                <b>{getAdministratorQuery.data?.name}</b>
              </p>
              {/* <div className="mb-3 flex items-center space-x-4 rounded-s bg-red-600 px-4 py-2">
                <FaExclamationTriangle className="text-white" size={53} />
                <p className="text-white">{t("modals.block.message")}</p>
              </div> */}
              {/* <p className="text-gray-900 dark:text-white">
                {t("modals.block.label")}{" "}
                <b>{getAdministratorQuery.data?.name}</b>
              </p> */}
              {/* <Input
                type="text"
                id="verfication"
                name="verfication"
                placeholder="John doe"
                error={
                  !isVerficationMatch ? fieldTrans("delete-modal-error") : null
                }
                required
              /> */}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button type="submit" className="btn-danger !w-auto">
              {getAdministratorQuery.data?.blocked == 0
                ? t("modals.block.block_button")
                : t("modals.block.unblock_button")}
            </button>
            <button className="btn-outline !w-auto" onClick={onCloseModal}>
              {t("modals.block.cancel_button")}
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}

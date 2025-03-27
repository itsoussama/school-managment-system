import { FormEvent, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Input } from "@src/components/input";
import { GroupData } from "../school/schoolLevels";
import { addGroup } from "@src/pages/shared/utils/api";
import { Modal } from "flowbite-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@src/hooks/useReduxEvent";
import { Alert as AlertType, alertIntialState } from "@src/utils/alert";
import Alert from "@src/components/alert";
import { useFormValidation } from "@src/hooks/useFormValidation";

interface Modal {
  id: number;
  type?:
    | "addGrade"
    | "editGrade"
    | "addStage"
    | "editStage"
    | "deleteStage"
    | "deleteGrade"
    | "addGroup"
    | "assignGroupTeachesrStudents";
  open: boolean;
}

interface AddGroupModalProps {
  modal: Modal;
  onClose: (isClose?: boolean) => void;
  oldData: GroupData;
  setGroupFormData?: <T>(field: string, value: T) => void;
}

export default function AddGroupModal({
  modal,
  onClose,
  oldData,
  setGroupFormData,
}: AddGroupModalProps) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);
  const user = useAppSelector((state) => state.userSlice.user);

  const { formData, setFormData, setData } = useFormValidation<Group>({
    id: 0,
    name: "",
  });

  const addGroupMutation = useMutation({
    mutationFn: addGroup,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["getStages"] });
      await queryClient.invalidateQueries({ queryKey: ["getGrades"] });
      await queryClient.invalidateQueries({ queryKey: ["getGrade"] });
      await queryClient.invalidateQueries({ queryKey: ["getGroups"] });
      await queryClient.invalidateQueries({ queryKey: ["getGroup"] });

      //   setSelectedStudents([]);
      //   setSelectedTeachers([]);

      toggleAlert({
        id: new Date().getTime(),
        status: "success",
        message: t("notifications.created_success"),
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

  const onSubmitNewGroup = (e: FormEvent<HTMLFormElement>) => {
    // const target = e.target as HTMLFormElement;
    e.preventDefault();

    const form: GroupData = {
      name: oldData.name,
      grade_id: modal?.id,
      school_id: user.school_id,
    };

    addGroupMutation.mutate(form);
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
        show={modal?.type === "addGroup" ? modal?.open : false}
        onClose={onCloseModal}
        size={"md"}
        theme={{
          content: {
            base: "relative h-full w-full p-4 md:h-auto",
            inner:
              "relative box-border flex flex-col rounded-lg bg-white shadow dark:bg-gray-700",
          },
          body: {
            base: "p-6",
            popup: "pt-0",
          },
        }}
      >
        <form onSubmit={onSubmitNewGroup}>
          <Modal.Header>
            {t("actions.add_entity", {
              entity:
                t("determiners.indefinite.masculine") +
                " " +
                t("form.fields.group"),
            })}
          </Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-y-3">
              <Input
                type="text"
                id="name"
                name="name"
                onChange={(e) => setFormData(e.target.id, e.target.value)}
                value={oldData.name}
                label={t("form.fields.group")}
                placeholder={t("form.fields.group")}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" className="btn-default !w-auto">
              {t("general.accept")}
            </Button>
            <Button className="btn-danger !w-auto" onClick={onCloseModal}>
              {t("general.decline")}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Input } from "@src/components/input";
import { Group, GroupData, ModalProps } from "../school/schoolLevels";
import { Modal } from "flowbite-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@src/hooks/useReduxEvent";
import { Alert as AlertType, alertIntialState } from "@src/utils/alert";
import Alert from "@src/components/alert";
import { useFormValidation } from "@src/hooks/useFormValidation";

interface FormData {
  id?: number;
  name: string;
  grade_id?: number;
  students?: number[];
  teachers?: number[];
  school_id?: string;
}

interface AddGroupModalProps {
  modal: ModalProps;
  onClose: (isClose?: boolean) => void;
  oldData?: Group;
  onFormData: (data: GroupData) => void;
}

const GROUP_INITIALDATA: FormData = {
  id: 0,
  name: "",
  grade_id: 0,
  students: [],
  teachers: [],
  school_id: "",
};

export default function AddGroupModal({
  modal,
  onClose,
  oldData,
  onFormData,
}: AddGroupModalProps) {
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.userSlice.user);

  const { formData, setFormData, setData, validateForm } =
    useFormValidation<FormData>(GROUP_INITIALDATA);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    // const target = e.target as HTMLFormElement;
    event.preventDefault();
    const validationResult = validateForm();
    if (validationResult.isValid) {
      const form: GroupData = {
        name: formData.name,
        grade_id: modal?.id,
        school_id: user.school_id,
      };

      onFormData(form);
    }
  };

  const onCloseModal = () => {
    onClose(true);
    setData(GROUP_INITIALDATA);
  };

  const closeAlert = useCallback((value: AlertType) => {
    toggleAlert(value);
  }, []);

  useEffect(() => {
    if (oldData) {
      setData({
        id: oldData?.id,
        name: oldData?.name,
        grade_id: modal?.id,
      });
    }
  }, [oldData, setData, modal]);

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
        <form onSubmit={onSubmit}>
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
                value={formData.name}
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

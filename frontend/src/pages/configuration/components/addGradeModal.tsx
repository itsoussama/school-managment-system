import { FormEvent, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Input } from "@src/components/input";
import { Modal } from "flowbite-react";
import { useAppSelector } from "@src/hooks/useReduxEvent";
import { Alert as AlertType, alertIntialState } from "@src/utils/alert";
import Alert from "@src/components/alert";
import { useFormValidation } from "@src/hooks/useFormValidation";
import { ModalProps } from "../school/schoolLevels";

interface FormData {
  id?: number;
  name: string;
  stage_id?: number;
  school_id?: string;
}

interface AddEntityModalProps {
  modal: ModalProps;
  onClose: (isClose?: boolean) => void;
  oldData?: Grade;
  onFormData: (data: FormData) => void;
}

const INITIAL_DATA: FormData = {
  id: 0,
  name: "",
  stage_id: 0,
  school_id: "",
};

export default function AddEntityModal({
  modal,
  onClose,
  oldData,
  onFormData,
}: AddEntityModalProps) {
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.userSlice.user);

  const { formData, setFormData, setData, validateForm } =
    useFormValidation<FormData>(INITIAL_DATA);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationResult = validateForm();
    if (validationResult.isValid) {
      const form: FormData = {
        name: formData.name,
        stage_id: modal?.id,
        school_id: user.school_id,
      };

      onFormData(form);
    }
  };

  const onCloseModal = () => {
    onClose(true);
    setData(INITIAL_DATA);
  };

  const closeAlert = useCallback((value: AlertType) => {
    toggleAlert(value);
  }, []);

  useEffect(() => {
    if (oldData) {
      setData({
        id: oldData?.id,
        name: oldData?.name,
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
        show={modal?.type === "addGrade" ? modal?.open : false}
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
                t(`form.fields.grade_level`),
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
                label={t(`form.fields.label`)}
                placeholder={t(`form.fields.label`)}
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

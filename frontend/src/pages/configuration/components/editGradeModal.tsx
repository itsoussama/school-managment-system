import { Modal, Button } from "flowbite-react";
import { FormEvent } from "react";
import { FaPlus } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import Input from "@src/components/input";
import MultiSelect from "@src/components/multiSelect";

interface EditGradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  gradeData: {
    label: string;
    group_ids?: number[];
  };
  setGradeFormData: (field: string, value: any) => void;
  groups: { id: number; name: string }[];
  onAddGroup: () => void;
}

export default function EditGradeModal({
  isOpen,
  onClose,
  onSubmit,
  gradeData,
  setGradeFormData,
  groups,
  onAddGroup,
}: EditGradeModalProps) {
  const { t } = useTranslation();

  return (
    <Modal
      show={isOpen}
      onClose={onClose}
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
          {t("actions.edit_entity", {
            entity:
              t("determiners.indefinite.masculine") +
              " " +
              t("form.fields.grade_level"),
          })}
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-y-8">
            <Input
              type="text"
              id="label"
              name="label"
              onChange={(e) => setGradeFormData(e.target.id, e.target.value)}
              value={gradeData?.label}
              label={t("form.fields.grade_level")}
              placeholder={t("form.fields.grade_level")}
            />
            <MultiSelect
              label={t("form.fields.group")}
              name="groups"
              onSelect={(items) => setGradeFormData("group_ids", items)}
              selectedValue={gradeData?.group_ids as number[]}
            >
              <MultiSelect.List>
                {groups.map((group, key) => (
                  <MultiSelect.Option
                    key={key}
                    value={group.id}
                    label={group.name}
                  />
                ))}
                <Button
                  className="btn-outline !m-0 flex min-h-6 items-center justify-center"
                  onClick={onAddGroup}
                >
                  <FaPlus size={12} className="me-2" />
                  {t("actions.add_entity", {
                    entity: t("form.fields.group"),
                  })}
                </Button>
              </MultiSelect.List>
            </MultiSelect>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" className="btn-default !w-auto">
            {t("general.accept")}
          </Button>
          <button className="btn-danger !w-auto" onClick={onClose}>
            {t("general.decline")}
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

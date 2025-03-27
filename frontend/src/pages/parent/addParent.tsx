import { Input, Checkbox, Button } from "@components/input";
import { addParent, getStudents } from "@pages/shared/utils/api";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { Breadcrumb, Modal } from "flowbite-react";
import { ChangeEvent, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaHome, FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "@src/hooks/useReduxEvent";
import useBreakpoint from "@src/hooks/useBreakpoint";
import { Alert as AlertType, alertIntialState } from "@src/utils/alert";
import Alert from "@src/components/alert";
import { TransitionAnimation } from "@src/components/animation";
import ParentForm, { FormData } from "./components/parentForm";
import { formatUserName } from "../shared/utils/formatters";

interface Childs {
  id: string;
  imagePath: string;
  name: string;
  guardian_id: string;
}

interface DataChilds {
  id: string;
  [key: string]: string;
}

const SERVER_STORAGE = import.meta.env.VITE_SERVER_STORAGE;

const PARENT_INITIALDATA: FormData = {
  // Changed from TEACHER_INITIALDATA to PARENT_INITIALDATA
  id: 0,
  firstName: "",
  lastName: "",
  email: "",
  address: "",
  childrens: [],
  phone: "",
  password: "",
  password_confirmation: "",
};

export default function AddParent() {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState<boolean>(false);
  // const [formData, setFormData] = useState<FormData>();
  const [selectedChilds, setSelectedChilds] = useState<number[]>([]);
  const [dataChild, setDataChild] = useState<DataChilds[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const admin = useAppSelector((state) => state.userSlice.user);
  const minSm = useBreakpoint("min", "sm");
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);
  const redirect = useNavigate();

  const getChildrensQuery = useQuery({
    queryKey: ["getChildrens"],
    queryFn: () => getStudents(1, -1, undefined, undefined, admin.school_id), // should get the school id from admin user
    placeholderData: keepPreviousData,
  });

  const addParentQuery = useMutation({
    mutationFn: addParent,
    onSuccess: () => {
      redirect("/parents/manage", {
        state: {
          alert: {
            id: new Date().getTime(),
            status: "success",
            message: "Operation Successful",
            state: true,
          },
        },
      });
    },
    onError: () => {
      toggleAlert({
        id: new Date().getTime(),
        status: "fail",
        message: "Operation Failed",
        state: true,
      });
    },
  });

  const handleSearch = (e: EventTarget) => {
    setSearchValue((e as HTMLInputElement).value);
    // console.log();
  };

  const onCloseModal = () => {
    // addStudentQuery.reset();
    setOpenModal(false);
    setSearchValue("");
  };

  const getSelectedChilds = (event: ChangeEvent<HTMLInputElement>) => {
    const child = event.target;
    const ChildId: number = parseInt(event.target?.id);
    if (event.target.checked) {
      setSelectedChilds((prev) => [...prev, ChildId]);
      setDataChild((prev) => [...prev, { id: child.id, label: child.value }]);
    } else {
      const filtredChildList = selectedChilds.filter(
        (childId) => childId !== ChildId,
      );
      setSelectedChilds(filtredChildList);
      setDataChild(dataChild.filter((data) => data.id !== child.id));
    }
  };

  const closeAlert = useCallback((value: AlertType) => {
    toggleAlert(value);
  }, []);

  return (
    <div className="flex flex-col">
      <Alert
        id={alert.id}
        status={alert.status}
        state={alert.state}
        message={alert.message}
        close={closeAlert}
      />

      <Breadcrumb
        theme={{ list: "flex items-center overflow-x-auto px-5 py-3" }}
        className="fade-edge fade-edge-x my-4 flex max-w-max cursor-default rounded-s border border-gray-200 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-800"
        aria-label="Breadcrumb"
      >
        <Breadcrumb.Item icon={FaHome}>
          <Link
            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            to="/"
          >
            {minSm ? t("general.home") : ""}
          </Link>
        </Breadcrumb.Item>
        {minSm ? (
          <Breadcrumb.Item>
            <span className="text-gray-600 dark:text-gray-300">
              {t("entities.parents")}
            </span>
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item>...</Breadcrumb.Item>
        )}
        <Breadcrumb.Item>
          {t("actions.add_entity", { entity: t("entities.parent") })}
        </Breadcrumb.Item>
      </Breadcrumb>

      <Modal
        show={openModal}
        size={"4xl"}
        theme={{
          content: {
            base: "relative h-full w-full p-4 md:h-auto",
            inner:
              "relative box-border flex flex-col rounded-lg bg-white shadow dark:bg-gray-700",
          },
          body: {
            base: "p-6 max-sm:h-[75vh] max-sm:overflow-y-auto",
            popup: "pt-0",
          },
        }}
        onClose={onCloseModal}
      >
        <Modal.Header>
          {t("actions.new_entity", { entity: t("general.child") })}
        </Modal.Header>
        <div className="flex max-h-[70vh] flex-col p-2">
          <div className="sticky z-10 h-full bg-white pb-4 pt-2 dark:bg-gray-700">
            <Input
              id="search"
              type="text"
              leftIcon={FaSearch}
              label=""
              onKeyUp={(e) => handleSearch(e.target)}
              placeholder={t("general.all")}
              name="search"
              custom-style={{
                inputStyle: "px-8 !py-1",
                labelStyle: "mb-0 !inline",
              }}
            />
          </div>
          <div className="flex flex-col gap-y-3 overflow-y-auto">
            {getChildrensQuery.data?.map(
              (child: Childs, key: number) =>
                child.name.search(new RegExp(searchValue, "i")) !== -1 && (
                  <div key={key}>
                    <Checkbox
                      key={key}
                      htmlFor={child.id}
                      label={child.name}
                      id={child.id}
                      name="childrens"
                      image={
                        <img
                          className="h-7 w-7 rounded-full"
                          src={
                            child?.imagePath
                              ? SERVER_STORAGE + child?.imagePath
                              : `https://ui-avatars.com/api/?background=random&name=${formatUserName(child?.name).firstName}+${formatUserName(child?.name).lastName}`
                          }
                          alt="profile"
                        />
                      }
                      onChange={getSelectedChilds}
                      checked={
                        selectedChilds.includes(parseInt(child.id))
                          ? true
                          : false
                      }
                      value={child.name}
                    />
                  </div>
                ),
            )}
          </div>
        </div>
        <Modal.Footer>
          <Button
            type="submit"
            className="btn-default !w-auto"
            onClick={onCloseModal}
          >
            {t("general.accept")}
          </Button>
          {/* <button className="btn-danger !w-auto" onClick={onCloseModal}>
            {fieldsTrans("decline")}
          </button> */}
        </Modal.Footer>
      </Modal>
      <TransitionAnimation>
        <ParentForm
          action="Create"
          initialData={PARENT_INITIALDATA}
          onFormData={(data) => addParentQuery.mutate(data)}
          additionalStyle="grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))]"
        />
      </TransitionAnimation>
    </div>
  );
}

import { Modal } from "flowbite-react";
import { ChangeEvent, useEffect, useState } from "react";
import { Checkbox, Input } from "./input";
import { FaSearch } from "react-icons/fa";
import { useTranslation } from "react-i18next";

interface UserList {
  open: boolean;
  modalHeader: string;
  modalSize:
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl";
  userList: Array<Record<string, string>>;
  name: string;
  options?: {
    search: boolean;
    img: boolean;
  };
  multipleSelection?: boolean;
  onClose: (state: boolean) => void;
  onChange: (
    key: string,
    value: number[],
    name?: Array<Record<string, string>>,
  ) => void;
}

const SERVER_STORAGE = import.meta.env.VITE_SERVER_STORAGE;

export default function UserListModal({
  open,
  modalHeader,
  modalSize = "lg",
  userList,
  name,
  options = {
    search: false,
    img: false,
  },
  onClose,
  onChange,
  multipleSelection = false,
}: UserList) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [selectedUsersName, setSelectedUsersName] = useState<
    Array<Record<string, string>>
  >([]);

  const { t } = useTranslation();
  const { t: fieldsTrans } = useTranslation();

  const handleSearch = (e: EventTarget) => {
    setSearchValue((e as HTMLInputElement).value);
    // console.log();
  };

  const getSelectedUsers = (event: ChangeEvent<HTMLInputElement>) => {
    const user = event.target;
    const UserId: number = parseInt(event.target?.id);
    if (event.target.checked) {
      if (multipleSelection) {
        setSelectedUsers((prev) => [...prev, UserId]);
        setSelectedUsersName((prev) => [
          ...prev,
          { id: user.id, label: user.dataset.name as string },
        ]);
      } else {
        setSelectedUsers([UserId]);
        setSelectedUsersName([
          { id: user.id, label: user.dataset.name as string },
        ]);
      }
    } else {
      const filtredUserList = selectedUsers.filter(
        (userId) => userId !== UserId,
      );
      const filtredUserNameList = selectedUsersName.filter(
        (data) => data.id !== user.id,
      );
      setSelectedUsers(filtredUserList);
      setSelectedUsersName(filtredUserNameList);
    }
  };

  const getUserName = (fullName: string) => {
    const nameParts = fullName?.trim().split(/\s+/);
    const firstName = nameParts?.slice(0, -1).join(" ");
    const lastName = nameParts?.slice(-1).join(" ");

    return { firstName, lastName };
  };

  const onCloseModal = () => {
    // addStudentQuery.reset();
    setOpenModal(false);
    onClose(false);
    setSearchValue("");
  };

  useEffect(() => {
    setOpenModal(open);
  }, [open]);

  useEffect(() => {
    onChange(name, selectedUsers, selectedUsersName);
  }, [selectedUsers]);

  return (
    <Modal
      show={openModal}
      size={modalSize}
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
      <Modal.Header>{t(modalHeader)}</Modal.Header>
      <div className="flex max-h-[50vh] flex-col p-2">
        {options.search && (
          <div className="sticky z-10 h-full bg-white pb-4 pt-2 dark:bg-gray-700">
            <Input
              id="search"
              type="text"
              icon={
                <FaSearch className="absolute top-1/2 mx-3 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
              }
              label=""
              onKeyUp={(e) => handleSearch(e.target)}
              placeholder={fieldsTrans("filter-all")}
              name="search"
              custom-style={{
                inputStyle: "px-8 !py-1",
                labelStyle: "mb-0 !inline",
              }}
            />
          </div>
        )}
        <div className="flex flex-col gap-y-3 overflow-y-auto">
          {userList?.length &&
            userList?.map(
              (user, key: number) =>
                user.label?.search(new RegExp(searchValue, "i")) !== -1 && (
                  <div key={key}>
                    <Checkbox
                      key={key}
                      //   htmlFor={user?.id}
                      label={user?.label}
                      id={user?.id}
                      name={name}
                      image={
                        options.img && (
                          <img
                            className="h-7 w-7 rounded-full"
                            src={
                              user?.imagePath
                                ? SERVER_STORAGE + user?.imagePath
                                : `https://ui-avatars.com/api/?background=random&name=${getUserName(user?.label).firstName}+${getUserName(user?.label).lastName}`
                            }
                            alt="profile"
                          />
                        )
                      }
                      data-name={user?.label}
                      onChange={getSelectedUsers}
                      checked={
                        selectedUsers.includes(parseInt(user?.id))
                          ? true
                          : false
                      }
                      custom-style={{
                        containerStyle: `${!multipleSelection && (selectedUsers.length >= 1 && !selectedUsers.includes(parseInt(user?.id)) ? "disable" : "")}`,
                      }}
                      value={user?.label}
                    />
                  </div>
                ),
            )}
        </div>
      </div>
      <Modal.Footer>
        <button
          type="submit"
          className="btn-default !w-auto"
          onClick={onCloseModal}
        >
          {fieldsTrans("accept")}
        </button>
        {/* <button className="btn-danger !w-auto" onClick={onCloseModal}>
            {fieldsTrans("decline")}
          </button> */}
      </Modal.Footer>
    </Modal>
  );
}

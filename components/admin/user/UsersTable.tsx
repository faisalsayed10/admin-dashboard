import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import { toast } from "react-hot-toast";
import { RotatingLines } from "react-loader-spinner";
import { User } from "../../../lib/types";
import Table from "../../ui/Table";
import TableEmpty from "../../ui/TableEmpty";
import TableLoading from "../../ui/TableLoading";
import UserRow from "./UserRow";

type Props = {
  users: User[] | undefined;
};

const UsersTable: React.FC<Props> = ({ users }) => {
  const [open, setOpen] = useState(false);
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);
  const [emails, setEmails] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInvite = async () => {
    try {
      setLoading(true);
      await fetch("/api/invite", {
        method: "POST",
        body: JSON.stringify({ emails }),
        headers: { "Content-Type": "application/json" },
      });
      setLoading(false);
      closeModal();
      toast.success("Invites sent!");
    } catch (err) {
      console.error(err);
      toast.error(`Error sending invites: ${err}`);
    }
  };

  return (
    <>
      <Table
        button="Invite users"
        cols={["Email", "Role", "Tasks"]}
        description="A list of all the users currently in the system."
        heading="Users"
        onBtnClick={openModal}
      >
        {users && users.length < 1 && (
          <TableEmpty colSpan={4} message="No users found." />
        )}
        {users ? (
          users.map((person) => <UserRow key={person.id} person={person} />)
        ) : (
          <TableLoading colSpan={4} />
        )}
      </Table>
      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-md transition-all">
                  <Dialog.Title
                    as="h1"
                    className="text-xl font-semibold leading-6 text-gray-900"
                  >
                    Invite users
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Enter the email addresses of the users you want to invite
                      to the project. Comma-separated.
                    </p>
                  </div>
                  <div className="mt-4">
                    <textarea
                      id="emails"
                      name="emails"
                      value={emails}
                      onChange={(e) => setEmails(e.target.value)}
                      rows={3}
                      className="shadow-sm block w-full sm:text-sm border-gray-300 border p-3 rounded-md"
                      placeholder="john@doe.com, example@example.com"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleInvite}
                    disabled={loading}
                    className="inline-flex mt-2 justify-center w-full rounded-md border border-transparent px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:text-sm disabled:opacity-50"
                  >
                    {loading ? (
                      <RotatingLines
                        strokeColor="grey"
                        strokeWidth="2"
                        animationDuration="0.75"
                        width="16"
                        visible={true}
                      />
                    ) : (
                      "Invite"
                    )}
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default UsersTable;

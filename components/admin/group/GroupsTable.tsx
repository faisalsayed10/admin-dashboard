import { useSupabaseClient } from "@supabase/auth-helpers-react";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { RotatingLines } from "react-loader-spinner";
import { Group, User } from "../../../lib/types";
import Modal from "../../ui/Modal";
import MultiSelect from "../../ui/MultiSelect";
import Table from "../../ui/Table";
import TableEmpty from "../../ui/TableEmpty";
import TableLoading from "../../ui/TableLoading";
import GroupRow from "./GroupRow";

type Props = {
  groups: Group[] | undefined;
  users: User[] | undefined;
};

const GroupsTable: React.FC<Props> = ({ groups, users }) => {
  const supabase = useSupabaseClient();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  const handleCreate = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setLoading(true);

      const { data, error } = await supabase
        .from("groups")
        .insert({ name })
        .select("id");

      if (error) throw error;
      const { error: membersError } = await supabase.from("members").insert(
        selected.map((user) => ({
          group_id: data?.[0].id,
          user_id: user,
        }))
      );
      if (membersError) throw membersError;
      groups?.push({ created_at: new Date(), id: data?.[0].id, name });
      setLoading(false);
      closeModal();
      toast.success("Group created successfully!");
    } catch (err: any) {
      toast.error(err.message);
      console.error(err);
    }
  };

  return (
    <>
      <Table
        hasEndButton
        button="Create group"
        cols={["Name", "Members", "Tasks"]}
        description="A list of all the groups currently in the system."
        heading="Groups"
        onBtnClick={openModal}
      >
        {groups && groups.length < 1 && (
          <TableEmpty
            colSpan={4}
            message="No groups found. Click on the button above to create a new group."
          />
        )}
        {groups ? (
          groups.map((group) => <GroupRow key={group.id} group={group} />)
        ) : (
          <TableLoading colSpan={4} />
        )}
      </Table>
      <Modal open={open} closeModal={closeModal} title="Create a new group">
        <p className="mt-2 text-sm text-gray-500">
          Please enter the name of the group and select the members you want to
          add to the group.
        </p>
        <form className="mt-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Group name"
              className="relative w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline placeholder:text-gray-400 bg-white pl-3 pr-10 text-left focus-visible:border-indigo-500 focus-visible:ring-0 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="members"
            >
              Members
            </label>
            <MultiSelect
              selectedItems={selected}
              setSelectedItems={setSelected}
              items={(users || []).map((user) => ({
                value: user.id,
                label: user.email,
              }))}
            />
          </div>
          <button
            type="button"
            onClick={handleCreate}
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
              "Create"
            )}
          </button>
        </form>
      </Modal>
    </>
  );
};

export default GroupsTable;
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Group, Project, User } from "../../../lib/types";
import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import MultiSelect from "../../ui/MultiSelect";
import Table from "../../ui/Table";
import TableEmpty from "../../ui/TableEmpty";
import TableLoading from "../../ui/TableLoading";
import GroupRow from "./GroupRow";

type Props = {
  groups: Group[] | undefined;
  users: User[] | undefined;
  projects: Project[] | undefined;
  setGroups: React.Dispatch<React.SetStateAction<Group[] | undefined>>;
};

const GroupsTable: React.FC<Props> = ({
  groups,
  users,
  setGroups,
  projects,
}) => {
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
      if (!name.trim()) throw new Error("Please enter a name for the group.");
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
      setGroups((prev) => [
        ...(prev || []),
        { created_at: new Date(), id: data?.[0].id, name },
      ]);
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
          groups.map((group) => (
            <GroupRow key={group.id} group={group} projects={projects} />
          ))
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
          <Button loading={loading} onClick={handleCreate}>
            Create
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default GroupsTable;

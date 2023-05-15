import React, { useEffect } from "react";
import { ThreeDots } from "react-loader-spinner";
import { Group, Member, Project } from "../../lib/types";
import Table from "../core/Table";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "react-hot-toast";
import Modal from "../core/Modal";

type Props = {
  groups: Group[] | undefined;
};

const GroupsTable: React.FC<Props> = ({ groups }) => {
  const [open, setOpen] = React.useState(false);
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

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
          <tr>
            <td
              colSpan={3}
              className="px-3 py-4 text-sm text-gray-900 font-medium"
            >
              No groups found. Click on the button above to create a new group.
            </td>
          </tr>
        )}
        {groups ? (
          groups.map((group, i) => <GroupRow group={group} />)
        ) : (
          <tr>
            <td
              colSpan={4}
              className="px-3 py-4 text-sm text-gray-900 font-medium"
            >
              <ThreeDots
                height="40"
                width="40"
                radius="9"
                color="#000"
                ariaLabel="three-dots-loading"
                wrapperClass="w-full h-full flex items-center justify-center"
                visible={true}
              />
            </td>
          </tr>
        )}
      </Table>
      <Modal open={open} closeModal={closeModal} title="Create a new group">
        <p className="mt-2 text-sm text-gray-500">
          Please enter the name of the group and select the members you want to
          add to the group.
        </p>
        <form className="mt-4">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Group name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="members"
            >
              Members
            </label>
            <select
              name="members"
              id="members"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="1">Member 1</option>
              <option value="2">Member 2</option>
              <option value="3">Member 3</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Create
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

const GroupRow = ({ group }: { group: Group }) => {
  const [members, setMembers] = React.useState<Member[]>();
  const [projects, setProjects] = React.useState<Project[]>();
  const supabase = useSupabaseClient();

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .filter("assigned_group", "eq", group.id);

        if (error) throw error;

        setProjects(data as Project[]);

        const { data: membersData, error: membersError } = await supabase
          .from("members")
          .select("*")
          .filter("group_id", "eq", group.id);

        if (membersError) throw membersError;

        setMembers(membersData as Member[]);
      } catch (err) {
        console.error(err);
        toast.error("Error fetching projects");
      }
    })();
  }, [group]);

  return (
    <tr key={group.id}>
      <td className="whitespace-nowrap capitalize px-3 py-4 text-sm text-gray-900 font-medium">
        {group.name}
      </td>
      <td
        align="center"
        className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
      >
        {members?.length || 0}
      </td>
      <td
        align="center"
        className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
      >
        {projects?.length || 0}
      </td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <a href="#" className="text-indigo-600 hover:text-indigo-900">
          View
        </a>
      </td>
    </tr>
  );
};

export default GroupsTable;

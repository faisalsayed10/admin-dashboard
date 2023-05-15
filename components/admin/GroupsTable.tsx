import React, { useEffect } from "react";
import { ThreeDots } from "react-loader-spinner";
import { Group, Member, Project } from "../../lib/types";
import Table from "../core/Table";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "react-hot-toast";

type Props = {
  groups: Group[] | undefined;
};

const GroupsTable: React.FC<Props> = ({ groups }) => {
  return (
    <Table
      hasEndButton
      button="Create group"
      cols={["Name", "Members", "Tasks"]}
      description="A list of all the groups currently in the system."
      heading="Groups"
      onBtnClick={() => console.log("Add group")}
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

import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { Group, Member, Project } from "../../../lib/types";
import { toast } from "react-hot-toast";

const GroupRow = ({ group }: { group: Group }) => {
  const [members, setMembers] = useState<Member[]>();
  const [projects, setProjects] = useState<Project[]>();
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
      <td className="whitespace-nowrap truncate max-w-[185px] capitalize px-3 py-4 text-sm text-gray-900 font-medium">
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

export default GroupRow;

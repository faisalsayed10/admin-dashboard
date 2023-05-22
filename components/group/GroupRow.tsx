import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Group, Member, Project } from "../../lib/types";
import Link from "next/link";

const GroupRow = ({
  group,
  projects,
}: {
  group: Group;
  projects?: Project[];
}) => {
  const [members, setMembers] = useState<Member[]>();
  const supabase = useSupabaseClient();

  useEffect(() => {
    (async () => {
      try {
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
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {members?.length || 0}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {projects?.filter((p) => p?.assigned_group?.id === group.id).length ||
          0}
      </td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <Link href={`/groups/${group.id}`}>
          <span className="text-indigo-600 hover:text-indigo-900 cursor-pointer">View</span>
        </Link>
      </td>
    </tr>
  );
};

export default GroupRow;

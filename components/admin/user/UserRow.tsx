import { useEffect, useState } from "react";
import { Project, User } from "../../../lib/types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "react-hot-toast";

const UserRow = ({ person }: { person: User }) => {
  const [projects, setProjects] = useState<Project[]>();
  const supabase = useSupabaseClient();

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .filter("assigned_user", "eq", person.id);

        if (error) throw error;

        setProjects(data as Project[]);
      } catch (err) {
        console.error(err);
        toast.error("Error fetching projects");
      }
    })();
  }, [person]);

  return (
    <tr key={person.id}>
      <td className="whitespace-nowrap truncate max-w-[220px] px-3 py-4 text-sm text-gray-900 font-medium">
        {person.email}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {person.role}
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

export default UserRow;
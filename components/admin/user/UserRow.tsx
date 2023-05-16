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
      <td className="whitespace-nowrap truncate max-w-[250px] px-3 py-4 text-sm text-gray-900 font-medium">
        {person.email}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {person.role}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {projects?.length || 0}
      </td>
    </tr>
  );
};

export default UserRow;

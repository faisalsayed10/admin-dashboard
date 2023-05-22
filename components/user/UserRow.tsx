import { Project, User } from "../../lib/types";

const UserRow = ({
  person,
  projects,
}: {
  person: User;
  projects?: Project[];
}) => {
  return (
    <tr key={person.id}>
      <td className="whitespace-nowrap truncate max-w-[250px] px-3 py-4 text-sm text-gray-900 font-medium">
        {person.email}
      </td>
      <td className="whitespace-nowrap capitalize px-3 py-4 text-sm text-gray-500">
        {person.role}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {projects?.filter((p) => p?.assigned_user?.id === person.id).length ||
          0}
      </td>
    </tr>
  );
};

export default UserRow;

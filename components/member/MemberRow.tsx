import React, { useRef, useState } from "react";
import { User } from "../../lib/types";

type Props = {
  user: User & { is_in_group: boolean };
  setAdded: React.Dispatch<React.SetStateAction<User[]>>;
  setRemoved: React.Dispatch<React.SetStateAction<User[]>>;
};

const MemberRow: React.FC<Props> = ({ user, setAdded, setRemoved }) => {
  const checkRef = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState(user.is_in_group);

  return (
    <tr
      key={user.id}
      onClick={() => checkRef.current?.click()}
      className={`cursor-pointer ${checked && "bg-gray-100"}`}
    >
      <td className="whitespace-nowrap truncate max-w-[250px] px-3 py-4 text-sm text-gray-900 font-medium">
        <input
          type="checkbox"
          ref={checkRef}
          checked={checked}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            setChecked(e.target.checked);
            if (e.target.checked) {
              setRemoved((prev) => prev.filter((u) => u.id !== user.id));
              if (user.is_in_group) return;
              setAdded((prev) => [...prev, user]);
            } else {
              setAdded((prev) => prev.filter((u) => u.id !== user.id));
              if (!user.is_in_group) return;
              setRemoved((prev) => [...prev, user]);
            }
          }}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 accent-indigo-600"
        />
      </td>
      <td
        className={`whitespace-nowrap truncate max-w-[250px] px-3 py-4 text-sm text-gray-900 font-medium ${
          checked ? "font-semibold text-indigo-600" : ""
        }`}
      >
        {user.email}
      </td>
      <td
        className={`whitespace-nowrap capitalize px-3 py-4 text-sm text-gray-500 ${
          checked ? "font-semibold text-indigo-500" : ""
        }`}
      >
        {user.role}
      </td>
    </tr>
  );
};

export default MemberRow;

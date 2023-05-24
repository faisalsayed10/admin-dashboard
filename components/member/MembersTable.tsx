import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { getAllMembers, getAllUsers } from "../../lib/supabase";
import { User } from "../../lib/types";
import Table from "../ui/Table";
import TableLoading from "../ui/TableLoading";
import MemberRow from "./MemberRow";
import { toast } from "react-hot-toast";

type Props = {};

const MembersTable: React.FC<Props> = () => {
  const [users, setUsers] = useState<(User & { is_in_group: boolean })[]>([]);
  const [added, setAdded] = useState<User[]>([]);
  const [removed, setRemoved] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const group_id = parseInt(router.query.id as string);

  useEffect(() => {
    (async () => {
      try {
        const users = (await getAllUsers()) || [];
        const members = (await getAllMembers(group_id)) || [];
        setUsers(
          (users || []).map((user) => ({
            ...user,
            is_in_group: members.find((member) => member.user_id === user.id)
              ? true
              : false,
          }))
        );
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const handleSave = async () => {
    if (!added.length && !removed.length) return;

    try {
      setLoading(true);

      await toast.promise(
        fetch("/api/members", {
          method: "POST",
          body: JSON.stringify({
            group_id,
            added: added.map((user) => user.id),
            removed: removed.map((user) => user.id),
          }),
          headers: { "Content-Type": "application/json" },
        }),
        {
          loading: "Saving...",
          success: "Edited members successfully!",
          error: "Something went wrong.",
        }
      );

      router.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Table
        cols={["", "Email", "Role"]}
        description="A list of all the members currently in this group."
        heading="Members"
        button="Save Changes"
        btnProps={{
          onClick: handleSave,
          disabled: loading,
          children: loading && "Saving...",
        }}
      >
        {users ? (
          users.map((user) => (
            <MemberRow
              key={user.id}
              user={user}
              setAdded={setAdded}
              setRemoved={setRemoved}
            />
          ))
        ) : (
          <TableLoading colSpan={3} />
        )}
      </Table>
    </>
  );
};

export default MembersTable;

import { useEffect, useState } from "react";
import UsersTable from "../components/user/UsersTable";
import { getAllProjects, getAllUsers } from "../lib/supabase";
import { Project, User } from "../lib/types";
import Layout from "../components/Layout";

const Users = () => {
  const [projects, setProjects] = useState<Project[] | undefined>();
  const [users, setUsers] = useState<User[] | undefined>();

  useEffect(() => {
    (async () => {
      setProjects(await getAllProjects());
      setUsers(await getAllUsers());
    })();
  }, []);

  return (
    <Layout>
      <UsersTable projects={projects} users={users} />
    </Layout>
  );
};

export default Users;

import { useEffect, useState } from "react";
import UsersTable from "../components/user/UsersTable";
import { getAllProjects, getAllUsers } from "../lib/supabase";
import { Project, User } from "../lib/types";
import Layout from "../components/Layout";
import { GetServerSidePropsContext } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

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

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: { destination: "/login", permanent: false },
    };

  return {
    props: { initialSession: session, user: session.user },
  };
};

export default Users;

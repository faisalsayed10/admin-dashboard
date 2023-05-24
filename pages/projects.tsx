import { useEffect, useState } from "react";
import ProjectsTable from "../components/project/ProjectsTable";
import { getAllGroups, getAllProjects, getAllUsers } from "../lib/supabase";
import { Group, Project, User } from "../lib/types";
import Layout from "../components/Layout";
import { GetServerSidePropsContext } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

const Projects = () => {
  const [groups, setGroups] = useState<Group[] | undefined>();
  const [projects, setProjects] = useState<Project[] | undefined>();
  const [users, setUsers] = useState<User[] | undefined>();

  useEffect(() => {
    (async () => {
      setGroups(await getAllGroups());
      setProjects(await getAllProjects());
      setUsers(await getAllUsers());
    })();
  }, []);

  return (
    <Layout>
      <ProjectsTable
        groups={groups}
        projects={projects}
        setProjects={setProjects}
        users={users}
      />
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

export default Projects;

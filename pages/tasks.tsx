import { useEffect, useState } from "react";
import TasksTable from "../components/task/TasksTable";
import { getAllProjects, getAllTasks } from "../lib/supabase";
import { Project, Task } from "../lib/types";
import Layout from "../components/Layout";
import { GetServerSidePropsContext } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

const Projects = () => {
  const [tasks, setTasks] = useState<Task[] | undefined>();
  const [projects, setProjects] = useState<Project[] | undefined>();

  useEffect(() => {
    (async () => {
      setTasks(await getAllTasks());
      setProjects(await getAllProjects());
    })();
  }, []);

  return (
    <Layout>
      <TasksTable setTasks={setTasks} projects={projects} tasks={tasks} />
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

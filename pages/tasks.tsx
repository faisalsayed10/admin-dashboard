import { useEffect, useState } from "react";
import TasksTable from "../components/task/TasksTable";
import { getAllProjects, getAllTasks } from "../lib/supabase";
import { Project, Task } from "../lib/types";
import Layout from "../components/Layout";

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

export default Projects;

import {
  SupabaseClient,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Group, Project, Task, User } from "../../lib/types";
import UsersTable from "./UsersTable";
import GroupsTable from "./GroupsTable";
import ProjectsTable from "./ProjectsTable";
import TasksTable from "./TasksTable";

type Props = {};

const AdminDashboard = (props: Props) => {
  const supabase = useSupabaseClient();
  const [groups, setGroups] = useState<any>([]);
  const [projects, setProjects] = useState<any>([]);
  const [users, setUsers] = useState<any>([]);
  const [tasks, setTasks] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setGroups(await getGroups(supabase));
      setProjects(await getProjects(supabase));
      setUsers(await getUsers(supabase));
      setTasks(await getTasks(supabase));
      setLoading(false);
    })();
  }, []);

  return (
    <div className="grid gap-y-8 md:grid-cols-2">
      <UsersTable />
      <GroupsTable />
      <ProjectsTable />
      <TasksTable />
    </div>
  );
};

async function getGroups(supabase: SupabaseClient) {
  try {
    let { data, error, status } = await supabase.from("groups").select(`*`);
    if (error && status !== 406) {
      throw error;
    }
    console.log(data);
    return data as Group[];
  } catch (error: any) {
    console.error(error);
    toast.error(`An error occurred: ${error.message}`);
  }
}

async function getProjects(supabase: SupabaseClient) {
  try {
    let { data, error, status } = await supabase.from("projects").select(`*`);
    if (error && status !== 406) {
      throw error;
    }
    console.log(data);
    return data as Project[];
  } catch (error: any) {
    console.error(error);
    toast.error(`An error occurred: ${error.message}`);
  }
}

async function getUsers(supabase: SupabaseClient) {
  try {
    let { data, error, status } = await supabase.from("users").select(`*`);
    if (error && status !== 406) {
      throw error;
    }
    console.log(data);
    return data as User[];
  } catch (error: any) {
    console.error(error);
    toast.error(`An error occurred: ${error.message}`);
  }
}

async function getTasks(supabase: SupabaseClient) {
  try {
    let { data, error, status } = await supabase.from("tasks").select(`*`);
    if (error && status !== 406) {
      throw error;
    }

    console.log(data);
    return data as Task[];
  } catch (error: any) {
    console.error(error);
    toast.error(`An error occurred: ${error.message}`);
  }
}

export default AdminDashboard;

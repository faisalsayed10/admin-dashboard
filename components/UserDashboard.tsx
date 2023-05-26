import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { TaskWithProject } from "../lib/types";
import UserTasksTable from "./task/UserTasksTable";

const UserDashboard = () => {
  const [tasks, setTasks] = useState<TaskWithProject[]>();
  const supabase = useSupabaseClient();
  const user = useUser();

  const getTasks = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("tasks")
        .select(`*, project_id!inner (*, assigned_user (*), assigned_group(*))`)
        .or(`assigned_user.eq.${user.id},assigned_group.gte.0`, {
          foreignTable: "project_id",
        });

      const { data: groups, error: groupsError } = await supabase
        .from("members")
        .select("*")
        .filter("user_id", "eq", user.id);

      if (error || groupsError) throw error || groupsError;

      const filteredTasks = (data as TaskWithProject[]).filter((task) => {
        if (task.project_id.assigned_user?.id === user.id) return true;

        const group = groups.find(
          (group) => group.group_id === task.project_id.assigned_group?.id
        );

        if (group) return true;

        return false;
      });

      setTasks(filteredTasks);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  return <UserTasksTable tasks={tasks} />;
};

export default UserDashboard;

import { useEffect, useState } from "react";
import {
  getAllGroups,
  getAllProjects,
  getAllTasks,
  getAllUsers,
} from "../lib/supabase";
import { Group, Project, Task, User } from "../lib/types";
import GroupsTable from "./group/GroupsTable";
import ProjectsTable from "./project/ProjectsTable";
import TasksTable from "./task/TasksTable";
import UsersTable from "./user/UsersTable";

const AdminDashboard = () => {
  const [groups, setGroups] = useState<Group[] | undefined>();
  const [projects, setProjects] = useState<Project[] | undefined>();
  const [users, setUsers] = useState<User[] | undefined>();
  const [tasks, setTasks] = useState<Task[] | undefined>();

  useEffect(() => {
    (async () => {
      setGroups(await getAllGroups());
      setProjects(await getAllProjects());
      setUsers(await getAllUsers());
      setTasks(await getAllTasks());
    })();
  }, []);

  return (
    <div className="grid gap-y-8 md:grid-cols-2">
      <div className="col-span-2">
        <UsersTable users={users} projects={projects} limit={5} />
      </div>
      <GroupsTable
        groups={groups}
        setGroups={setGroups}
        users={users}
        projects={projects}
        limit={5}
      />
      <ProjectsTable
        projects={projects}
        setProjects={setProjects}
        groups={groups}
        users={users}
        limit={5}
      />
      <div className="col-span-2">
        <TasksTable
          tasks={tasks}
          projects={projects}
          setTasks={setTasks}
          limit={5}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;

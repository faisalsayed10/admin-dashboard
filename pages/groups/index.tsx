import { useEffect, useState } from "react";
import GroupsTable from "../../components/group/GroupsTable";
import { getAllGroups, getAllProjects, getAllUsers } from "../../lib/supabase";
import { Group, Project, User } from "../../lib/types";
import Layout from "../../components/Layout";

const Groups = () => {
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
      <GroupsTable
        groups={groups}
        projects={projects}
        setGroups={setGroups}
        users={users}
      />
    </Layout>
  );
};

export default Groups;

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import ResponsesTable from "../../components/response/ResponsesTable";
import { Task, TaskWithProject, User } from "../../lib/types";

const TaskId = () => {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const [task, setTask] = useState<Task | null>(null);
  const [assignees, setAssignees] = useState<User[]>([]);

  useEffect(() => {
    if (!router.query.id) return;

    (async () => {
      try {
        const { data, error } = await supabase
          .from("tasks")
          .select(
            `*, project_id!inner (*, assigned_user (*), assigned_group(*))`
          )
          .eq("id", router.query.id)
          .single();

        if (error) throw error;
        setTask(data as TaskWithProject);

        if (data.project_id.assigned_user) {
          setAssignees([data.project_id.assigned_user]);
        } else if (data.project_id.assigned_group) {
          const { data: members, error: membersError } = await supabase
            .from("members")
            .select("user_id!inner (*)")
            .eq("group_id", data.project_id.assigned_group.id);

          if (membersError) throw membersError;
          setAssignees(members.map((member) => member.user_id as User));
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, [router.query.id]);

  return (
    <Layout>
      <h1 className="text-3xl mx-4 sm:mx-6 lg:mx-8 font-bold text-gray-900 mb-2 capitalize">
        {task?.name || "Loading..."}
      </h1>
      <p className="text-gray-500 text-sm mx-4 sm:mx-6 lg:mx-8 mb-4">
        <b>Description:</b> {task?.description}
      </p>

      <ResponsesTable assignees={assignees} />
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

export default TaskId;

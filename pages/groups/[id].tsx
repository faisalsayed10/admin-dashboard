import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import MembersTable from "../../components/member/MembersTable";
import { Group } from "../../lib/types";

const GroupId = () => {
  const router = useRouter();
  const { id } = router.query;
  const supabase = useSupabaseClient();
  const [group, setGroup] = useState<Group | null>(null);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const { data, error } = await supabase
          .from("groups")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setGroup(data as Group);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [id]);

  return (
    <Layout>
      <h1 className="text-3xl mx-4 sm:mx-6 lg:mx-8 font-bold text-gray-900 mb-4 capitalize">
        {group?.name || "Loading..."}
      </h1>

      <MembersTable />
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

export default GroupId;

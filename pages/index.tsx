import {
  User as SupabaseUser,
  createServerSupabaseClient,
} from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import AdminDashboard from "../components/AdminDashboard";
import ChooseRole from "../components/ChooseRole";
import Layout from "../components/Layout";
import UserDashboard from "../components/UserDashboard";
import { User } from "../lib/types";

export default function Home({ user }: { user: SupabaseUser }) {
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<User | null>(null);
  const supabase = useSupabaseClient();

  useEffect(() => {
    (async () => {
      try {
        if (!user) return;
        setLoading(true);

        let { data, error, status } = await supabase
          .from("users")
          .select(`*`)
          .eq("id", user.id)
          .single();

        if (error && status !== 406) throw error;
        setInfo(data as User);
      } catch (error) {
        console.error(error);
        toast.error("Error fetching user data!");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (info && !info.role) return <ChooseRole />;

  return (
    <Layout loading={!info || loading} showSidebar={info?.role !== "user"}>
      {info?.role === "admin" ? (
        <AdminDashboard />
      ) : info?.role === "user" ? (
        <UserDashboard />
      ) : null}
    </Layout>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };

  return {
    props: {
      initialSession: session,
      user: session.user,
    },
  };
};

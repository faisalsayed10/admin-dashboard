import { AppShell, LoadingOverlay } from "@mantine/core";
import {
  User,
  createServerSupabaseClient,
} from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AdminDashboard from "../components/AdminDashboard";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import UserDashboard from "../components/UserDashboard";
import ChooseRole from "../components/ChooseRole";
import { toast } from "react-hot-toast";

export default function Home({ user }: { user: User }) {
  const supabase = useSupabaseClient();
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<{
    email: string;
    role: "admin" | "user";
  } | null>(null);

  useEffect(() => {
    getUserData();
  }, []);

  async function getUserData() {
    try {
      if (!user) return;
      setLoading(true);

      let { data, error, status } = await supabase
        .from("users")
        .select(`email, role`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      setInfo(data);
      console.log(data);
    } catch (error) {
      toast.error("Error fetching user data!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingOverlay visible={loading} />;
  if (info && !info.role) return <ChooseRole />;

  return (
    <AppShell
      padding="md"
      navbar={<Navbar />}
      header={<Header />}
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
        body: { minHeight: "calc(100vh - 60px)" },
      })}
    >
      <LoadingOverlay visible={!info || loading} />
      {info?.role === "admin" ? (
        <AdminDashboard />
      ) : info?.role === "user" ? (
        <UserDashboard />
      ) : null}
    </AppShell>
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

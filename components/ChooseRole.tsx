import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import React from "react";

type Props = {};

const ChooseRole = (props: Props) => {
  const user = useUser();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const updateRole = async (role: "admin" | "user") => {
    try {
      if (!user) return;
      await supabase.from("users").update({ role }).eq("id", user.id);
      router.reload();
    } catch (error) {
      alert("Error updating role!");
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Choose your role</h1>
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => updateRole("admin")}
          className="px-4 py-2 text-white bg-blue-600 rounded-md"
        >
          Admin
        </button>
        <button
          onClick={() => updateRole("user")}
          className="px-4 py-2 text-white bg-blue-600 rounded-md"
        >
          User
        </button>
      </div>
    </div>
  );
};

export default ChooseRole;

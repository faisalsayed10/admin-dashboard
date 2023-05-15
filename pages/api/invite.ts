import { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../lib/supabase-admin";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { emails } = req.body;
    const supabase = createServerSupabaseClient({ req, res });

    const { user } = (await supabase.auth.getUser()).data;
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const { data: details } = await supabase
      .from("users")
      .select("role")
      .eq("id", user?.id)
      .single();

    if (details?.role !== "admin")
      return res.status(401).json({ error: "Unauthorized" });

    emails.split(",").forEach(async (email: string) => {
      await supabaseAdmin.auth.admin.inviteUserByEmail(email);
    });

    return res.status(200).json({ message: "Success" });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}

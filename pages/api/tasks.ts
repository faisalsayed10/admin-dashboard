import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import { TaskBody } from "../../lib/types";
import { supabaseAdmin } from "../../lib/supabase-admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const supabase = createServerSupabaseClient({ req, res });
    const { task_id, assigned_id, body } = req.body;

    const { user } = (await supabase.auth.getUser()).data;
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const { data: details } = await supabase
      .from("users")
      .select("role")
      .eq("id", user?.id)
      .single();

    if (details?.role !== "admin")
      return res.status(401).json({ error: "Unauthorized" });

    const isUser = isNaN(parseInt(assigned_id));

    if (isUser) {
      await supabaseAdmin.from("responses").insert([
        {
          user_id: assigned_id,
          task_parent_id: task_id,
          body: body.map((item: TaskBody) => ({ ...item, response: null })),
        },
      ]);

      return res.status(200).json({ message: "Success" });
    }

    const { data } = await supabaseAdmin
      .from("members")
      .select("user_id")
      .filter("group_id", "eq", assigned_id);

    const { error } = await supabaseAdmin.from("responses").insert(
      (data || []).map((member) => ({
        user_id: member.user_id,
        task_parent_id: task_id,
        body: body.map((item: TaskBody) => ({ ...item, response: null })),
      }))
    );

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({ message: "Success" });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}

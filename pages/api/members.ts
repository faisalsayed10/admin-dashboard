import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const supabase = createServerSupabaseClient({ req, res });
    const { group_id, added, removed } = req.body as {
      group_id: number;
      added: string[];
      removed: string[];
    };

    const { user } = (await supabase.auth.getUser()).data;
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const { data: details } = await supabase
      .from("users")
      .select("role")
      .eq("id", user?.id)
      .single();

    if (details?.role !== "admin")
      return res.status(401).json({ error: "Unauthorized" });

    for await (const id of added) {
      const { error } = await supabase
        .from("members")
        .insert([{ group_id, user_id: id }]);

      if (error) return res.status(500).json({ error: error.message });
    }

    for await (const id of removed) {
      const { error } = await supabase
        .from("members")
        .delete()
        .eq("group_id", group_id)
        .eq("user_id", id);

      if (error) return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ message: "Success" });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}

import { Group, Member, Project, Task, User } from "./types";
import { toast } from "react-hot-toast";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export const getAllGroups = async () => {
  try {
    let { data, error, status } = await supabase.from("groups").select(`*`);
    if (error && status !== 406) throw error;
    return data as Group[];
  } catch (error: any) {
    console.error(error);
    toast.error(`An error occurred: ${error.message}`);
  }
};

export const getAllProjects = async () => {
  try {
    let { data, error, status } = await supabase.from("projects").select(`
      id,
      name,
      assigned_group ( id, name ),
      assigned_user ( id, email )
    `);
    if (error && status !== 406) throw error;
    return data as Project[];
  } catch (error: any) {
    console.error(error);
    toast.error(`An error occurred: ${error.message}`);
  }
};

export const getAllUsers = async () => {
  try {
    let { data, error, status } = await supabase.from("users").select(`*`);
    if (error && status !== 406) throw error;
    return data as User[];
  } catch (error: any) {
    console.error(error);
    toast.error(`An error occurred: ${error.message}`);
  }
};

export const getAllMembers = async (group_id: number) => {
  try {
    let { data, error, status } = await supabase
      .from("members")
      .select(`*`)
      .filter("group_id", "eq", group_id);
    if (error && status !== 406) throw error;
    return data as Member[];
  } catch (error: any) {
    console.error(error);
    toast.error(`An error occurred: ${error.message}`);
  }
};

export const getAllTasks = async () => {
  try {
    let { data, error, status } = await supabase.from("tasks").select(`*`);
    if (error && status !== 406) {
      throw error;
    }

    return data as Task[];
  } catch (error: any) {
    console.error(error);
    toast.error(`An error occurred: ${error.message}`);
  }
};

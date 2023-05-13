import {
  SupabaseClient,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Group, Project, Task, User } from "../lib/types";

type Props = {};

const AdminDashboard = (props: Props) => {
  const supabase = useSupabaseClient();
  const [groups, setGroups] = useState<any>([]);
  const [projects, setProjects] = useState<any>([]);
  const [users, setUsers] = useState<any>([]);
  const [tasks, setTasks] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const people = [
    {
      name: "Lindsay Walton",
      title: "Front-end Developer",
      email: "lindsay.walton@example.com",
      role: "Member",
    },
    {
      name: "Lindsay Walton",
      title: "Front-end Developer",
      email: "lindsay.walton@example.com",
      role: "Member",
    },
    {
      name: "Lindsay Walton",
      title: "Front-end Developer",
      email: "lindsay.walton@example.com",
      role: "Member",
    },
  ];

  useEffect(() => {
    (async () => {
      setLoading(true);
      setGroups(await getGroups(supabase));
      setProjects(await getProjects(supabase));
      setUsers(await getUsers(supabase));
      setTasks(await getTasks(supabase));
      setLoading(false);
    })();
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Users
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the users in your account including their name, title,
            email and role.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add user
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {people.map((person) => (
                    <tr key={person.email}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {person.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {person.title}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {person.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {person.role}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a
                          href="#"
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit<span className="sr-only">, {person.name}</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

async function getGroups(supabase: SupabaseClient) {
  try {
    let { data, error, status } = await supabase.from("groups").select(`*`);
    if (error && status !== 406) {
      throw error;
    }
    console.log(data);
    return data as Group[];
  } catch (error: any) {
    console.error(error);
    toast.error(`An error occurred: ${error.message}`);
  }
}

async function getProjects(supabase: SupabaseClient) {
  try {
    let { data, error, status } = await supabase.from("projects").select(`*`);
    if (error && status !== 406) {
      throw error;
    }
    console.log(data);
    return data as Project[];
  } catch (error: any) {
    console.error(error);
    toast.error(`An error occurred: ${error.message}`);
  }
}

async function getUsers(supabase: SupabaseClient) {
  try {
    let { data, error, status } = await supabase.from("users").select(`*`);
    if (error && status !== 406) {
      throw error;
    }
    console.log(data);
    return data as User[];
  } catch (error: any) {
    console.error(error);
    toast.error(`An error occurred: ${error.message}`);
  }
}

async function getTasks(supabase: SupabaseClient) {
  try {
    let { data, error, status } = await supabase.from("tasks").select(`*`);
    if (error && status !== 406) {
      throw error;
    }

    console.log(data);
    return data as Task[];
  } catch (error: any) {
    console.error(error);
    toast.error(`An error occurred: ${error.message}`);
  }
}

export default AdminDashboard;

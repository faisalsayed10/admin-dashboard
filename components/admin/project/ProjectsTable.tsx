import { useSupabaseClient } from "@supabase/auth-helpers-react";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { RotatingLines, ThreeDots } from "react-loader-spinner";
import { Group, Project, User } from "../../../lib/types";
import Modal from "../../ui/Modal";
import SingleSelect from "../../ui/SingleSelect";
import Table from "../../ui/Table";
import ProjectRow from "./ProjectRow";

type Props = {
  projects: Project[] | undefined;
  users: User[] | undefined;
  groups: Group[] | undefined;
};

const ProjectsTable: React.FC<Props> = ({ projects, users, groups }) => {
  const supabase = useSupabaseClient();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<string>("");
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  const handleCreate = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (!name.trim()) throw new Error("Please enter a name for the project.");
      setLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .insert({
          name,
          ...(isNaN(Number(selected))
            ? { assigned_user: selected }
            : { assigned_group: selected }),
        })
        .select("id");

      if (error) throw error;

      projects?.push({
        created_at: new Date(),
        id: data?.[0].id,
        name,
        ...(isNaN(Number(selected))
          ? { assigned_user: { id: selected, email: "" } }
          : { assigned_group: { id: Number(selected), name: "" } }),
      });
      setLoading(false);
      closeModal();
      toast.success("Project created successfully!");
    } catch (err: any) {
      toast.error(err.message);
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <>
      <Table
        button="Create project"
        cols={["Name", "Assigned to"]}
        description="A list of all the projects currently in the system."
        heading="Projects"
        onBtnClick={openModal}
      >
        {projects && projects.length < 1 && (
          <tr>
            <td
              align="center"
              colSpan={3}
              className="px-3 py-4 text-sm text-gray-900 font-medium"
            >
              No projects found. Create a project.
            </td>
          </tr>
        )}
        {projects ? (
          projects.map((p) => (
            <ProjectRow
              key={p.id}
              project={p}
              users={users || []}
              groups={groups || []}
            />
          ))
        ) : (
          <tr>
            <td
              colSpan={3}
              className="px-3 py-4 text-sm text-gray-900 font-medium"
            >
              <ThreeDots
                height="40"
                width="40"
                radius="9"
                color="#000"
                ariaLabel="three-dots-loading"
                wrapperClass="w-full h-full flex items-center justify-center"
                visible={true}
              />
            </td>
          </tr>
        )}
      </Table>

      <Modal open={open} closeModal={closeModal} title="Create a new project">
        <p className="mt-2 text-sm text-gray-500">
          Please enter the name of the project that you want to create.
        </p>
        <form className="mt-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Project name"
              className="relative w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline placeholder:text-gray-400 bg-white pl-3 pr-10 text-left focus-visible:border-indigo-500 focus-visible:ring-0 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Assignee
            </label>
            <SingleSelect
              selected={selected}
              setSelected={setSelected}
              items={(users || ([] as any[]))
                .concat(groups || ([] as any[]))
                .map((item) => ({
                  value: item.id,
                  label: item.email || item.name,
                }))}
            />
          </div>
          <button
            type="button"
            onClick={handleCreate}
            disabled={loading}
            className="inline-flex mt-2 justify-center w-full rounded-md border border-transparent px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:text-sm disabled:opacity-50"
          >
            {loading ? (
              <RotatingLines
                strokeColor="grey"
                strokeWidth="2"
                animationDuration="0.75"
                width="16"
                visible={true}
              />
            ) : (
              "Create"
            )}
          </button>
        </form>
      </Modal>
    </>
  );
};

export default ProjectsTable;

import { useSupabaseClient } from "@supabase/auth-helpers-react";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Group, Project, User } from "../../lib/types";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import SingleSelect from "../ui/SingleSelect";
import Table from "../ui/Table";
import TableEmpty from "../ui/TableEmpty";
import TableLoading from "../ui/TableLoading";
import ProjectRow from "./ProjectRow";
import TableShowMore from "../ui/TableShowMore";

type Props = {
  limit?: number;
  projects: Project[] | undefined;
  users: User[] | undefined;
  groups: Group[] | undefined;
  setProjects: React.Dispatch<React.SetStateAction<Project[] | undefined>>;
};

const ProjectsTable: React.FC<Props> = (props) => {
  const { projects, users, groups, setProjects, limit } = props;
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

      setProjects((prev) => [
        ...(prev || []),
        {
          created_at: new Date(),
          id: data?.[0].id,
          name,
          ...(isNaN(Number(selected))
            ? { assigned_user: { id: selected, email: "" } }
            : { assigned_group: { id: Number(selected), name: "" } }),
        },
      ]);
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
        btnProps={{ onClick: openModal }}
      >
        {projects && projects.length < 1 && (
          <TableEmpty
            colSpan={2}
            message="No projects found. Create a project."
          />
        )}
        {projects ? (
          <>
            {projects.slice(0, limit).map((p) => (
              <ProjectRow
                key={p.id}
                project={p}
                users={users || []}
                groups={groups || []}
              />
            ))}
            {limit && projects.length > limit && (
              <TableShowMore colSpan={2} href="/users" />
            )}
          </>
        ) : (
          <TableLoading colSpan={2} />
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
          <Button loading={loading} onClick={handleCreate}>
            Create
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default ProjectsTable;

import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { RotatingLines } from "react-loader-spinner";
import { Project } from "../../../lib/types";
import Modal from "../../ui/Modal";
import SingleSelect from "../../ui/SingleSelect";

type Props = {
  project: Project;
  users: any[];
  groups: any[];
};

const ProjectRow = ({ project, users, groups }: Props) => {
  const supabase = useSupabaseClient();
  const [assignee, setAssignee] = useState("");
  const [selected, setSelected] = useState<any>("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  useEffect(() => {
    (async () => {
      if (project.assigned_group) {
        setAssignee(
          groups.find((group) => group.id === project.assigned_group)?.name
        );
        setSelected(project.assigned_group);
      } else if (project.assigned_user) {
        setAssignee(
          users.find((user) => user.id === project.assigned_user)?.email
        );
        setSelected(project.assigned_user);
      }
    })();
  }, [project]);

  const handleEdit = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .update({
          ...(isNaN(Number(selected))
            ? { assigned_user: selected, assigned_group: null }
            : { assigned_group: selected, assigned_user: null }),
        })
        .eq("id", project.id)
        .select("id");

      if (error) throw error;

      if (isNaN(Number(selected))) {
        setAssignee(users.find((user) => user.id === selected)?.email);
      } else {
        setAssignee(
          groups.find((group) => group.id === Number(selected))?.name
        );
      }

      setLoading(false);
      closeModal();
      toast.success("Project updated successfully!");
    } catch (err: any) {
      toast.error(err.message);
      console.error(err);
    }
  };

  return (
    <>
      <tr key={project.id}>
        <td className="whitespace-nowrap capitalize px-3 py-4 text-sm text-gray-900 font-medium">
          {project.name}
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          {assignee ? (
            <div className="flex items-center gap-2">
              <p>{assignee}</p>
              <button onClick={openModal}>
                <PencilSquareIcon className="h-4 w-4 text-gray-900" />
              </button>
            </div>
          ) : (
            "Unassigned"
          )}
        </td>
        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
          <a href="#" className="text-indigo-600 hover:text-indigo-900">
            View
          </a>
        </td>
      </tr>
      <Modal open={open} closeModal={closeModal} title="Change Assignee">
        <div className="mt-4">
          <SingleSelect
            selected={selected}
            setSelected={setSelected}
            items={users.concat(groups as any).map((item) => ({
              value: item.id,
              label: item.email || item.name,
            }))}
          />
        </div>
        <button
          type="button"
          onClick={handleEdit}
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
            "Invite"
          )}
        </button>
      </Modal>
    </>
  );
};

export default ProjectRow;

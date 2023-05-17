import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Project } from "../../../lib/types";
import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import SingleSelect from "../../ui/SingleSelect";

type Props = {
  project: Project;
  users: any[];
  groups: any[];
};

const ProjectRow = ({ project, users, groups }: Props) => {
  const supabase = useSupabaseClient();
  const [selected, setSelected] = useState<any>("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assignee, setAssignee] = useState("");

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  useEffect(() => {
    (async () => {
      if (project.assigned_group) {
        setSelected(project.assigned_group.id);
        setAssignee(project.assigned_group.name);
      } else if (project.assigned_user) {
        setSelected(project.assigned_user.id);
        setAssignee(project.assigned_user.email);
      }
    })();
  }, [project]);

  const handleEdit = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
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
        <Button loading={loading} onClick={handleEdit}>
          Edit
        </Button>
      </Modal>
    </>
  );
};

export default ProjectRow;

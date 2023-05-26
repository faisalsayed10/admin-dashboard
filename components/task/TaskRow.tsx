import { useState } from "react";
import { Project, Task } from "../../lib/types";
import Modal from "../ui/Modal";
import Link from "next/link";

type Props = {
  task: Task;
  projects: Project[] | undefined;
};

const TaskRow: React.FC<Props> = ({ task, projects }) => {
  const [open, setOpen] = useState(false);

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);

  return (
    <>
      <tr key={task.id}>
        <td className="whitespace-nowrap capitalize px-3 py-4 text-sm text-gray-900 font-medium">
          {task.name}
        </td>
        <td className="break-words max-w-[150px] px-3 py-4 text-sm text-gray-500">
          {task.description}
        </td>
        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-left text-sm font-medium sm:pr-6">
          <button
            onClick={onOpen}
            className="text-indigo-600 hover:text-indigo-900"
          >
            View
          </button>
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          {projects?.find((p) => p.id === task.project_id)?.name}
        </td>
        <td className="flex relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
          <Link href={`/tasks/${task.id}`}>
            <span className="text-indigo-600 hover:text-indigo-900 cursor-pointer">
              View
            </span>
          </Link>
        </td>
      </tr>
      <Modal open={open} closeModal={onClose} title="Task Body" scroll>
        <p className="mt-2 text-sm text-gray-500">
          Here's the body of this task.
        </p>
        <div className="mt-4">
          <pre>{JSON.stringify(task.body, null, 2)}</pre>
        </div>
      </Modal>
    </>
  );
};

export default TaskRow;

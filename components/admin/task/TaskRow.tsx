import { Task } from "../../../lib/types";

type Props = {
  task: Task;
};

const TaskRow = ({ task }: Props) => {
  return (
    <tr key={task.id}>
      <td className="whitespace-nowrap capitalize px-3 py-4 text-sm text-gray-900 font-medium">
        {task.name}
      </td>
      <td
        align="center"
        className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
      >
        {task.description}
      </td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <a href="#" className="text-indigo-600 hover:text-indigo-900">
          View
        </a>
      </td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <a href="#" className="text-indigo-600 hover:text-indigo-900">
          {task.project_id}
        </a>
      </td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <a href="#" className="text-indigo-600 hover:text-indigo-900">
          View
        </a>
      </td>
    </tr>
  );
};

export default TaskRow;

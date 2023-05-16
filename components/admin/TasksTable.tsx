import React from "react";
import { ThreeDots } from "react-loader-spinner";
import { Task } from "../../lib/types";
import Table from "../ui/Table";

type Props = {
  tasks: Task[] | undefined;
};

const GroupsTable: React.FC<Props> = ({ tasks }) => {
  return (
    <Table
      hasEndButton
      button="Create task"
      cols={["Name", "Description", "Body", "Project", "Submissions"]}
      description="A list of all the tasks currently in the system."
      heading="Tasks"
      onBtnClick={() => console.log("Add task")}
    >
      {tasks && tasks.length < 1 && (
        <tr>
          <td
            align="center"
            colSpan={6}
            className="px-3 py-4 text-sm text-gray-900 font-medium"
          >
            No tasks found. Create a task.
          </td>
        </tr>
      )}
      {tasks ? (
        tasks.map((task, i) => (
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
        ))
      ) : (
        <tr>
          <td
            colSpan={6}
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
  );
};

export default GroupsTable;

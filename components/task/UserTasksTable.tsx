import React from "react";
import { TaskWithProject } from "../../lib/types";
import Table from "../ui/Table";
import TableEmpty from "../ui/TableEmpty";
import TableLoading from "../ui/TableLoading";
import UserTaskRow from "./UserTaskRow";

type Props = {
  tasks: TaskWithProject[] | undefined;
};

const UserTasksTable: React.FC<Props> = ({ tasks }) => {
  return (
    <>
      <Table
        cols={["Name", "Description", "Project", "Assigned To", "Response"]}
        description="A list of all the tasks currently assigned to you."
        heading="My Tasks"
        hasEndButton
      >
        {tasks && tasks.length < 1 && (
          <TableEmpty colSpan={6} message="No tasks found. Create a task." />
        )}
        {tasks ? (
          tasks.map((task) => <UserTaskRow key={task.id} task={task} />)
        ) : (
          <TableLoading colSpan={6} />
        )}
      </Table>
    </>
  );
};

export default UserTasksTable;

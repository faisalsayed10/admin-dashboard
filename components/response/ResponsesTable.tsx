import React from "react";
import { User } from "../../lib/types";
import Table from "../ui/Table";
import TableEmpty from "../ui/TableEmpty";
import TableLoading from "../ui/TableLoading";
import ResponseRow from "./ResponseRow";

type Props = {
  assignees: User[] | undefined;
};

const ResponsesTable: React.FC<Props> = ({ assignees }) => {
  return (
    <>
      <Table
        cols={["User", "Status", "Response"]}
        description="A list of all the responses to this task."
        heading="Responses"
      >
        {assignees && assignees.length < 1 && (
          <TableEmpty colSpan={3} message="No assignees found." />
        )}
        {assignees ? (
          <>
            {assignees.map((person) => (
              <ResponseRow key={person.id} person={person} />
            ))}
          </>
        ) : (
          <TableLoading colSpan={3} />
        )}
      </Table>
    </>
  );
};

export default ResponsesTable;

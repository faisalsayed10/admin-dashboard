import React from "react";
import { ThreeDots } from "react-loader-spinner";
import { Project } from "../../lib/types";
import Table from "../core/Table";

type Props = {
  projects: Project[] | undefined;
};

const GroupsTable: React.FC<Props> = ({ projects }) => {
  return (
    <Table
      hasEndButton
      button="Create project"
      cols={["Name", "Assigned to"]}
      description="A list of all the projects currently in the system."
      heading="Projects"
      onBtnClick={() => console.log("Add project")}
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
        projects.map((p, i) => (
          <tr key={p.id}>
            <td className="whitespace-nowrap capitalize px-3 py-4 text-sm text-gray-900 font-medium">
              {p.name}
            </td>
            <td
              align="center"
              className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
            >
              {p.assigned_group || p.assigned_user}
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
  );
};

export default GroupsTable;

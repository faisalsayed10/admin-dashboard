import React from "react";
import { ThreeDots } from "react-loader-spinner";

type Props = {
  colSpan: number;
}

const TableLoading = (props: Props) => {
  return (
    <tr>
      <td colSpan={props.colSpan} className="px-3 py-4 text-sm text-gray-900 font-medium">
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
  );
};

export default TableLoading;

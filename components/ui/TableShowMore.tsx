import Link from "next/link";
import React from "react";

type Props = {
  colSpan: number;
  href: string;
};

const TableShowMore = (props: Props) => {
  return (
    <tr>
      <td
        align="center"
        colSpan={props.colSpan}
        className="px-3 py-4 text-sm text-indigo-600 font-medium"
      >
        <Link href={props.href}>Show More</Link>
      </td>
    </tr>
  );
};

export default TableShowMore;

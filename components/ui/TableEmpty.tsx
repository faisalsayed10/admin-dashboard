import React from 'react'

type Props = {
  colSpan: number
  message: string
}

const TableEmpty = (props: Props) => {
  return (
    <tr>
      <td colSpan={props.colSpan} className="px-3 py-4 text-sm text-gray-900 font-medium">
        {props.message}
      </td>
    </tr>
  );
}

export default TableEmpty
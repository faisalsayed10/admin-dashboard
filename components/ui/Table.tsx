import React, { PropsWithChildren } from "react";

type Props = {
  heading: string;
  description: string;
  button?: string;
  onBtnClick: () => void;
  cols: string[];
  hasEndButton?: boolean;
};

const Table: React.FC<PropsWithChildren<Props>> = (props) => {
  const {
    heading,
    description,
    button,
    onBtnClick,
    cols,
    hasEndButton,
    children,
  } = props;

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            {heading}
          </h1>
          <p className="mt-2 text-sm text-gray-700">{description}</p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={onBtnClick}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {button}
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="shadow overflow-x-hidden ring-1 ring-black ring-opacity-5 sm:rounded-lg max-h-[400px] block">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    {cols.map((col, i) => (
                      <th
                        key={col}
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        {col}
                      </th>
                    ))}
                    {hasEndButton && (
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      />
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white overflow-y-scroll">
                  {children}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;

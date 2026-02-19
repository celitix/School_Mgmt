import React from "react";

const NewDataTable = ({
  columns = [],
  data = [],
  emptyMessage = "No data available",
  height = "auto",
}) => {
  return (
    <div
      className="overflow-x-auto rounded-lg border border-gray-200"
      style={{ height }}
    >
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="bg-gray-100 sticky top-0 z-10">
          <tr>
            {columns.map((col) => (
              <th
                key={col.accessor}
                className="px-3 py-2 font-semibold text-gray-700 border-b text-nowrap"
                style={{ width: col.width, minWidth: col.minWidth }}
              >
                {col.Header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data && data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-gray-50 even:bg-gray-50/30 transition-colors"
              >
                {columns.map((col) => {
                  const value = row[col.accessor];

                  return (
                    <td
                      key={col.accessor}
                      className="px-3 py-2 border-b text-gray-800 whitespace-nowrap"
                    >
                      {col.renderCell ? (
                        col.renderCell({ value, row, rowIndex })
                      ) : col.accessor === "created_at" ? (
                        value
                          ? new Date(value).toLocaleDateString("en-IN")
                          : "N/A"
                      ) : (
                        value ?? "N/A"
                      )}
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-3 text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default NewDataTable;

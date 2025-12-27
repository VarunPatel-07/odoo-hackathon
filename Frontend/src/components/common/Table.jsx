import { classNames } from "../../utils/helper/helper";

function Table({ columns, data, tableWrapperClass, stickyHeaderClass }) {
  return (
    <div className={`overflow-auto ${tableWrapperClass} hide-scrollbar border border-black/10 border-t-0`}>
      <table className="table-auto border-collapse w-full relative">
        <thead>
          <tr className={`${stickyHeaderClass} shadow z-30`}>
            {columns.map((column, index) => (
              <th
                key={index}
                className={classNames("px-6 py-2.5 text-left bg-[#eef0f4] text-black", {
                  "min-w-fit sticky right-0 shadow-2xl": column?.key == "action" && column?.isSticky,
                })}>
                <span className="flex items-center justify-start gap-1">
                  <span className="font-inter text-[15px] text-black/80 font-medium">{column.title}</span>
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="group relative">
              {columns.map((column, _subIndex) => {
                return (
                  <td
                    key={_subIndex}
                    className={classNames(
                      "bg-white px-6 py-3 text-black group-hover:bg-gray-50 cursor-pointe min-w-55 border-b border-b-black/10",
                      {
                        "min-w-fit sticky right-0 shadow-2xl bg-white border-0":
                          column?.key == "action" && column?.isSticky,
                        "min-w-fit relative border-0": column?.key == "action" && !column?.isSticky,
                      }
                    )}>
                    {column?.key == "action" && (
                      <>
                        <span className="w-px h-full bg-black/15 inline-block top-0 left-0 absolute"></span>
                      </>
                    )}
                    {column?.key == "action"
                      ? column.renderContent(row)
                      : column.renderContent(row[column.key], column.childKey ? row[column.childKey] : null)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;

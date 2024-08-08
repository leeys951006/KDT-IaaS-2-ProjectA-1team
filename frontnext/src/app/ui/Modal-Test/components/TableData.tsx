import React, { useState, useEffect } from 'react';

interface TableDataProps {
  data: any[];
  onSave: (updatedData: any[]) => void;
}

const TableData: React.FC<TableDataProps> = ({ data, onSave }) => {
  const [editableData, setEditableData] = useState(data);

  useEffect(() => {
    setEditableData(data);
  }, [data]);

  if (editableData.length === 0) {
    return <div>데이터가 없습니다.</div>;
  }

  const columns = Object.keys(editableData[0]);

  const handleChange = (rowIndex: number, column: string, value: string) => {
    const newData = editableData.map((row, index) => {
      if (index === rowIndex) {
        return { ...row, [column]: value };
      }
      return row;
    });
    setEditableData(newData);
  };

  const handleSave = () => {
    onSave(editableData);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {editableData.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-100">
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className="py-2 px-4 border-b border-gray-200"
                >
                  <input
                    type="text"
                    value={row[column]}
                    onChange={(e) => handleChange(rowIndex, column, e.target.value)}
                    className="w-full px-2 py-1 border rounded"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={handleSave}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        저장
      </button>
    </div>
  );
};

export default TableData;

"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ModalComponent from './ModalComponent';
import { AddSets } from './components/AddSets';
import TableData from './components/TableData';

const TotalSidebar: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableData, setTableData] = useState<any[]>([]);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleTableClick = async (tableName: string) => {
    setSelectedTable(tableName);
    try {
      const response = await fetch('http://localhost:8080/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ table: tableName }),
      });
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setTableData(data);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error('Error fetching table data:', error);
      setTableData([]);
    }
  };

  const handleSave = async (updatedData: any[]) => {
    console.log('Saving data:', updatedData);
    try {
      const response = await fetch('http://localhost:8080/updateTable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ table: selectedTable, data: updatedData }),
      });

      if (!response.ok) {
        throw new Error('Failed to update table data');
      }

      const result = await response.json();
      console.log('Update response:', result);
      // Optionally refetch the data or show a success message
    } catch (error) {
      console.error('Error saving table data:', error);
    }
  };

 const handleColumnSave = async (updatedColumns: string[]) => {
    console.log('Saving columns:', updatedColumns);
    try {
      const response = await fetch('http://localhost:8080/updateColumns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ table: selectedTable, columns: updatedColumns }),
      });

      if (!response.ok) {
        throw new Error('Failed to update columns');
      }

      const result = await response.json();
      console.log('Update columns response:', result);
    } catch (error) {
      console.error('Error saving columns:', error);
    }
  };

  return (
    <div className="flex">
      <Sidebar onTableClick={handleTableClick} />

      <div className="flex-grow p-4">
        <h1 className="text-2xl font-bold">Main Content</h1>
        {selectedTable && (
          <div>
            <h2 className="text-xl font-bold mb-4">{selectedTable}</h2>
            <TableData data={tableData} onSave={handleSave} onColumnSave={handleColumnSave} />
          </div>
        )}
      </div>

      <ModalComponent show={showModal} onClose={toggleModal}>
        <div className="text-center">
          <AddSets />
        </div>
      </ModalComponent>
    </div>
  );
};

export default TotalSidebar;
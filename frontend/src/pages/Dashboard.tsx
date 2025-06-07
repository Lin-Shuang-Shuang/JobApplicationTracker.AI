import { useEffect, useState } from "react";
import { getTableData, updateStatus, deleteApplications, updateApplication } from "../api/TableApiService"
import type { TableRow } from "../interface/TableRow";
import { Status } from "../enum/Status";
import Navbar from "../components/Navbar";
import EditModal from "../components/EditModal";

const Dashboard = () => {
    const [rows, setRows] = useState<TableRow[]>([])
    const [selectedRows, setSelectedRows] = useState<number[]>([])
    const [editingApplication, setEditingApplication] = useState<TableRow | null>(null)

    useEffect(() => {
        getTableData().then(data => setRows(data));
    }, [])

    const handleStatusChange = async (id: number, newStatus: string) => {
        try {
            // Optimistically update the UI
            setRows(rows.map(row => 
                row.id === id
                    ? { ...row, status: newStatus }
                    : row
            ));
            
            // Then update the backend
            await updateStatus(id, newStatus);
        } catch (error) {
            // If the update fails, revert the optimistic update
            console.error('Failed to update status:', error);
            getTableData().then(data => setRows(data));
        }
    }

    const handleCheckboxChange = (id: number) => {
        setSelectedRows(prev => 
            prev.includes(id)
                ? prev.filter(rowId => rowId !== id)
                : [...prev, id]
        );
    }

    const handleSelectAll = () => {
        setSelectedRows(prev => 
            prev.length === rows.length
                ? []
                : rows.map(row => row.id)
        );
    }

    const handleDelete = async () => {
        if (selectedRows.length === 0) return;
        
        try {
            // Optimistically remove rows from UI
            setRows(rows.filter(row => !selectedRows.includes(row.id)));
            setSelectedRows([]);
            
            // Then update the backend
            await deleteApplications(selectedRows);
        } catch (error) {
            console.error('Failed to delete applications:', error);
            // Revert changes if deletion fails
            getTableData().then(data => setRows(data));
        }
    }

    const handleEdit = (application: TableRow) => {
        setEditingApplication(application);
    }

    const handleSaveEdit = async (data: Partial<TableRow>) => {
        if (!editingApplication) return;

        try {
            // Optimistically update the UI
            setRows(rows.map(row => 
                row.id === editingApplication.id
                    ? { ...row, ...data }
                    : row
            ));
            
            // Then update the backend
            await updateApplication(editingApplication.id, data);
        } catch (error) {
            console.error('Failed to update application:', error);
            // Revert changes if update fails
            getTableData().then(data => setRows(data));
        }
    }

    return (
        <>
        <Navbar></Navbar>
        <div className="pt-20 relative overflow-x-auto shadow-md sm:rounded-lg">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <div className="p-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={selectedRows.length === rows.length && rows.length > 0}
                            onChange={handleSelectAll}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                            {selectedRows.length} selected
                        </span>
                    </div>
                    {selectedRows.length > 0 && (
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                        >
                            Delete Selected
                        </button>
                    )}
                </div>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                <span className="sr-only">Select</span>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Company
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Job Position
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Date Applied
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(row => (
                            <tr key={row.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                                <td className="px-6 py-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.includes(row.id)}
                                        onChange={() => handleCheckboxChange(row.id)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                </td>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {row.company}
                                </th>
                                <td className="px-6 py-4">
                                    {row.jobPosition}
                                </td>
                                <td className="px-6 py-4">
                                    <select
                                        value={row.status}
                                        onChange={(e) => handleStatusChange(row.id, e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    >
                                        {Object.values(Status).map((status) => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-6 py-4">
                                    {row.dateApplied}
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleEdit(row)}
                                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        <EditModal
            isOpen={editingApplication !== null}
            onClose={() => setEditingApplication(null)}
            onSave={handleSaveEdit}
            application={editingApplication}
        />
        </>
    )
}

export default Dashboard;

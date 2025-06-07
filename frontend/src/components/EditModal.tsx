import { useState, useEffect } from 'react';
import type { TableRow } from '../interface/TableRow';
import { Status } from '../enum/Status';

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Partial<TableRow>) => Promise<void>;
    application: TableRow | null;
}

const EditModal = ({ isOpen, onClose, onSave, application }: EditModalProps) => {
    const [formData, setFormData] = useState<Partial<TableRow>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (application) {
            setFormData({
                company: application.company,
                jobPosition: application.jobPosition,
                status: application.status,
                dateApplied: application.dateApplied
            });
        }
    }, [application]);

    if (!isOpen || !application) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        try {
            await onSave(formData);
            onClose();
        } catch (err) {
            setError('Failed to update application. Please try again.');
            console.error('Update error:', err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                    Edit Application
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Company
                        </label>
                        <input
                            type="text"
                            value={formData.company || ''}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Job Position
                        </label>
                        <input
                            type="text"
                            value={formData.jobPosition || ''}
                            onChange={(e) => setFormData({ ...formData, jobPosition: e.target.value })}
                            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Status
                        </label>
                        <select
                            value={formData.status || ''}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                        >
                            {Object.values(Status).map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Date Applied
                        </label>
                        <input
                            type="date"
                            value={formData.dateApplied || ''}
                            onChange={(e) => setFormData({ ...formData, dateApplied: e.target.value })}
                            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                        />
                    </div>
                    {error && (
                        <div className="mb-4 text-sm text-red-600">
                            {error}
                        </div>
                    )}
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50"
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditModal; 
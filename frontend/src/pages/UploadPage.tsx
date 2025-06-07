import { useState } from "react";
import Navbar from "../components/Navbar";
import { uploadJobDescription } from "../api/TableApiService";
import { useNavigate } from "react-router-dom";

const UploadPage = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    const handleSubmit = async () => {
        if (!selectedFile) return;

        setIsUploading(true)
        setError(null)

        try {
            await uploadJobDescription(selectedFile)
            // Redirect to dashboard after successful upload
            navigate('/')
        } catch (err) {
            setError('Failed to process job description. Please try again.')
            console.error('Upload error:', err)
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <>
            <Navbar></Navbar>

            <div className="flex flex-col items-center justify-center w-full pt-20">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or JPEG (MAX. 10MB)</p>
                    </div>
                    <input 
                        id="dropzone-file" 
                        type="file" 
                        className="hidden" 
                        accept="image/png,image/jpeg,image/jpg"
                        onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                                if (file.size > 10 * 1024 * 1024) { // 10MB limit
                                    setError('File size must be less than 10MB')
                                    return
                                }
                                setSelectedFile(file)
                                setError(null)
                            }
                        }} 
                    />
                </label>
                {selectedFile && (
                    <div className="mt-4 text-sm text-gray-700">
                        Selected file: <strong>{selectedFile.name}</strong>
                    </div>
                )}
                {error && (
                    <div className="mt-4 text-sm text-red-600">
                        {error}
                    </div>
                )}
                <button 
                    disabled={!selectedFile || isUploading}
                    onClick={handleSubmit}
                    className={`mt-4 px-4 py-2 rounded ${
                        selectedFile && !isUploading 
                            ? 'bg-blue-600 text-white hover:bg-blue-700' 
                            : 'bg-gray-400 text-white cursor-not-allowed'
                    }`}
                >
                    {isUploading ? 'Processing...' : 'Submit'}
                </button>
            </div>
        </>
    )
}

export default UploadPage;
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Upload, FileText, AlertCircle, Loader } from 'lucide-react';

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [dragActive, setDragActive] = useState(false);
    const router = useRouter();

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (uploadedFile: File) => {
        setError('');

        // Validate file type
        const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(uploadedFile.type)) {
            setError('Invalid file type. Please upload PDF or DOCX files only.');
            return;
        }

        // Validate file size (5MB)
        if (uploadedFile.size > 5 * 1024 * 1024) {
            setError('File size exceeds 5MB limit.');
            return;
        }

        setFile(uploadedFile);
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            const formData = new FormData();
            formData.append('document', file);

            const response = await axios.post('http://localhost:5000/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            // Store parsed data in sessionStorage and redirect to editor
            sessionStorage.setItem('parsedSong', JSON.stringify(response.data.data));
            router.push('/song/create');

        } catch (err: any) {
            setError(err.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-12">
            <h1 className="text-4xl font-bold text-white mb-2">Upload Song Document</h1>
            <p className="text-gray-400 mb-8">Upload a PDF or Word document containing chords or tabs</p>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 flex items-center gap-2">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            <div
                className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${dragActive
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-700 bg-gray-900/30 hover:border-gray-600'
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".pdf,.docx"
                    onChange={handleChange}
                />

                {!file ? (
                    <>
                        <Upload className="mx-auto mb-4 text-gray-500" size={48} />
                        <p className="text-gray-300 mb-2 font-medium">Drag and drop your file here</p>
                        <p className="text-gray-500 text-sm mb-4">or</p>
                        <label
                            htmlFor="file-upload"
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg cursor-pointer transition-colors"
                        >
                            Browse Files
                        </label>
                        <p className="text-gray-600 text-xs mt-4">PDF or DOCX • Max 5MB</p>
                    </>
                ) : (
                    <>
                        <FileText className="mx-auto mb-4 text-blue-500" size={48} />
                        <p className="text-white font-medium mb-1">{file.name}</p>
                        <p className="text-gray-400 text-sm mb-6">
                            {(file.size / 1024).toFixed(2)} KB
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={handleUpload}
                                disabled={uploading}
                                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center gap-2"
                            >
                                {uploading ? (
                                    <>
                                        <Loader className="animate-spin" size={18} />
                                        Processing...
                                    </>
                                ) : (
                                    'Upload & Parse'
                                )}
                            </button>
                            <button
                                onClick={() => setFile(null)}
                                className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                            >
                                Remove
                            </button>
                        </div>
                    </>
                )}
            </div>

            <div className="mt-8 bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <h3 className="text-white font-bold mb-3">How it works:</h3>
                <ol className="text-gray-400 text-sm space-y-2 list-decimal list-inside">
                    <li>Upload a PDF or Word document containing song chords/tabs</li>
                    <li>Our system automatically extracts the text and detects chords</li>
                    <li>Review and edit the parsed content before publishing</li>
                    <li>Save to your library and share with others</li>
                </ol>
            </div>
        </div>
    );
}

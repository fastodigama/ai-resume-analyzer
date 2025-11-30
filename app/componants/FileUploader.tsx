// Import React and hooks we need
import React, { useCallback, useState } from 'react'
// Import the dropzone library for drag-and-drop file uploads
import { useDropzone } from 'react-dropzone'
// Import a helper function to format file sizes (e.g. bytes → MB)
import { formatSize } from '~/lib/utils';

// Define the props this component accepts
interface FileUploaderProps {
    // onFileSelect is a function passed in from the parent
    // It will be called when a file is chosen or removed
    onFileSelect?: (file: File | null) => void;
}

// Main FileUploader component
const FileUploader = ({ onFileSelect }: FileUploaderProps) => {

    // onDrop runs when a file is dropped or selected
    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Take the first file (or null if none)
        const file = acceptedFiles[0] || null;

        // Call the parent function with the file
        onFileSelect?.(file);

    }, [onFileSelect])

    // Maximum file size allowed (20MB in bytes)
    const maxFileSize = 20 * 1024 * 1024; // 20MB

    // Setup dropzone behavior
    const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
        onDrop,                // function to run when file is dropped
        multiple: false,       // only allow one file
        accept: { 'application/pdf': ['.pdf'] }, // only PDFs
        maxSize: maxFileSize,  // limit file size
    })

    // Get the first accepted file (or null if none)
    const file = acceptedFiles[0] || null;

    // What the component shows on screen
    return (
        <div className='w-full gradient-border'>
            {/* Root dropzone area */}
            <div {...getRootProps()}>
                {/* Hidden input for file selection */}
                <input {...getInputProps()} />
                <div className='space-y-4 cursor-pointer'>

                    {/* If a file is selected, show file info */}
                    {file ? (
                        <div className='uploader-selected-file' onClick={(e) => e.stopPropagation()}>
                            {/* PDF icon */}
                            <img src="/images/pdf.png" alt="pdf" className='size-10' />
                            <div className="flex items-center space-x-3">
                                <div>
                                    {/* Show file name */}
                                    <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                                        {file.name}
                                    </p>
                                    {/* Show file size */}
                                    <p className="text-sm text-fray-500">
                                        {formatSize(file.size)}
                                    </p>
                                </div>
                            </div>
                            {/* Button to remove file */}
                            <button className='p-2 cursor-pointer' onClick={(e) => {
                                onFileSelect?.(null) // clear file
                            }}>
                                <img src='/icons/cross.svg' alt='remove' className='w-4 h-4'/>
                            </button>
                        </div>
                    ) : (
                        // If no file selected, show instructions
                        <div>
                            <div className='mx-auto w-16 h-16 flex items-center justify-center'>
                                <img src="/icons/info.svg" alt="upload" className='size-20' />
                            </div>
                            <p className='text-lg text-gray-500 '>
                                <span className='font-semibold'>
                                    Click to upload
                                </span> or drag and drop
                            </p>
                            <p className="text-lg text-gray-500">
                                PDF (max {formatSize(maxFileSize)})
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// Export the component so it can be used elsewhere
export default FileUploader

import React, { useState } from 'react';
import { Button, Typography, Box } from '@mui/material';

interface FileUploaderProps {
    fileName?: string;
    onFileUpload?: (file: File) => void;
};

const FileUploader: React.FC<FileUploaderProps> = ({ fileName, onFileUpload }) => {
    const [name, setName] = useState<string>('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === 'application/pdf') {
            setName(file.name);
            onFileUpload?.(file); // Invoke the callback if provided
        } else {
            alert('Please upload a valid PDF file.');
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <Typography variant="h6">Upload a PDF</Typography>
            <Button variant="contained" component="label">
                Upload PDF
                <input
                    type="file"
                    accept="application/pdf"
                    hidden
                    onChange={handleFileChange}
                />
            </Button>
            {(name || fileName) && <Typography variant="body2">Selected: {(name || fileName)}</Typography>}
        </Box>
    );
};

export default FileUploader;

import { Close as CloseIcon, CloudUpload, InsertDriveFile as FileIcon } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import type { ChangeEvent, DragEvent } from 'react';
import { useRef } from 'react';

interface FileUploaderProps {
    label: string;
    helperText: string;
    files: File[];
    onFilesSelected: (newFiles: File[]) => void;
    onFileDelete: (index: number) => void;
    accept?: string;
    multiple?: boolean;
}

export const FileUploader = ({ 
    label, 
    helperText, 
    files, 
    onFilesSelected, 
    onFileDelete, 
    accept = ".pdf,.jpg,.jpeg,.png",
    multiple = true 
}: FileUploaderProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleBoxClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            onFilesSelected(Array.from(event.target.files));
        }
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFilesSelected(Array.from(e.dataTransfer.files));
        }
    };

    return (
        <Box>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                multiple={multiple}
                accept={accept}
            />
            <Box
                onClick={handleBoxClick}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                sx={{
                    border: '1px dashed',
                    borderColor: 'divider',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'action.hover'
                    }
                }}
            >
                <CloudUpload sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="body2" fontWeight="medium">{label}</Typography>
                <Typography variant="caption" color="text.secondary">{helperText}</Typography>
            </Box>
            {files.length > 0 && (
                <Box sx={{ mt: 2 }}>
                    {files.map((file, index) => (
                        <Box key={index} sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            p: 1,
                            mb: 1,
                            bgcolor: 'action.hover',
                            borderRadius: 1
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <FileIcon fontSize="small" color="primary" />
                                <Typography variant="body2" noWrap sx={{ maxWidth: 180 }}>{file.name}</Typography>
                            </Box>
                            <IconButton size="small" onClick={() => onFileDelete(index)}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

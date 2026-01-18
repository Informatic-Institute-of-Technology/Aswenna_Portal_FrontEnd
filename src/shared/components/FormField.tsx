import { TextField } from '@mui/material';
import type { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField';

interface FormFieldProps extends Omit<MuiTextFieldProps, 'variant'> {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  type?: string;
  multiline?: boolean;
  rows?: number;
}

export const FormField = ({
  label,
  name,
  value,
  onChange,
  error = false,
  helperText = '',
  disabled = false,
  required = false,
  type = 'text',
  multiline = false,
  rows = 1,
  ...props
}: FormFieldProps) => {
  return (
    <TextField
      fullWidth
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      disabled={disabled}
      required={required}
      type={type}
      multiline={multiline}
      rows={rows}
      variant="outlined"
      sx={{
        '& .MuiOutlinedInput-root': {
          '&:hover fieldset': {
            borderColor: 'primary.main',
          },
        },
      }}
      {...props}
    />
  );
};

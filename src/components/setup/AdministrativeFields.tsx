import { FormControl, Grid, InputLabel, MenuItem, Select, type SelectChangeEvent } from '@mui/material';

interface AdministrativeFieldsProps {
    district: string;
    dsDivision: string;
    gnDivision: string;
    dsDivisionsList: string[];
    gnDivisionsList: { name: string; number: string }[];
    onDsDivisionChange: (event: SelectChangeEvent<string>) => void;
    onGnDivisionChange: (event: SelectChangeEvent<string>) => void;
    disabled?: boolean;
    fieldPrefix?: string;
}

const AdministrativeFields = ({
    district,
    dsDivision,
    gnDivision,
    dsDivisionsList,
    gnDivisionsList,
    onDsDivisionChange,
    onGnDivisionChange,
    disabled = false,
    fieldPrefix = ''
}: AdministrativeFieldsProps) => {
    return (
        <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth disabled={!district || disabled}>
                    <InputLabel shrink>{`${fieldPrefix}Divisional Secretariat Division`}</InputLabel>
                    <Select
                        value={dsDivision}
                        onChange={onDsDivisionChange}
                        displayEmpty
                        label={`${fieldPrefix}Divisional Secretariat Division`}
                        notched
                    >
                        <MenuItem value="" disabled>Select DS Division</MenuItem>
                        {dsDivisionsList.map((div) => (
                            <MenuItem key={div} value={div}>{div}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth disabled={!dsDivision || disabled}>
                    <InputLabel shrink>{`${fieldPrefix}Grama Niladhari Division`}</InputLabel>
                    <Select
                        value={gnDivision}
                        onChange={onGnDivisionChange}
                        displayEmpty
                        label={`${fieldPrefix}Grama Niladhari Division`}
                        notched
                    >
                        <MenuItem value="" disabled>Select GN Division</MenuItem>
                        {gnDivisionsList.map((gn) => (
                            <MenuItem key={gn.number} value={gn.name}>{gn.name} ({gn.number})</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    );
};

export default AdministrativeFields;

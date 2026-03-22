import { FormControl, Grid, InputLabel, MenuItem, Select, type SelectChangeEvent, TextField } from '@mui/material';

interface AddressFieldsProps {
    houseNumber?: string;
    street: string;
    city: string;
    province: string;
    district: string;
    postalCode: string;
    onHouseNumberChange?: (value: string) => void;
    onStreetChange: (value: string) => void;
    onCityChange: (value: string) => void;
    onProvinceChange: (event: SelectChangeEvent<string>) => void;
    onDistrictChange?: (event: SelectChangeEvent<string>) => void;
    onPostalCodeChange: (value: string) => void;
    provinceOptions: Record<string, string[]>;
    showHouseNumber?: boolean;
    disabled?: boolean;
    fieldPrefix?: string;
}

const AddressFields = ({
    houseNumber,
    street,
    city,
    province,
    district,
    postalCode,
    onHouseNumberChange,
    onStreetChange,
    onCityChange,
    onProvinceChange,
    onDistrictChange,
    onPostalCodeChange,
    provinceOptions,
    showHouseNumber = false,
    disabled = false,
    fieldPrefix = ''
}: AddressFieldsProps) => {
    return (
        <Grid container spacing={2}>
            {showHouseNumber && onHouseNumberChange && (
                <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                        fullWidth
                        label="House Number"
                        value={houseNumber || ''}
                        onChange={(e) => onHouseNumberChange(e.target.value)}
                        disabled={disabled}
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
            )}
            <Grid size={{ xs: 12, sm: showHouseNumber ? 8 : 6 }}>
                <TextField
                    fullWidth
                    label={`${fieldPrefix}Street/Area`}
                    value={street}
                    onChange={(e) => onStreetChange(e.target.value)}
                    disabled={disabled}
                    InputLabelProps={{ shrink: true }}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                    fullWidth
                    label={`${fieldPrefix}City/Town`}
                    value={city}
                    onChange={(e) => onCityChange(e.target.value)}
                    disabled={disabled}
                    InputLabelProps={{ shrink: true }}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                    <InputLabel shrink>{`${fieldPrefix}Province`}</InputLabel>
                    <Select
                        value={province}
                        onChange={onProvinceChange}
                        displayEmpty
                        label={`${fieldPrefix}Province`}
                        notched
                        disabled={disabled}
                    >
                        <MenuItem value="" disabled>Select Province</MenuItem>
                        {Object.keys(provinceOptions).map((prov) => (
                            <MenuItem key={prov} value={prov}>{prov}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth disabled={!province || disabled}>
                    <InputLabel shrink>{`${fieldPrefix}District`}</InputLabel>
                    <Select
                        value={district}
                        onChange={onDistrictChange || onProvinceChange}
                        displayEmpty
                        label={`${fieldPrefix}District`}
                        notched
                    >
                        <MenuItem value="" disabled>Select District</MenuItem>
                        {province && provinceOptions[province]?.map((dist) => (
                            <MenuItem key={dist} value={dist}>{dist}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                    fullWidth
                    label={`${fieldPrefix}Postal Code`}
                    value={postalCode}
                    onChange={(e) => onPostalCodeChange(e.target.value)}
                    disabled={disabled}
                    InputLabelProps={{ shrink: true }}
                />
            </Grid>
        </Grid>
    );
};

export default AddressFields;

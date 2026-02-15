interface NICValidationResult {
    isValid: boolean;
    birthday?: string;
    gender?: 'Male' | 'Female';
    age?: number;
    error?: string;
}

interface MonthData {
    month: string;
    days: number;
}

const monthsData: MonthData[] = [
    { month: 'January', days: 31 },
    { month: 'February', days: 29 },
    { month: 'March', days: 31 },
    { month: 'April', days: 30 },
    { month: 'May', days: 31 },
    { month: 'June', days: 30 },
    { month: 'July', days: 31 },
    { month: 'August', days: 31 },
    { month: 'September', days: 30 },
    { month: 'October', days: 31 },
    { month: 'November', days: 30 },
    { month: 'December', days: 31 },
];

function isValidNICFormat(nic: string): boolean {
    if (!nic) return false;

    const nicUpper = nic.toUpperCase();

    if (nicUpper.length === 10) {
        const first9 = nicUpper.substring(0, 9);
        const last = nicUpper.substring(9, 10);
        return !isNaN(Number(first9)) && (last === 'X' || last === 'V');
    }

    if (nicUpper.length === 12) {
        return !isNaN(Number(nicUpper));
    }

    return false;
}

function extractYearAndDays(nic: string): { year: number; dayNumber: number } | null {
    const nicUpper = nic.toUpperCase();

    if (nicUpper.length === 10) {
        const yearPart = nicUpper.substring(0, 2);
        const daysPart = nicUpper.substring(2, 5);

        const year = parseInt(yearPart, 10);
        const fullYear = year >= 0 && year <= 99 ? (year < 50 ? 2000 + year : 1900 + year) : 1900 + year;
        const dayNumber = parseInt(daysPart, 10);

        return { year: fullYear, dayNumber };
    } else if (nicUpper.length === 12) {
        const yearPart = nicUpper.substring(0, 4);
        const daysPart = nicUpper.substring(4, 7);

        const year = parseInt(yearPart, 10);
        const dayNumber = parseInt(daysPart, 10);

        return { year, dayNumber };
    }

    return null;
}

function extractDayMonthGender(dayNumber: number): { day: number; month: string; gender: 'Male' | 'Female' } | null {
    let adjustedDays = dayNumber;
    let gender: 'Male' | 'Female' = 'Male';

    if (adjustedDays > 500) {
        gender = 'Female';
        adjustedDays -= 500;
    }

    let day = adjustedDays;
    let month = '';

    for (let i = 0; i < monthsData.length; i++) {
        if (monthsData[i].days < day) {
            day -= monthsData[i].days;
        } else {
            month = monthsData[i].month;
            break;
        }
    }

    if (!month || day < 1 || day > 31) {
        return null;
    }

    return { day, month, gender };
}

function calculateAge(birthday: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const monthDiff = today.getMonth() - birthday.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
        age--;
    }

    return age;
}

export function validateNIC(nic: string): NICValidationResult {
    if (!nic || nic.trim() === '') {
        return {
            isValid: false,
            error: 'NIC number is required'
        };
    }

    const trimmedNIC = nic.trim();

    if (!isValidNICFormat(trimmedNIC)) {
        return {
            isValid: false,
            error: 'Invalid NIC format. Use old format (e.g., 123456789V) or new format (e.g., 200012345678)'
        };
    }

    const extracted = extractYearAndDays(trimmedNIC);
    if (!extracted) {
        return {
            isValid: false,
            error: 'Unable to extract data from NIC'
        };
    }

    const { year, dayNumber } = extracted;

    const dayMonthGender = extractDayMonthGender(dayNumber);
    if (!dayMonthGender) {
        return {
            isValid: false,
            error: 'Invalid day number in NIC'
        };
    }

    const { day, month, gender } = dayMonthGender;

    const monthIndex = monthsData.findIndex(m => m.month === month);
    if (monthIndex === -1) {
        return {
            isValid: false,
            error: 'Invalid month extracted from NIC'
        };
    }

    const monthNumber = monthIndex + 1;
    const birthdayStr = `${year}-${String(monthNumber).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const birthday = new Date(birthdayStr);

    if (isNaN(birthday.getTime())) {
        return {
            isValid: false,
            error: 'Invalid date extracted from NIC'
        };
    }
    if (birthday > new Date()) {
        return {
            isValid: false,
            error: 'Birthday cannot be in the future'
        };
    }

    const age = calculateAge(birthday);

    if (age < 16) {
        return {
            isValid: false,
            error: 'Age must be at least 16 years old'
        };
    }

    return {
        isValid: true,
        birthday: birthdayStr,
        gender,
        age
    };
}

export function formatBirthday(birthdayStr: string): string {
    const date = new Date(birthdayStr);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

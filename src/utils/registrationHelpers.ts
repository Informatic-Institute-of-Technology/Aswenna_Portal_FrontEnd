import type {
    FarmerRegistrationRequest,
    InvestorRegistrationRequest,
    LandownerRegistrationRequest,
} from "@/services";
import { getFileAsBase64 } from "@/utils";

export const getStoredCredentials = () => {
  return {
    email: localStorage.getItem("temp_email") || "",
    password: localStorage.getItem("temp_password") || "",
    emailVerified: localStorage.getItem("email_verified") === "true",
  };
};

export const clearStoredCredentials = () => {
  localStorage.removeItem("temp_email");
  localStorage.removeItem("temp_password");
  localStorage.removeItem("email_verified");
};

export const prepareFarmerRegistrationData = async (formData: {
  fullName: string;
  phoneNumber: string;
  phoneNumberVerified: boolean;
  profilePicture: string | null;
  nicNumber: string;
  birthday: string;
  gender: "Male" | "Female" | "";
  age: number | null;
  address: string;
  city?: string;
  postalCode: string;
  district: string;
  province: string;
  dsDivision: string;
  gnDivision: string;
  nicFiles: File[];
  passbookFiles: File[];
  gnFiles: File[];
  selectedCrops: string[];
  govijanaSevaId?: string;
  experience?: string;
  regions?: string;
  specificNeeds?: string;
}): Promise<FarmerRegistrationRequest> => {
  const { email, password, emailVerified } = getStoredCredentials();

  const nicFrontImage = await getFileAsBase64(formData.nicFiles, 0);
  const nicBackImage = await getFileAsBase64(formData.nicFiles, 1);
  const govijanaSevaPassbookImage = await getFileAsBase64(formData.passbookFiles, 0);
  const gnCertificateImage = await getFileAsBase64(formData.gnFiles, 0);

  return {
    fullName: formData.fullName,
    email,
    emailVerified,
    phoneNumber: formData.phoneNumber,
    phoneNumberVerified: formData.phoneNumberVerified,
    password,
    personalInfo: {
      profilePicture: formData.profilePicture || "",
      nicNumber: formData.nicNumber,
      birthday: formData.birthday,
      gender: formData.gender.toLowerCase() as "male" | "female",
      age: formData.age || 0,
      address: formData.address || formData.city || "",
      city: formData.city || "",
      postalCode: formData.postalCode,
      district: formData.district,
      province: formData.province,
      nicFrontImage,
      nicBackImage,
    },
    role: "farmer",
    farmerDetails: {
      dsDivision: formData.dsDivision,
      gnDivision: formData.gnDivision,
      govijanaSevaId: formData.govijanaSevaId || "",
      GovijanaSevaPassbookImage: govijanaSevaPassbookImage,
      gnCertificateImage,
      crop: formData.selectedCrops.join(", "),
      experience: formData.experience || "0 years",
      regions: formData.regions || formData.district,
      specificNeeds: formData.specificNeeds || "None",
    },
  };
};

export const prepareInvestorRegistrationData = async (formData: {
  fullName: string;
  phoneNumber: string;
  profilePicture: string | null;
  nicNumber: string;
  birthday: string;
  gender: "Male" | "Female" | "";
  age: number | null;
  street: string;
  city: string;
  postalCode: string;
  district: string;
  province: string;
  dsDivision: string;
  gnDivision: string;
  nicFiles: File[];
  organizationName: string;
  headOfficeLocation: string;
  organizationContactNo: string;
  businessRegistrationNo: string;
  cropFocus: string[];
}): Promise<InvestorRegistrationRequest> => {
  const { email, password, emailVerified } = getStoredCredentials();

  const nicFrontImage = await getFileAsBase64(formData.nicFiles, 0);
  const nicBackImage = await getFileAsBase64(formData.nicFiles, 1);

  return {
    fullName: formData.fullName,
    email,
    emailVerified,
    phoneNumber: formData.phoneNumber,
    phoneNumberVerified: false,
    password,
    role: "investor",
    personalInfo: {
      profilePicture: formData.profilePicture || "",
      nicNumber: formData.nicNumber,
      birthday: formData.birthday,
      gender: formData.gender.toLowerCase() as "male" | "female",
      age: formData.age || 0,
      address: formData.street,
      city: formData.city,
      postalCode: formData.postalCode,
      district: formData.district,
      province: formData.province,
      nicFrontImage,
      nicBackImage,
    },
    investorDetails: {
      dsDivision: formData.dsDivision,
      gnDivision: formData.gnDivision,
      organizationName: formData.organizationName,
      companyAddress: formData.headOfficeLocation,
      organizationPhoneNumber: formData.organizationContactNo,
      registrationNo: formData.businessRegistrationNo,
      cropFocus: formData.cropFocus.join(", "),
    },
  };
};


export const prepareLandownerRegistrationData = async (formData: {
  fullName: string;
  phoneNumber: string;
  profilePicture: string | null;
  nicNumber: string;
  birthday: string;
  gender: "Male" | "Female" | "";
  age: number | null;
  street: string;
  city: string;
  postalCode: string;
  district: string;
  province: string;
  dsDivision: string;
  gnDivision: string;
  nicFiles: File[];
  landStreet: string;
  landCity: string;
  landProvince: string;
  landDistrict: string;
  landPostalCode: string;
  landDsDivision: string;
  landGnDivision: string;
  landSize: string;
  soilType: string;
  rentalExpectation: string;
  latitude: number;
  longitude: number;
  landImageFiles: File[];
}): Promise<LandownerRegistrationRequest> => {
  const { email, password, emailVerified } = getStoredCredentials();

  const nicFrontImage = await getFileAsBase64(formData.nicFiles, 0);
  const nicBackImage = await getFileAsBase64(formData.nicFiles, 1);

  const landImages: string[] = [];
  for (const file of formData.landImageFiles) {
    const base64 = await getFileAsBase64([file], 0);
    if (base64) landImages.push(base64);
  }

  return {
    fullName: formData.fullName,
    email,
    emailVerified,
    phoneNumber: formData.phoneNumber,
    phoneNumberVerified: false,
    password,
    role: "landowner",
    personalInfo: {
      profilePicture: formData.profilePicture || "",
      nicNumber: formData.nicNumber,
      birthday: formData.birthday,
      gender: formData.gender.toLowerCase() as "male" | "female",
      age: formData.age || 0,
      address: formData.street,
      city: formData.city,
      postalCode: formData.postalCode,
      district: formData.district,
      province: formData.province,
      nicFrontImage,
      nicBackImage,
    },
    landOwnerDetails: {
      dsDivision: formData.dsDivision,
      gnDivision: formData.gnDivision,
      location: {
        latitude: formData.latitude,
        longitude: formData.longitude,
      },
      landAddress: {
        street: formData.landStreet,
        city: formData.landCity,
        province: formData.landProvince,
        district: formData.landDistrict,
        postalCode: formData.landPostalCode,
        size: formData.landSize,
        soilType: formData.soilType,
        rentalExpectation: formData.rentalExpectation,
        dsDivision: formData.landDsDivision,
        gnDivision: formData.landGnDivision,
        landImages,
      },
    },
  };
};

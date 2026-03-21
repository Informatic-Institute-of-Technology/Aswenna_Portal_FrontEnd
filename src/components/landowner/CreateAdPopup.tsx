import { useAuth } from "@/Context/useAuth";
import { adminService } from "@/services/admin.service";
import {
  ArrowForward,
  Check,
  Close,
  EmailOutlined,
  KeyboardArrowDown,
  PersonOutline,
  PhoneOutlined,
  Upload,
} from "@mui/icons-material";
import { Dialog } from "@mui/material";
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";

interface CreateAdPopupProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    values: LandAdFormValues,
    newImageFiles?: File[],
  ) => void | Promise<void>;
  initialValues?: LandAdFormValues | null;
  mode?: "create" | "edit";
}

export interface LandAdFormValues {
  title: string;
  location: string;
  landArea: string;
  availableFrom: string;
  availableTo: string;
  soilType: string;
  rentalAmount: string;
  waterAvailability: string;
  landHistory: string;
  additionalInfo: string;
  landImages: string[];
}

const EMPTY_FORM_VALUES: LandAdFormValues = {
  title: "",
  location: "",
  landArea: "",
  availableFrom: "",
  availableTo: "",
  soilType: "",
  rentalAmount: "",
  waterAvailability: "",
  landHistory: "",
  additionalInfo: "",
  landImages: [],
};

const valueAsString = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "";
};

const mediaToUrl = (value: unknown): string => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && value) {
    const maybeUrl = (value as { url?: unknown }).url;
    const maybeFileName = (value as { filename?: unknown }).filename;
    if (typeof maybeUrl === "string") return maybeUrl;
    if (typeof maybeFileName === "string") return maybeFileName;
  }
  return "";
};

const uniqueNonEmpty = (values: string[]) => {
  const seen = new Set<string>();
  return values.filter((value) => {
    const trimmed = value.trim();
    if (!trimmed || seen.has(trimmed)) return false;
    seen.add(trimmed);
    return true;
  });
};

const CreateAdPopup = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  mode = "create",
}: CreateAdPopupProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<LandAdFormValues>(EMPTY_FORM_VALUES);
  const [errors, setErrors] = useState<
    Partial<Record<keyof LandAdFormValues, string>>
  >({});
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [fetchedLandImages, setFetchedLandImages] = useState<string[]>([]);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const uploadedObjectUrlsRef = useRef<string[]>([]);
  const uploadedFilesRef = useRef<Map<string, File>>(new Map());

  const profilePicture = useMemo(() => {
    const media = user?.personalInfo?.profilePicture;
    return mediaToUrl(media);
  }, [user?.personalInfo?.profilePicture]);

  const fullName = useMemo(
    () =>
      user?.fullName ||
      [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
      "Landowner",
    [user?.firstName, user?.fullName, user?.lastName],
  );

  const signedUpImageOptions = useMemo(() => {
    return uniqueNonEmpty(fetchedLandImages);
  }, [fetchedLandImages]);

  const allImageOptions = useMemo(
    () => uniqueNonEmpty([...uploadedImages, ...signedUpImageOptions]),
    [signedUpImageOptions, uploadedImages],
  );

  useEffect(() => {
    if (!open) return;

    const base = initialValues ?? EMPTY_FORM_VALUES;
    setFormData(
      mode === "create"
        ? {
            ...base,
            landImages: [],
            additionalInfo: base.additionalInfo || "",
          }
        : base,
    );
    setErrors({});
    setIsLocationOpen(false);

    uploadedObjectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    uploadedObjectUrlsRef.current = [];
    uploadedFilesRef.current.clear();
    setUploadedImages([]);

    // Pre-fill from user profile in create mode.
    if (mode === "create" && user?._id) {
      adminService
        .getUserById(user._id)
        .then((detail) => {
          console.log("[CreateAdPopup] Prefill response user detail:", detail);
          const land =
            detail.landOwner?.landAddress ??
            detail.landOwnerDetails?.landAddress;
          const info = detail.personalInfo;

          // Extract land images from the API response (landImages from landAddress)
          const landImages = land?.landImages ?? [];
          const landImageUrls = landImages
            .map((img) => mediaToUrl(img))
            .filter((url: string) => url);
          setFetchedLandImages(landImageUrls);

          setFormData((prev) => ({
            ...prev,
            location:
              prev.location ||
              land?.city ||
              land?.street ||
              info?.city ||
              info?.address ||
              detail.address ||
              "",
            landArea: prev.landArea || land?.size || "",
            soilType: prev.soilType || land?.soilType || "",
            rentalAmount: prev.rentalAmount || land?.rentalExpectation || "",
            landImages: mode === "create" ? landImageUrls : prev.landImages,
          }));
        })
        .catch((error) => {
          console.error("[CreateAdPopup] Prefill request failed:", error);
        });
    }
  }, [initialValues, mode, open, user?._id]);

  useEffect(
    () => () => {
      uploadedObjectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      uploadedObjectUrlsRef.current = [];
      uploadedFilesRef.current.clear();
    },
    [],
  );

  const handleInputChange = (name: keyof LandAdFormValues, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleCoverUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          landImages: "Please upload valid image files only.",
        }));
        continue;
      }
      const objectUrl = URL.createObjectURL(file);
      uploadedObjectUrlsRef.current.push(objectUrl);
      uploadedFilesRef.current.set(objectUrl, file);
      newUrls.push(objectUrl);
    }
    setUploadedImages((prev) => [...newUrls, ...prev]);
    setFormData((prev) => ({
      ...prev,
      landImages: [...newUrls, ...prev.landImages],
    }));
    event.target.value = "";
  };

  const validateForm = () => {
    const nextErrors: Partial<Record<keyof LandAdFormValues, string>> = {};
    if (!formData.title.trim()) nextErrors.title = "Land ad title is required.";
    if (!formData.location.trim())
      nextErrors.location = "Location is required.";
    if (!formData.landArea.trim())
      nextErrors.landArea = "Land area is required.";
    if (!formData.soilType.trim()) nextErrors.soilType = "Select a soil type.";
    if (!formData.rentalAmount.trim())
      nextErrors.rentalAmount = "Rental amount is required.";
    if (formData.landImages.length === 0) {
      nextErrors.landImages =
        "Select or upload at least one land image before publishing.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      // Extract newly uploaded image files (those not in fetchedLandImages)
      const newImageFiles: File[] = [];
      formData.landImages.forEach((imageUrl) => {
        if (!fetchedLandImages.includes(imageUrl)) {
          const file = uploadedFilesRef.current.get(imageUrl);
          if (file) {
            newImageFiles.push(file);
          }
        }
      });

      await onSubmit(formData, newImageFiles);
      onClose();
    } catch {
      // Parent already handles the notification; keep dialog open for retry.
    }
  };

  const landHistoryOptions = [
    { value: "organic-previous", label: "Previously Used for Organic Farming" },
    {
      value: "conventional-previous",
      label: "Previously Used for Conventional Farming",
    },
    { value: "uncultivated", label: "Uncultivated Land" },
    { value: "crop-rotation", label: "Crop Rotation Practiced" },
    { value: "fallow", label: "Fallow Land" },
  ];

  const dialogTitle =
    mode === "edit" ? "Edit Land Advertisement" : "Create Land Advertisement";
  const primaryActionLabel =
    mode === "edit" ? "Save Changes" : "Publish Land Ad";

  const selectedCovers = formData.landImages;

  const buildLocationSummary = () => {
    const city = valueAsString(user?.personalInfo?.city);
    const district = valueAsString(user?.personalInfo?.district);
    const province = valueAsString(user?.personalInfo?.province);
    return (
      [city, district, province].filter(Boolean).join(", ") ||
      "Location details"
    );
  };

  const inputCls =
    "mt-1.5 block w-full bg-[#141414] text-slate-100 placeholder-slate-600 border-0 rounded-lg px-3.5 h-10 text-sm outline-none transition-all focus:ring-2 focus:ring-[#85a446]/20";
  const inputErrCls =
    "mt-1.5 block w-full bg-[#141414] text-slate-100 placeholder-slate-600 border-0 rounded-lg px-3.5 h-10 text-sm outline-none transition-all ring-2 ring-red-500/60";
  const textareaCls =
    "mt-1.5 block w-full bg-[#141414] text-slate-100 placeholder-slate-600 border-0 rounded-lg px-3.5 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-[#85a446]/20 resize-none";
  const labelCls =
    "text-slate-400 text-[11px] font-semibold uppercase tracking-widest";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          bgcolor: "transparent",
          boxShadow: "none",
          overflow: "visible",
          borderRadius: "16px",
        },
      }}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(0, 0, 0, 0.68)",
          },
        },
      }}
    >
      <div
        className="text-slate-100 rounded-2xl flex flex-col overflow-hidden"
        style={{ background: "#0a0a0a", width: 960, maxHeight: "92vh" }}
      >
        <div
          className="shrink-0 flex items-center gap-3 px-5 py-4"
          style={{ background: "#0a0a0a" }}
        >
          <button
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-full bg-white/[0.06] hover:bg-white/[0.10] transition-colors shrink-0"
          >
            <Close style={{ fontSize: 18 }} className="text-slate-300" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-[#85a446] font-bold uppercase tracking-widest mb-0.5">
              Landowner Ad
            </p>
            <h2 className="text-white text-base font-bold leading-none">
              {dialogTitle}
            </h2>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {[
              "Ad Details",
              mode === "edit" ? "Review & Update" : "Review & Publish",
            ].map((label, i) => (
              <div
                key={label}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all ${
                  i === 0
                    ? "bg-[#85a446] text-white shadow-lg shadow-[#85a446]/25"
                    : "bg-white/[0.05] text-slate-500"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                    i === 0
                      ? "bg-white/25 text-white"
                      : "bg-white/10 text-slate-500"
                  }`}
                >
                  {i + 1}
                </span>
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-7 space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-5 rounded-full bg-[#85a446]" />
                <span className="text-sm text-slate-200 font-bold uppercase tracking-wider">
                  Ad Info
                </span>
              </div>

              <div className="space-y-5">
                <label className="block">
                  <span className={labelCls}>Land Ad Title</span>
                  <input
                    className={errors.title ? inputErrCls : inputCls}
                    type="text"
                    placeholder="e.g. Green Valley Seasonal Lease"
                    value={formData.title}
                    onChange={(event) =>
                      handleInputChange("title", event.target.value)
                    }
                  />
                  {errors.title && (
                    <span className="text-red-400 text-[10px] mt-0.5 block">
                      {errors.title}
                    </span>
                  )}
                </label>

                <label className="block">
                  <span className={labelCls}>Location</span>
                  <input
                    className={errors.location ? inputErrCls : inputCls}
                    type="text"
                    placeholder="City / district"
                    value={formData.location}
                    onChange={(event) =>
                      handleInputChange("location", event.target.value)
                    }
                  />
                  {errors.location && (
                    <span className="text-red-400 text-[10px] mt-0.5 block">
                      {errors.location}
                    </span>
                  )}
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className={labelCls}>Land Area</span>
                    <input
                      className={errors.landArea ? inputErrCls : inputCls}
                      type="text"
                      placeholder="e.g. 25 acres"
                      value={formData.landArea}
                      onChange={(event) =>
                        handleInputChange("landArea", event.target.value)
                      }
                    />
                    {errors.landArea && (
                      <span className="text-red-400 text-[10px] mt-0.5 block">
                        {errors.landArea}
                      </span>
                    )}
                  </label>

                  <label className="block">
                    <span className={labelCls}>Rental Amount (LKR)</span>
                    <input
                      className={errors.rentalAmount ? inputErrCls : inputCls}
                      type="text"
                      placeholder="e.g. 50000"
                      value={formData.rentalAmount}
                      onChange={(event) =>
                        handleInputChange("rentalAmount", event.target.value)
                      }
                    />
                    {errors.rentalAmount && (
                      <span className="text-red-400 text-[10px] mt-0.5 block">
                        {errors.rentalAmount}
                      </span>
                    )}
                  </label>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-5 rounded-full bg-[#85a446]" />
                <span className="text-sm text-slate-200 font-bold uppercase tracking-wider">
                  Availability & Land Details
                </span>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className={labelCls}>Available From</span>
                    <input
                      className={
                        inputCls + " [color-scheme:dark] cursor-pointer"
                      }
                      type="date"
                      value={formData.availableFrom}
                      onChange={(event) =>
                        handleInputChange("availableFrom", event.target.value)
                      }
                    />
                  </label>
                  <label className="block">
                    <span className={labelCls}>Available To</span>
                    <input
                      className={
                        inputCls + " [color-scheme:dark] cursor-pointer"
                      }
                      type="date"
                      value={formData.availableTo}
                      onChange={(event) =>
                        handleInputChange("availableTo", event.target.value)
                      }
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className={labelCls}>Soil Type</span>
                    <input
                      className={errors.soilType ? inputErrCls : inputCls}
                      type="text"
                      placeholder="Prefilled from your profile"
                      value={formData.soilType}
                      onChange={(event) =>
                        handleInputChange("soilType", event.target.value)
                      }
                    />
                    {errors.soilType && (
                      <span className="text-red-400 text-[10px] mt-0.5 block">
                        {errors.soilType}
                      </span>
                    )}
                  </label>

                  <label className="block">
                    <span className={labelCls}>Water Availability</span>
                    <select
                      className={inputCls}
                      value={formData.waterAvailability}
                      onChange={(event) =>
                        handleInputChange(
                          "waterAvailability",
                          event.target.value,
                        )
                      }
                    >
                      <option value="">Select water source</option>
                      <option value="borewell">Borewell</option>
                      <option value="well">Well</option>
                      <option value="river">River</option>
                      <option value="canal">Canal</option>
                      <option value="rain-harvested">Rain-Harvested</option>
                      <option value="municipality">Municipality Supply</option>
                      <option value="limited">Limited/None</option>
                    </select>
                  </label>
                </div>

                <label className="block">
                  <span className={labelCls}>Land History</span>
                  <select
                    className={inputCls}
                    value={formData.landHistory}
                    onChange={(event) =>
                      handleInputChange("landHistory", event.target.value)
                    }
                  >
                    <option value="">Select</option>
                    {landHistoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className={labelCls}>Additional Information</span>
                  <textarea
                    className={textareaCls}
                    rows={3}
                    placeholder="Add any details investors should know"
                    value={formData.additionalInfo}
                    onChange={(event) =>
                      handleInputChange("additionalInfo", event.target.value)
                    }
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="w-[340px] shrink-0 overflow-y-auto px-5 py-7 space-y-6 border-l border-white/[0.14]">
            <div
              className="rounded-xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg,#0f1a0a 0%,#0d1108 100%)",
              }}
            >
              <div className="px-4 pt-3 pb-1">
                <p className="text-[10px] text-[#85a446]/70 font-bold uppercase tracking-widest mb-2">
                  Publishing as
                </p>
              </div>
              <div className="flex items-center gap-3 px-4 pb-4">
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#85a446]/10 flex items-center justify-center shrink-0">
                    <PersonOutline
                      className="text-[#85a446]"
                      style={{ fontSize: 20 }}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white text-sm font-bold truncate">
                      {fullName}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#85a446]/20 text-[#85a446]">
                      Landowner
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5 flex items-center gap-1 truncate">
                    <EmailOutlined style={{ fontSize: 11 }} />{" "}
                    {user?.email || "-"}
                  </p>
                  <p className="text-slate-500 text-[11px] mt-0.5 flex items-center gap-1">
                    <PhoneOutlined style={{ fontSize: 11 }} />{" "}
                    {user?.phoneNumber || "-"}
                  </p>
                  <p className="text-slate-500 text-[11px] mt-0.5 truncate">
                    {buildLocationSummary()}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-1 h-4 rounded-full bg-[#85a446]" />
                <span className="text-xs text-slate-300 font-bold uppercase tracking-widest">
                  Land Images
                </span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="ml-auto text-[#85a446] text-[10px] font-bold flex items-center gap-1 hover:opacity-80 transition-opacity"
                >
                  <Upload style={{ fontSize: 13 }} /> Upload
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleCoverUpload}
                className="hidden"
              />

              {selectedCovers.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 mb-2.5">
                  {selectedCovers.map((imageUrl, idx) => (
                    <div
                      key={`${imageUrl}-${idx}`}
                      className="relative rounded-lg overflow-hidden aspect-square"
                    >
                      <img
                        src={imageUrl}
                        alt={`Selected land image ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            landImages: prev.landImages.filter(
                              (_, i) => i !== idx,
                            ),
                          }));
                        }}
                        className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <Close
                          className="text-white"
                          style={{ fontSize: 18 }}
                        />
                      </button>
                      <div className="absolute top-1 right-1 bg-[#85a446] text-white px-1.5 py-0.5 rounded-full text-[8px] font-bold flex items-center gap-0.5">
                        <Check style={{ fontSize: 9 }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full aspect-video rounded-xl mb-2.5 border border-dashed border-white/20 bg-[#111111] flex items-center justify-center text-slate-500 text-xs px-4 text-center">
                  Choose signup images or upload land images.
                </div>
              )}

              {errors.landImages && (
                <span className="text-red-400 text-[10px] mb-2 block">
                  {errors.landImages}
                </span>
              )}

              <button
                type="button"
                onClick={() => setIsLocationOpen((value) => !value)}
                className="w-full flex items-center justify-between bg-[#141414] rounded-xl px-4 h-11 text-xs text-slate-400 hover:text-slate-200 transition-colors mb-2"
              >
                <span>
                  {allImageOptions.length === 0
                    ? "No signup images found"
                    : `${allImageOptions.length} image${allImageOptions.length > 1 ? "s" : ""} available`}
                </span>
                <KeyboardArrowDown
                  style={{ fontSize: 18 }}
                  className={`transition-transform ${isLocationOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isLocationOpen && allImageOptions.length > 0 && (
                <div className="grid grid-cols-4 gap-1.5">
                  {allImageOptions.map((imageUrl, index) => {
                    const isSelected = selectedCovers.includes(imageUrl);
                    return (
                      <button
                        type="button"
                        key={`${imageUrl}-${index}`}
                        className={`relative rounded-lg overflow-hidden aspect-square transition-all ${
                          isSelected
                            ? "ring-2 ring-[#85a446] ring-offset-1 ring-offset-[#0a0a0a]"
                            : "opacity-70 hover:opacity-95"
                        }`}
                        onClick={() => {
                          setFormData((prev) => {
                            const newImages = isSelected
                              ? prev.landImages.filter(
                                  (img) => img !== imageUrl,
                                )
                              : [...prev.landImages, imageUrl];
                            return { ...prev, landImages: newImages };
                          });
                        }}
                      >
                        <img
                          src={imageUrl}
                          alt={`Uploaded option ${index + 1}`}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-[#85a446]/20 flex items-center justify-center">
                            <Check
                              className="text-[#85a446]"
                              style={{ fontSize: 18 }}
                            />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          className="shrink-0 flex items-center justify-between gap-3 px-5 py-3.5"
          style={{ background: "#0a0a0a" }}
        >
          <button
            onClick={onClose}
            className="text-slate-500 text-sm font-semibold px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.07] hover:text-slate-300 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-[#85a446] hover:bg-[#93b34e] active:scale-[0.98] text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-[#85a446]/20"
          >
            {primaryActionLabel} <ArrowForward style={{ fontSize: 18 }} />
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default CreateAdPopup;

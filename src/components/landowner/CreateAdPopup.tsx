import {
  ArrowBack,
  ArrowForward,
  Check,
  Close,
  EmailOutlined,
  KeyboardArrowDown,
  Landscape,
  PhoneOutlined,
  Upload,
} from "@mui/icons-material";
import { Dialog } from "@mui/material";
import { useMemo, useState } from "react";

export interface LandownerOfferPrefill {
  landownerId: string;
  landownerName: string;
  landownerImage?: string;
  location?: string;
  district?: string;
  province?: string;
  coordinates?: string;
  specialization?: string;
  rating?: number;
  suggestedMonthlyRental?: number;
  suggestedLandArea?: string;
  landImages: string[];
}

export interface LandOfferDraft {
  title: string;
  description: string;
  landIcon: string;
  monthlyRental: number;
  landArea: string;
  location: string;
  district: string;
  province: string;
  availableFrom: string;
  availableTo: string;
  soilType: string;
  landHistory: string;
  additionalInfo: string;
  coverImage: string;
  landownerId: string;
  landownerName: string;
  landownerImage?: string;
  landownerSpecialization?: string;
  landownerRating?: number;
  coordinates?: string;
  status: "pending";
}

interface CreateAdPopupProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (offer: LandOfferDraft) => void;
  prefillData?: LandownerOfferPrefill;
}

const LAND_ICONS = ["🏞️", "🌾", "🌿", "🌱", "🍃", "🌳", "🌻", "🍂"];

const SL_DISTRICTS = [
  "Ampara",
  "Anuradhapura",
  "Badulla",
  "Batticaloa",
  "Colombo",
  "Galle",
  "Gampaha",
  "Hambantota",
  "Jaffna",
  "Kalutara",
  "Kandy",
  "Kegalle",
  "Kilinochchi",
  "Kurunegala",
  "Mannar",
  "Matale",
  "Matara",
  "Monaragala",
  "Mullaitivu",
  "Nuwara Eliya",
  "Polonnaruwa",
  "Puttalam",
  "Ratnapura",
  "Trincomalee",
  "Vavuniya",
];

const CreateAdPopup = ({
  open,
  onClose,
  onSubmit,
  prefillData,
}: CreateAdPopupProps) => {
  const buildInitialFormData = () => ({
    title: "",
    description: "",
    landIcon: "🏞️",
    preferredRegions: [] as string[],
    monthlyRental: prefillData?.suggestedMonthlyRental
      ? String(prefillData.suggestedMonthlyRental)
      : "",
    landArea: prefillData?.suggestedLandArea || "",
    availableFrom: "",
    availableTo: "",
    location: prefillData?.location || "",
    district: prefillData?.district || "",
    province: prefillData?.province || "",
    soilType: "",
    landHistory: "",
    additionalInfo: "",
    coverImage: prefillData?.landImages?.[0] || "",
  });

  const [districtOpen, setDistrictOpen] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [reviewDraft, setReviewDraft] = useState<LandOfferDraft | null>(null);

  const [formData, setFormData] = useState(buildInitialFormData);

  const soilTypes = [
    { value: "clay", label: "Clay" },
    { value: "sandy", label: "Sandy" },
    { value: "loamy", label: "Loamy" },
    { value: "silty", label: "Silty" },
    { value: "peaty", label: "Peaty" },
    { value: "chalky", label: "Chalky" },
    { value: "gravel", label: "Gravel" },
    { value: "other", label: "Other" },
  ];

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

  const autoLandImages = useMemo(
    () => (prefillData?.landImages || []).filter(Boolean),
    [prefillData?.landImages],
  );

  const resetFormState = () => {
    setDistrictOpen(false);
    setCustomImageUrl("");
    setFormError(null);
    setReviewDraft(null);
    setFormData(buildInitialFormData());
  };

  const inputCls =
    "mt-1.5 block w-full bg-[#141414] text-slate-100 placeholder-slate-600 border-0 rounded-lg px-3.5 h-10 text-sm outline-none transition-all focus:ring-2 focus:ring-[#85a446]/20";
  const inputErrCls =
    "mt-1.5 block w-full bg-[#141414] text-slate-100 placeholder-slate-600 border-0 rounded-lg px-3.5 h-10 text-sm outline-none transition-all ring-2 ring-red-500/60";
  const textareaCls =
    "mt-1.5 block w-full bg-[#141414] text-slate-100 placeholder-slate-600 border-0 rounded-lg px-3.5 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-[#85a446]/20 resize-none";
  const labelCls =
    "text-slate-400 text-[11px] font-semibold uppercase tracking-widest";

  const selectedCoverImage = customImageUrl.trim() || formData.coverImage;

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | string[],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (formError) setFormError(null);
  };

  const handleReview = () => {
    const monthlyRental = Number(formData.monthlyRental);

    if (!formData.title.trim()) {
      setFormError("Offer title is required.");
      return;
    }

    if (!formData.description.trim()) {
      setFormError("Description is required.");
      return;
    }

    if (!monthlyRental || monthlyRental <= 0) {
      setFormError("Monthly rental must be greater than 0.");
      return;
    }

    if (!selectedCoverImage) {
      setFormError("Please select or provide a cover image.");
      return;
    }

    setReviewDraft({
      title: formData.title.trim(),
      description: formData.description.trim(),
      landIcon: formData.landIcon,
      monthlyRental,
      landArea: formData.landArea.trim(),
      location: formData.location.trim(),
      district: formData.district.trim(),
      province: formData.province.trim(),
      availableFrom: formData.availableFrom,
      availableTo: formData.availableTo,
      soilType: formData.soilType,
      landHistory: formData.landHistory,
      additionalInfo: formData.additionalInfo.trim(),
      coverImage: selectedCoverImage,
      landownerId: prefillData?.landownerId || "",
      landownerName: prefillData?.landownerName || "Landowner",
      landownerImage: prefillData?.landownerImage,
      landownerSpecialization: prefillData?.specialization,
      landownerRating: prefillData?.rating,
      coordinates: prefillData?.coordinates,
      status: "pending",
    });
  };

  const handleConfirm = () => {
    if (!reviewDraft) return;
    onSubmit(reviewDraft);
    setReviewDraft(null);
    resetFormState();
    onClose();
  };

  const handleCloseDialog = () => {
    resetFormState();
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleCloseDialog}
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
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
            },
          },
        }}
      >
        <div
          className="font-['Manrope'] text-slate-100 rounded-2xl flex flex-col overflow-hidden"
          style={{ background: "#0a0a0a", width: 920, maxHeight: "92vh" }}
        >
          <div className="shrink-0 flex items-center gap-3 px-5 py-4">
            <button
              onClick={handleCloseDialog}
              className="flex size-9 items-center justify-center rounded-full bg-white/[0.06] hover:bg-white/[0.10] transition-colors shrink-0"
            >
              <ArrowBack style={{ fontSize: 18 }} className="text-slate-300" />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-[#85a446] font-bold uppercase tracking-widest mb-0.5">
                New Offer
              </p>
              <h2 className="text-white text-base font-bold leading-none">
                Land Rental Offer
              </h2>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {["Offer Details", "Review & Publish"].map((label, i) => (
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
                    Offer Info
                  </span>
                </div>
                <div className="space-y-5">
                  <label className="block">
                    <span className={labelCls}>Offer Title</span>
                    <input
                      className={
                        formError && !formData.title.trim()
                          ? inputErrCls
                          : inputCls
                      }
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      placeholder="e.g. Premium Agricultural Land Lease"
                    />
                  </label>

                  <label className="block">
                    <span className={labelCls}>Description</span>
                    <textarea
                      className={textareaCls}
                      rows={3}
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="Describe land quality, irrigation, access, and key leasing terms..."
                    />
                  </label>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-5 rounded-full bg-[#85a446]" />
                  <span className="text-sm text-slate-200 font-bold uppercase tracking-wider">
                    Preferred Regions
                  </span>
                </div>

                {formData.preferredRegions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {formData.preferredRegions.map((region) => (
                      <span
                        key={region}
                        className="flex items-center gap-1 bg-[#85a446]/15 text-[#85a446] text-xs font-semibold px-2.5 py-1 rounded-full"
                      >
                        {region}
                        <Close
                          style={{ fontSize: 11 }}
                          className="cursor-pointer opacity-60 hover:opacity-100"
                          onClick={() =>
                            handleInputChange(
                              "preferredRegions",
                              formData.preferredRegions.filter(
                                (d) => d !== region,
                              ),
                            )
                          }
                        />
                      </span>
                    ))}
                  </div>
                )}

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setDistrictOpen((v) => !v)}
                    className="w-full flex items-center justify-between bg-[#141414] rounded-xl px-5 h-12 text-sm text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <span>
                      {formData.preferredRegions.length === 0
                        ? "Select districts…"
                        : `${formData.preferredRegions.length} district${formData.preferredRegions.length > 1 ? "s" : ""} selected`}
                    </span>
                    <KeyboardArrowDown
                      style={{ fontSize: 18 }}
                      className={`transition-transform ${districtOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {districtOpen && (
                    <div className="absolute z-20 mt-1 w-full bg-[#181818] rounded-xl shadow-xl overflow-hidden">
                      <div className="grid grid-cols-3 gap-px bg-white/[0.04] max-h-56 overflow-y-auto p-1">
                        {SL_DISTRICTS.map((district) => {
                          const selected =
                            formData.preferredRegions.includes(district);
                          return (
                            <button
                              key={district}
                              type="button"
                              onClick={() => {
                                const next = selected
                                  ? formData.preferredRegions.filter(
                                      (d) => d !== district,
                                    )
                                  : [...formData.preferredRegions, district];
                                handleInputChange("preferredRegions", next);
                              }}
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                                selected
                                  ? "bg-[#85a446]/20 text-[#85a446]"
                                  : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-200"
                              }`}
                            >
                              <span
                                className={`w-3.5 h-3.5 rounded-sm shrink-0 flex items-center justify-center ${
                                  selected ? "bg-[#85a446]" : "bg-white/10"
                                }`}
                              >
                                {selected && (
                                  <Check
                                    style={{ fontSize: 10 }}
                                    className="text-white"
                                  />
                                )}
                              </span>
                              {district}
                            </button>
                          );
                        })}
                      </div>
                      <div className="px-3 py-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setDistrictOpen(false)}
                          className="text-[#85a446] text-xs font-bold hover:opacity-80"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-5 rounded-full bg-[#85a446]" />
                  <span className="text-sm text-slate-200 font-bold uppercase tracking-wider">
                    Land Rental Details
                  </span>
                </div>
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className={labelCls}>Monthly Rental (LKR)</span>
                      <input
                        className={
                          formError &&
                          (!formData.monthlyRental ||
                            Number(formData.monthlyRental) <= 0)
                            ? inputErrCls
                            : inputCls
                        }
                        type="number"
                        min={0}
                        value={formData.monthlyRental}
                        onChange={(e) =>
                          handleInputChange("monthlyRental", e.target.value)
                        }
                      />
                    </label>
                    <label className="block">
                      <span className={labelCls}>Land Area</span>
                      <input
                        className={inputCls}
                        type="text"
                        value={formData.landArea}
                        onChange={(e) =>
                          handleInputChange("landArea", e.target.value)
                        }
                        placeholder="e.g. 12 acres"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className={labelCls}>Available From</span>
                      <input
                        className={inputCls + " [color-scheme:dark]"}
                        type="date"
                        value={formData.availableFrom}
                        onChange={(e) =>
                          handleInputChange("availableFrom", e.target.value)
                        }
                      />
                    </label>
                    <label className="block">
                      <span className={labelCls}>Available To</span>
                      <input
                        className={inputCls + " [color-scheme:dark]"}
                        type="date"
                        value={formData.availableTo}
                        onChange={(e) =>
                          handleInputChange("availableTo", e.target.value)
                        }
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className={labelCls}>Location</span>
                      <input
                        className={inputCls}
                        type="text"
                        value={formData.location}
                        onChange={(e) =>
                          handleInputChange("location", e.target.value)
                        }
                      />
                    </label>
                    <label className="block">
                      <span className={labelCls}>District</span>
                      <input
                        className={inputCls}
                        type="text"
                        value={formData.district}
                        onChange={(e) =>
                          handleInputChange("district", e.target.value)
                        }
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className={labelCls}>Province</span>
                      <input
                        className={inputCls}
                        type="text"
                        value={formData.province}
                        onChange={(e) =>
                          handleInputChange("province", e.target.value)
                        }
                      />
                    </label>
                    <label className="block">
                      <span className={labelCls}>Soil Type</span>
                      <select
                        className={
                          inputCls + " cursor-pointer [color-scheme:dark]"
                        }
                        value={formData.soilType}
                        onChange={(e) =>
                          handleInputChange("soilType", e.target.value)
                        }
                      >
                        <option value="">Select soil type</option>
                        {soilTypes.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className={labelCls}>Land History</span>
                      <select
                        className={
                          inputCls + " cursor-pointer [color-scheme:dark]"
                        }
                        value={formData.landHistory}
                        onChange={(e) =>
                          handleInputChange("landHistory", e.target.value)
                        }
                      >
                        <option value="">Select history</option>
                        {landHistoryOptions.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className={labelCls}>Additional Info</span>
                      <input
                        className={inputCls}
                        type="text"
                        value={formData.additionalInfo}
                        onChange={(e) =>
                          handleInputChange("additionalInfo", e.target.value)
                        }
                        placeholder="Water source / road access / utilities"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {formError && (
                <p className="text-red-400 text-xs font-medium">{formError}</p>
              )}
            </div>

            <div className="w-[320px] shrink-0 overflow-y-auto px-5 py-7 space-y-6 border-l border-white/[0.08]">
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
                  {prefillData?.landownerImage ? (
                    <img
                      src={prefillData.landownerImage}
                      alt={prefillData.landownerName}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#85a446]/10 flex items-center justify-center shrink-0">
                      <Landscape
                        className="text-[#85a446]"
                        style={{ fontSize: 20 }}
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white text-sm font-bold truncate">
                        {prefillData?.landownerName || "Landowner"}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#85a446]/20 text-[#85a446]">
                        Landowner
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5 flex items-center gap-1 truncate">
                      <EmailOutlined style={{ fontSize: 11 }} />{" "}
                      {prefillData?.landownerId || "—"}
                    </p>
                    <p className="text-slate-500 text-[11px] mt-0.5 flex items-center gap-1">
                      <PhoneOutlined style={{ fontSize: 11 }} />{" "}
                      {prefillData?.location || "—"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-5 rounded-full bg-[#85a446]" />
                  <span className="text-sm text-slate-200 font-bold uppercase tracking-wider">
                    Land Icon
                  </span>
                  <span className="ml-auto text-xl leading-none">
                    {formData.landIcon}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-1.5">
                  {LAND_ICONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      className={`text-xl h-11 flex items-center justify-center rounded-lg transition-all ${
                        formData.landIcon === icon
                          ? "bg-[#85a446]/20 ring-2 ring-[#85a446] scale-105 shadow-lg shadow-[#85a446]/15"
                          : "bg-[#141414] hover:bg-[#85a446]/10"
                      }`}
                      onClick={() => handleInputChange("landIcon", icon)}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-1 h-4 rounded-full bg-[#85a446]" />
                  <span className="text-xs text-slate-300 font-bold uppercase tracking-widest">
                    Cover Image
                  </span>
                  <button
                    type="button"
                    className="ml-auto text-[#85a446] text-[10px] font-bold flex items-center gap-1 hover:opacity-80 transition-opacity"
                  >
                    <Upload style={{ fontSize: 13 }} /> Upload
                  </button>
                </div>

                {selectedCoverImage && (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-2.5">
                    <img
                      src={selectedCoverImage}
                      alt="Selected"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-2 right-2 bg-[#85a446] text-white px-1.5 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-0.5">
                      <Check style={{ fontSize: 10 }} /> Selected
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-5 gap-1.5 mb-2">
                  {autoLandImages.map((imageUrl) => (
                    <div
                      key={imageUrl}
                      className={`relative rounded-lg overflow-hidden cursor-pointer aspect-square transition-all ${
                        formData.coverImage === imageUrl && !customImageUrl
                          ? "ring-2 ring-[#85a446] ring-offset-1 ring-offset-[#0a0a0a]"
                          : "opacity-70 hover:opacity-95"
                      }`}
                      onClick={() => {
                        setCustomImageUrl("");
                        handleInputChange("coverImage", imageUrl);
                      }}
                    >
                      <img
                        src={imageUrl}
                        alt="Land"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                <input
                  className={inputCls}
                  type="text"
                  placeholder="Or paste custom image URL"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div
            className="shrink-0 flex items-center justify-between gap-3 px-5 py-3.5"
            style={{ background: "#0a0a0a" }}
          >
            <button
              className="text-slate-500 text-sm font-semibold px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.07] hover:text-slate-300 transition-all"
              onClick={() => setFormError(null)}
            >
              Save Draft
            </button>
            <button
              onClick={handleReview}
              className="flex items-center gap-2 bg-[#85a446] hover:bg-[#93b34e] active:scale-[0.98] text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-[#85a446]/20"
            >
              Create Land Offer <ArrowForward style={{ fontSize: 18 }} />
            </button>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={!!reviewDraft}
        onClose={() => setReviewDraft(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "#0d0d0d",
            borderRadius: "16px",
            border: "1px solid rgba(133,164,70,0.15)",
          },
        }}
      >
        <div className="px-6 pt-6 pb-4 border-b border-white/10">
          <p className="text-[10px] text-[#85a446] font-bold uppercase tracking-widest mb-1">
            Ready to Post
          </p>
          <h3 className="text-white text-lg font-bold">
            Confirm your land offer
          </h3>
        </div>

        {reviewDraft && (
          <div className="px-6 py-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#85a446]/15 text-2xl">
                {reviewDraft.landIcon}
              </div>
              <div>
                <p className="text-white font-bold text-sm">
                  {reviewDraft.title}
                </p>
                <p className="text-[#85a446] text-[11px] font-semibold mt-0.5">
                  Monthly Rental: LKR{" "}
                  {reviewDraft.monthlyRental.toLocaleString()}
                </p>
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed">
              {reviewDraft.description}
            </p>

            {reviewDraft.coverImage && (
              <img
                src={reviewDraft.coverImage}
                alt="Land cover"
                className="w-full h-36 object-cover rounded-xl border border-white/10"
              />
            )}
          </div>
        )}

        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={() => setReviewDraft(null)}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-400 bg-white/[0.05] hover:bg-white/[0.09] hover:text-slate-200 transition-all"
          >
            Review Again
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-[#85a446] hover:bg-[#93b34e] transition-all shadow-lg shadow-[#85a446]/20"
          >
            Confirm & Post
          </button>
        </div>
      </Dialog>
    </>
  );
};

export default CreateAdPopup;

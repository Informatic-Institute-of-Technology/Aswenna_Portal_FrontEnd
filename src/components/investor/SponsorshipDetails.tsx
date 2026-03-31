import { useAuth } from "@/Context/useAuth";
import coverImages from "@/data/json/coverImages.json";
import {
  ArrowBack,
  ArrowForward,
  Check,
  Close,
  EmailOutlined,
  KeyboardArrowDown,
  MonetizationOnOutlined,
  PersonOutline,
  PhoneOutlined,
  ShowChartOutlined,
  Upload,
} from "@mui/icons-material";
import React, { useState } from "react";
import { AppButton } from "../../shared/components";

interface SponsorshipDetailsProps {
  onBack: () => void;
  onSubmit: (data: SponsorshipFormData) => void;
  onSaveDraft: (data: SponsorshipFormData) => void;
  initialData?: Partial<SponsorshipFormData>;
  submitLabel?: string;
  headerLabel?: string;
}

export interface SponsorshipFormData {
  projectTitle: string;
  description: string;
  preferredRegions: string[];
  cropName: string;
  cropIcon: string;
  coverImage: string;
  expectedROI: number;
  expiryDate: string;
  minBudget: string;
  maxBudget: string;
  farmingMethod: "hydroponic" | "traditional" | "aquaponics";
  commissionRate: number;
  supportType: "financial" | "technical" | "supply";
}

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

const CROP_EMOJIS = [
  "🌾",
  "🥕",
  "🍅",
  "🥦",
  "🌽",
  "🥔",
  "🧅",
  "🧄",
  "🥬",
  "🫑",
];

type CoverImage = { id: string; label: string; url: string };
const coverImageList = coverImages as CoverImage[];
const fallbackCoverUrl = coverImageList[0]?.url;

export const SponsorshipDetails: React.FC<SponsorshipDetailsProps> = ({
  onBack,
  onSubmit,
  onSaveDraft,
  initialData,
  submitLabel = "Create Investment Offer",
  headerLabel = "New Offer",
}) => {
  const { user } = useAuth();

  const profilePicture = (() => {
    const pic = user?.personalInfo?.profilePicture;
    if (!pic) return null;
    if (typeof pic === "string") return pic;
    return pic.url ?? null;
  })();

  const fullName =
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "—";

  const [formData, setFormData] = useState<SponsorshipFormData>({
    projectTitle: initialData?.projectTitle || "",
    description: initialData?.description || "",
    preferredRegions: initialData?.preferredRegions || [],
    cropName: initialData?.cropName || "",
    cropIcon: initialData?.cropIcon || "",
    coverImage: initialData?.coverImage || "",
    expectedROI: initialData?.expectedROI || 0,
    expiryDate: initialData?.expiryDate || "",
    minBudget: initialData?.minBudget || "",
    maxBudget: initialData?.maxBudget || "",
    farmingMethod: initialData?.farmingMethod || "traditional",
    commissionRate: initialData?.commissionRate || 5,
    supportType: initialData?.supportType || "financial",
  });

  const [districtOpen, setDistrictOpen] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof SponsorshipFormData, string>>
  >({});

  const handleInputChange = (
    field: keyof SponsorshipFormData,
    value: unknown,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof SponsorshipFormData, string>> = {};
    if (!formData.projectTitle.trim()) newErrors.projectTitle = "Required";
    if (!formData.description.trim()) newErrors.description = "Required";
    if (!formData.minBudget.trim()) newErrors.minBudget = "Required";
    if (!formData.maxBudget.trim()) newErrors.maxBudget = "Required";
    if (!formData.expectedROI || formData.expectedROI <= 0)
      newErrors.expectedROI = "Must be > 0";
    if (!formData.expiryDate) newErrors.expiryDate = "Required";
    if (!formData.cropName.trim()) newErrors.cropName = "Required";
    if (!formData.cropIcon) newErrors.cropIcon = "Select a crop icon";
    if (!formData.coverImage) newErrors.coverImage = "Select a cover image";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitClick = () => {
    if (validate()) onSubmit(formData);
  };

  const inputCls =
    "mt-1.5 block w-full bg-[#141414] text-slate-100 placeholder-slate-600 border-0 rounded-lg px-3.5 h-10 text-sm outline-none transition-all focus:ring-2 focus:ring-[#85a446]/20";
  const inputErrCls =
    "mt-1.5 block w-full bg-[#141414] text-slate-100 placeholder-slate-600 border-0 rounded-lg px-3.5 h-10 text-sm outline-none transition-all ring-2 ring-red-500/60";
  const textareaCls =
    "mt-1.5 block w-full bg-[#141414] text-slate-100 placeholder-slate-600 border-0 rounded-lg px-3.5 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-[#85a446]/20 resize-none";
  const textareaErrCls =
    "mt-1.5 block w-full bg-[#141414] text-slate-100 placeholder-slate-600 border-0 rounded-lg px-3.5 py-2.5 text-sm outline-none transition-all ring-2 ring-red-500/60 resize-none";
  const labelCls =
    "text-slate-400 text-[11px] font-semibold uppercase tracking-widest";
  const errMsg = (field: keyof SponsorshipFormData) =>
    errors[field] ? (
      <span className="text-red-400 text-[10px] mt-0.5 block">
        {errors[field]}
      </span>
    ) : null;

  const selectedCover = coverImageList.find(
    (c) => c.id === formData.coverImage,
  );

  return (
    <div
      className="font-['Manrope'] text-slate-100 rounded-2xl flex flex-col overflow-hidden"
      style={{ background: "#0a0a0a", width: 920, maxHeight: "92vh" }}
    >
      {/* ── Header ── */}
      <div
        className="shrink-0 flex items-center gap-3 px-5 py-4"
        style={{ background: "#0a0a0a" }}
      >
        <button
          onClick={onBack}
          className="flex size-9 items-center justify-center rounded-full bg-white/[0.06] hover:bg-white/[0.10] transition-colors shrink-0"
        >
          <ArrowBack style={{ fontSize: 18 }} className="text-slate-300" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-[#85a446] font-bold uppercase tracking-widest mb-0.5">
            {headerLabel}
          </p>
          <h2 className="text-white text-base font-bold leading-none">
            Investment Offer
          </h2>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {["Offer Details", "Review & Publish"].map((label, i) => (
            <div
              key={i}
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

      {/* ── Body (two-column) ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left column */}
        <div className="flex-1 overflow-y-auto px-6 py-7 space-y-8">
          {/* Offer Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-5 rounded-full bg-[#85a446]" />
              <span className="text-sm text-slate-200 font-bold uppercase tracking-wider">
                Offer Info
              </span>
            </div>
            <div className="space-y-5">
              <label className="block">
                <span className={labelCls}>Project Title</span>
                <input
                  className={errors.projectTitle ? inputErrCls : inputCls}
                  type="text"
                  placeholder="e.g. Sustainable Rice Farm 2026"
                  value={formData.projectTitle}
                  onChange={(e) =>
                    handleInputChange("projectTitle", e.target.value)
                  }
                />
                {errMsg("projectTitle")}
              </label>
              <label className="block">
                <span className={labelCls}>Description</span>
                <textarea
                  className={errors.description ? textareaErrCls : textareaCls}
                  rows={3}
                  placeholder="Describe the investment opportunity, terms, and expected outcomes..."
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                />
                {errMsg("description")}
              </label>
            </div>
          </div>

          {/* Preferred Regions */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-5 rounded-full bg-[#85a446]" />
              <span className="text-sm text-slate-200 font-bold uppercase tracking-wider">
                Preferred Regions
              </span>
            </div>

            {formData.preferredRegions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {formData.preferredRegions.map((region, i) => (
                  <span
                    key={i}
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
                            (_, idx) => idx !== i,
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

          {/* Investment Details */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-5 rounded-full bg-[#85a446]" />
              <span className="text-sm text-slate-200 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <MonetizationOnOutlined style={{ fontSize: 15 }} /> Investment
                Details
              </span>
            </div>
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className={labelCls}>Min Budget (LKR)</span>
                  <input
                    className={errors.minBudget ? inputErrCls : inputCls}
                    type="text"
                    placeholder="e.g. 500,000"
                    value={formData.minBudget}
                    onChange={(e) =>
                      handleInputChange("minBudget", e.target.value)
                    }
                  />
                  {errMsg("minBudget")}
                </label>
                <label className="block">
                  <span className={labelCls}>Max Budget (LKR)</span>
                  <input
                    className={errors.maxBudget ? inputErrCls : inputCls}
                    type="text"
                    placeholder="e.g. 5,000,000"
                    value={formData.maxBudget}
                    onChange={(e) =>
                      handleInputChange("maxBudget", e.target.value)
                    }
                  />
                  {errMsg("maxBudget")}
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className={labelCls + " flex items-center gap-1"}>
                    <ShowChartOutlined style={{ fontSize: 13 }} /> Expected ROI
                    (%)
                  </span>
                  <input
                    className={errors.expectedROI ? inputErrCls : inputCls}
                    type="number"
                    min={0}
                    step={0.5}
                    placeholder="e.g. 12.5"
                    value={formData.expectedROI || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "expectedROI",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                  />
                  {errMsg("expectedROI")}
                </label>
                <label className="block">
                  <span className={labelCls}>Commission Rate (%)</span>
                  <input
                    className={inputCls}
                    type="number"
                    min={0}
                    max={100}
                    value={formData.commissionRate}
                    onChange={(e) =>
                      handleInputChange(
                        "commissionRate",
                        parseInt(e.target.value) || 0,
                      )
                    }
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Offer Expiry Date */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-5 rounded-full bg-[#85a446]" />
              <span className="text-sm text-slate-200 font-bold uppercase tracking-wider">
                Offer Expiry Date
              </span>
            </div>
            <label className="block">
              <input
                className={
                  (errors.expiryDate ? inputErrCls : inputCls) +
                  " [color-scheme:dark] cursor-pointer"
                }
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={formData.expiryDate}
                onChange={(e) =>
                  handleInputChange("expiryDate", e.target.value)
                }
              />
              {errMsg("expiryDate")}
            </label>
          </div>

          {/* Farming & Support */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-5 rounded-full bg-[#85a446]" />
              <span className="text-sm text-slate-200 font-bold uppercase tracking-wider">
                Farming &amp; Support
              </span>
            </div>
            <div className="space-y-5">
              <div>
                <span className={labelCls + " mb-2 block"}>Farming Method</span>
                <div className="flex gap-2">
                  {(["hydroponic", "traditional", "aquaponics"] as const).map(
                    (method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() =>
                          handleInputChange("farmingMethod", method)
                        }
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${
                          formData.farmingMethod === method
                            ? "bg-[#85a446] text-white shadow-lg shadow-[#85a446]/20"
                            : "bg-[#141414] text-slate-400 hover:text-slate-200 hover:bg-white/[0.07]"
                        }`}
                      >
                        {method === "hydroponic"
                          ? "Hydroponic"
                          : method === "traditional"
                            ? "Traditional"
                            : "Aquaponics"}
                      </button>
                    ),
                  )}
                </div>
              </div>
              <div>
                <span className={labelCls + " mb-2 block"}>Support Type</span>
                <div className="flex gap-2">
                  {(["financial", "technical", "supply"] as const).map(
                    (type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleInputChange("supportType", type)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${
                          formData.supportType === type
                            ? "bg-[#85a446] text-white shadow-lg shadow-[#85a446]/20"
                            : "bg-[#141414] text-slate-400 hover:text-slate-200 hover:bg-white/[0.07]"
                        }`}
                      >
                        {type === "financial"
                          ? "Financial"
                          : type === "technical"
                            ? "Technical"
                            : "Supply Chain"}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="w-[320px] shrink-0 overflow-y-auto px-5 py-7 space-y-6">
          {/* Investor card */}
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
                    Investor
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] mt-0.5 flex items-center gap-1 truncate">
                  <EmailOutlined style={{ fontSize: 11 }} />{" "}
                  {user?.email || "—"}
                </p>
                <p className="text-slate-500 text-[11px] mt-0.5 flex items-center gap-1">
                  <PhoneOutlined style={{ fontSize: 11 }} />{" "}
                  {user?.phoneNumber || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Crop Icon */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-5 rounded-full bg-[#85a446]" />
              <span className="text-sm text-slate-200 font-bold uppercase tracking-wider">
                Crop Type &amp; Icon
              </span>
              {formData.cropIcon && (
                <span className="ml-auto text-xl leading-none">
                  {formData.cropIcon}
                </span>
              )}
            </div>
            <label className="block mb-3">
              <span className={labelCls}>Crop Name</span>
              <input
                className={errors.cropName ? inputErrCls : inputCls}
                type="text"
                placeholder="e.g. Basmati Rice"
                value={formData.cropName}
                onChange={(e) => handleInputChange("cropName", e.target.value)}
              />
              {errMsg("cropName")}
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {CROP_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className={`text-xl h-11 flex items-center justify-center rounded-lg transition-all ${
                    formData.cropIcon === emoji
                      ? "bg-[#85a446]/20 ring-2 ring-[#85a446] scale-105 shadow-lg shadow-[#85a446]/15"
                      : "bg-[#141414] hover:bg-[#85a446]/10"
                  }`}
                  onClick={() => handleInputChange("cropIcon", emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
            {errMsg("cropIcon")}
          </div>

          {/* Cover Image */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-1 h-4 rounded-full bg-[#85a446]" />
              <span className="text-xs text-slate-300 font-bold uppercase tracking-widest">
                Cover Image
              </span>
              <button className="ml-auto text-[#85a446] text-[10px] font-bold flex items-center gap-1 hover:opacity-80 transition-opacity">
                <Upload style={{ fontSize: 13 }} /> Upload
              </button>
            </div>

            {selectedCover && (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-2.5">
                <img
                  src={selectedCover.url}
                  alt={selectedCover.label}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    if (fallbackCoverUrl) target.src = fallbackCoverUrl;
                  }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <p className="absolute bottom-2 left-3 text-white text-xs font-semibold">
                  {selectedCover.label}
                </p>
                <div className="absolute top-2 right-2 bg-[#85a446] text-white px-1.5 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-0.5">
                  <Check style={{ fontSize: 10 }} /> Selected
                </div>
              </div>
            )}

            <div className="grid grid-cols-5 gap-1.5">
              {coverImageList.map((image) => (
                <div
                  key={image.id}
                  className={`relative rounded-lg overflow-hidden cursor-pointer aspect-square transition-all ${
                    formData.coverImage === image.id
                      ? "ring-2 ring-[#85a446] ring-offset-1 ring-offset-[#0a0a0a]"
                      : "opacity-60 hover:opacity-90"
                  }`}
                  onClick={() => handleInputChange("coverImage", image.id)}
                >
                  <img
                    src={image.url}
                    alt={image.label}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      if (fallbackCoverUrl) target.src = fallbackCoverUrl;
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            {errMsg("coverImage")}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div
        className="shrink-0 flex items-center justify-between gap-3 px-5 py-3.5"
        style={{ background: "#0a0a0a" }}
      >
        <AppButton
          variant="outline"
          size="md"
          onClick={() => onSaveDraft(formData)}
        >
          Save Draft
        </AppButton>
        <AppButton
          variant="primary"
          size="md"
          trailingIcon={<ArrowForward fontSize="inherit" />}
          onClick={handleSubmitClick}
        >
          {submitLabel}
        </AppButton>
      </div>
    </div>
  );
};

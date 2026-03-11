import { useAuth } from "@/Context/useAuth";
import coverImages from "@/data/json/coverImages.json";
import {
  ArrowBack,
  ArrowForward,
  Check,
  Close,
  EmailOutlined,
  GrassOutlined,
  KeyboardArrowDown,
  LocalShippingOutlined,
  PersonOutline,
  PhoneOutlined,
  Upload,
} from "@mui/icons-material";
import React, { useState } from "react";

interface DirectHarvestDetailsProps {
  onBack: () => void;
  onSubmit: (data: DirectHarvestFormData) => void;
  onSaveDraft: (data: DirectHarvestFormData) => void;
  initialData?: Partial<DirectHarvestFormData>;
}

export interface DirectHarvestFormData {
  investorName: string;
  projectTitle: string;
  description: string;
  companyName: string;
  preferredRegions: string[];
  cropType: string;
  coverImage: string;
  cropName: string;
  variety: string;
  quantity: number;
  unit: "Tons" | "Kilograms" | "Bushels";
  deliveryDetails: string;
  expiryDate: string;
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

export const DirectHarvestDetails: React.FC<DirectHarvestDetailsProps> = ({
  onBack,
  onSubmit,
  onSaveDraft,
  initialData,
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

  const [formData, setFormData] = useState<DirectHarvestFormData>({
    investorName: initialData?.investorName || fullName,
    projectTitle: initialData?.projectTitle || "",
    description: initialData?.description || "",
    companyName: initialData?.companyName || "",
    preferredRegions: initialData?.preferredRegions || [],
    cropType: initialData?.cropType || "",
    coverImage: initialData?.coverImage || "",
    cropName: initialData?.cropName || "",
    variety: initialData?.variety || "",
    quantity: initialData?.quantity || 0,
    unit: initialData?.unit || "Tons",
    deliveryDetails: initialData?.deliveryDetails || "",
    expiryDate: initialData?.expiryDate || "",
  });

  const [districtOpen, setDistrictOpen] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof DirectHarvestFormData, string>>
  >({});

  const handleInputChange = (
    field: keyof DirectHarvestFormData,
    value: unknown,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof DirectHarvestFormData, string>> = {};
    if (!formData.projectTitle.trim()) newErrors.projectTitle = "Required";
    if (!formData.description.trim()) newErrors.description = "Required";
    if (!formData.cropName.trim()) newErrors.cropName = "Required";
    if (!formData.cropType) newErrors.cropType = "Select a crop icon";
    if (!formData.coverImage) newErrors.coverImage = "Select a cover image";
    if (!formData.quantity || formData.quantity <= 0)
      newErrors.quantity = "Must be > 0";
    if (!formData.expiryDate) newErrors.expiryDate = "Required";
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
  const errMsg = (field: keyof DirectHarvestFormData) =>
    errors[field] ? (
      <span className="text-red-400 text-[10px] mt-0.5 block">
        {errors[field]}
      </span>
    ) : null;

  const selectedCover = coverImages.find((c) => c.id === formData.coverImage);

  return (
    <div
      className="font-['Manrope'] text-slate-100 rounded-2xl flex flex-col overflow-hidden"
      style={{ background: "#0a0a0a", width: 920, maxHeight: "92vh" }}
    >
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
            New Offer
          </p>
          <h2 className="text-white text-base font-bold leading-none">
            Direct Harvesting Offer
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
                <span className={labelCls}>Project Title</span>
                <input
                  className={errors.projectTitle ? inputErrCls : inputCls}
                  type="text"
                  placeholder="e.g. Paddy Harvest Q3 2026"
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
                  placeholder="Describe the offer, terms, and expectations..."
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                />
                {errMsg("description")}
              </label>
              <label className="block">
                <span className={labelCls}>Company / Trading Name</span>
                <input
                  className={inputCls}
                  type="text"
                  placeholder="e.g. AgroVerde Holdings"
                  value={formData.companyName}
                  onChange={(e) =>
                    handleInputChange("companyName", e.target.value)
                  }
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

          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-5 rounded-full bg-[#85a446]" />
              <span className="text-sm text-slate-200 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <GrassOutlined style={{ fontSize: 15 }} /> Harvest Requirements
              </span>
            </div>
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className={labelCls}>Crop Name</span>
                  <input
                    className={errors.cropName ? inputErrCls : inputCls}
                    type="text"
                    placeholder="e.g. Basmati Rice"
                    value={formData.cropName}
                    onChange={(e) =>
                      handleInputChange("cropName", e.target.value)
                    }
                  />
                  {errMsg("cropName")}
                </label>
                <label className="block">
                  <span className={labelCls}>Variety</span>
                  <input
                    className={inputCls}
                    type="text"
                    placeholder="e.g. Long grain"
                    value={formData.variety}
                    onChange={(e) =>
                      handleInputChange("variety", e.target.value)
                    }
                  />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className={labelCls}>Quantity</span>
                  <input
                    className={errors.quantity ? inputErrCls : inputCls}
                    type="number"
                    min={0}
                    value={formData.quantity}
                    onChange={(e) =>
                      handleInputChange(
                        "quantity",
                        parseInt(e.target.value) || 0,
                      )
                    }
                  />
                  {errMsg("quantity")}
                </label>
                <label className="block">
                  <span className={labelCls}>Unit</span>
                  <select
                    className={inputCls + " cursor-pointer [color-scheme:dark]"}
                    value={formData.unit}
                    onChange={(e) =>
                      handleInputChange(
                        "unit",
                        e.target.value as "Tons" | "Kilograms" | "Bushels",
                      )
                    }
                  >
                    <option value="Tons">Tons</option>
                    <option value="Kilograms">Kilograms</option>
                    <option value="Bushels">Bushels</option>
                  </select>
                </label>
              </div>
              <label className="block">
                <span className={labelCls + " flex items-center gap-1.5"}>
                  <LocalShippingOutlined style={{ fontSize: 13 }} /> Delivery
                  Details
                </span>
                <textarea
                  className={textareaCls}
                  rows={2}
                  placeholder="Delivery location, packaging, special handling notes..."
                  value={formData.deliveryDetails}
                  onChange={(e) =>
                    handleInputChange("deliveryDetails", e.target.value)
                  }
                />
              </label>
              <label className="block">
                <span className={labelCls}>Offer Expiry Date</span>
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
          </div>
        </div>

        <div className="w-[320px] shrink-0 overflow-y-auto px-5 py-7 space-y-6">
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

          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-5 rounded-full bg-[#85a446]" />
              <span className="text-sm text-slate-200 font-bold uppercase tracking-wider">
                Crop Icon
              </span>
              {formData.cropType && (
                <span className="ml-auto text-xl leading-none">
                  {formData.cropType}
                </span>
              )}
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {CROP_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className={`text-xl h-11 flex items-center justify-center rounded-lg transition-all ${
                    formData.cropType === emoji
                      ? "bg-[#85a446]/20 ring-2 ring-[#85a446] scale-105 shadow-lg shadow-[#85a446]/15"
                      : "bg-[#141414] hover:bg-[#85a446]/10"
                  }`}
                  onClick={() => handleInputChange("cropType", emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
            {errMsg("cropType")}
          </div>

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
                    (e.target as HTMLImageElement).src =
                      `https://picsum.photos/seed/${selectedCover.id}/600/340`;
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
              {coverImages.map((image) => (
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
                      (e.target as HTMLImageElement).src =
                        `https://picsum.photos/seed/${image.id}/200/200`;
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

      <div
        className="shrink-0 flex items-center justify-between gap-3 px-5 py-3.5"
        style={{ background: "#0a0a0a" }}
      >
        <button
          onClick={() => onSaveDraft(formData)}
          className="text-slate-500 text-sm font-semibold px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.07] hover:text-slate-300 transition-all"
        >
          Save Draft
        </button>
        <button
          onClick={handleSubmitClick}
          className="flex items-center gap-2 bg-[#85a446] hover:bg-[#93b34e] active:scale-[0.98] text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-[#85a446]/20"
        >
          Create Harvest Offer <ArrowForward style={{ fontSize: 18 }} />
        </button>
      </div>
    </div>
  );
};

interface FilterChipProps {
  icon: string;
  label: string;
  variant: "urgent" | "high-value" | "verified";
  onClick?: () => void;
}

const FilterChip = ({ icon, label, variant, onClick }: FilterChipProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "urgent":
        return "bg-red-100 dark:bg-red-900/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/20";
      case "high-value":
        return "bg-blue-100 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/20";
      case "verified":
        return "bg-[#85a446]/10 text-[#85a446] border-[#85a446]/30 hover:bg-[#85a446]/20";
      default:
        return "";
    }
  };

  return (
    <span
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center cursor-pointer transition-colors ${getVariantStyles()}`}
    >
      <span className="material-icons text-[14px] mr-1">{icon}</span> {label}
    </span>
  );
};

export default FilterChip;

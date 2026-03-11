import { ArrowBack, ChevronRight } from "@mui/icons-material";
import React from "react";

interface OfferTypeSelectionProps {
  onSelectType: (type: "DIRECT_HARVEST" | "SPONSORSHIP") => void;
  onBack: () => void;
}

export const OfferTypeSelection: React.FC<OfferTypeSelectionProps> = ({
  onSelectType,
  onBack,
}) => {
  return (
    <div className="bg-[#050505] font-['Manrope'] text-slate-100 antialiased flex flex-col w-[900px] max-h-[90vh] overflow-y-auto rounded-2xl">
      <header className="p-4 flex items-center justify-between sticky top-0 bg-[#050505] z-10 rounded-t-2xl">
        <button
          onClick={onBack}
          className="flex items-center justify-center size-10 rounded-full hover:bg-white/10 transition-colors"
        >
          <ArrowBack />
        </button>
        <h1 className="text-base font-bold text-center flex-1">
          Step 1: Offer Type Selection
        </h1>
        <div className="size-10"></div>
      </header>

      <div className="px-4 py-2">
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm font-medium text-slate-400">
            Onboarding Progress
          </span>
          <span className="text-sm font-bold text-[#85a446]">1 of 2</span>
        </div>
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#85a446] rounded-full shadow-[0_0_10px_rgba(133,164,70,0.5)]"
            style={{ width: "50%" }}
          ></div>
        </div>
      </div>

      <section className="px-4 pt-8 pb-6">
        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
          Choose your investment path
        </h2>
        <p className="text-slate-400 text-base">
          Select how you want to grow your capital through our agricultural
          projects.
        </p>
      </section>

      <main className="flex-1 px-4 grid grid-cols-2 gap-4">
        <div
          onClick={() => onSelectType("DIRECT_HARVEST")}
          className="relative group cursor-pointer flex flex-col h-full min-h-[280px] rounded-xl overflow-hidden border border-white/5 bg-[#1a1d15]/40 hover:border-[#85a446]/30 transition-all"
        >
          <div className="absolute inset-0 z-0 opacity-60">
            <img
              alt="Golden wheat field under sunshine"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-qCNSlEKFbeDeI1OLuWmLTAAouKOLLT0bkFcEdosjgMW8Iei_jVlkOVXFWjIqFvrTUbuMV6MXBH5euZEU3KoPI75y5RbEfPPav1lvSLihn7UrpPkQ9dQaAqojNpvN311FgQIz9olI46NuiQ9m2rjBbk8EqYbwXoMWlzTno_sp62oTujNFGF-F2BTWr1Cei7tJBl_2HC8wMlphhMK7BmFJkqplfm9H641SpNoEPSBigzr23oPrwoIXVl80mso2EwtENs-fV3Kw4TM"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent"></div>
          </div>
          <div className="relative z-10 p-4 h-full flex flex-col justify-between">
            <div>
              <span className="inline-block px-2 py-0.5 bg-[#85a446] text-[10px] font-bold uppercase tracking-wider text-black rounded mb-2">
                Most Popular
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight mb-2">
                Direct Harvesting Offer
              </h3>
              <p className="text-xs text-slate-300 mb-4 line-clamp-2">
                Purchase yields directly from established farm cycles.
              </p>
              <div className="flex items-center text-[#85a446] text-sm font-bold">
                Select Path <ChevronRight className="text-sm ml-1" />
              </div>
            </div>
          </div>
        </div>

        <div
          onClick={() => onSelectType("SPONSORSHIP")}
          className="relative group cursor-pointer flex flex-col h-full min-h-[280px] rounded-xl overflow-hidden border border-white/5 bg-[#1a1d15]/40 hover:border-[#85a446]/30 transition-all"
        >
          <div className="absolute inset-0 z-0 opacity-60">
            <img
              alt="Two farmers shaking hands in field"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgMccLyNAKEbbmyEJhHfQ1KJwij8Di4GY_zkGd38PlbCn3r8itTjEPMu1cSmxhFVHDQKqlpKjywK87OTiAvfO4osSQiDdR_bcIIX7MOTZb4lgtymisVirHKNQ2UW8mqqKPGgfM50VJqmleKzZkKF4csZsQpxkHLIXM2nQon9NzBcD6mPK5xLSl0br8EaNi_QRFVzQyYlSTQFLAYqMCV9xzmcRAEVMhgxR3nPcFs5zmbXybsnqDiYXlB5t9HqHLTLiGHO0ScvIchtw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent"></div>
          </div>
          <div className="relative z-10 p-4 h-full flex flex-col justify-end">
            <div>
              <h3 className="text-lg font-bold text-white leading-tight mb-2">
                Investment Offer
              </h3>
              <p className="text-xs text-slate-300 mb-4 line-clamp-2">
                Fund small-scale farmers and share in the seasonal profits.
              </p>
              <div className="flex items-center text-[#85a446] text-sm font-bold">
                Select Path <ChevronRight className="text-sm ml-1" />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="p-4 space-y-4 rounded-b-2xl bg-[#050505]">
        <button
          onClick={onBack}
          className="w-full py-2 text-slate-400 font-medium text-sm hover:text-white transition-colors"
        >
          Back to Dashboard
        </button>
      </footer>
    </div>
  );
};

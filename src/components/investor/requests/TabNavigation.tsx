interface Tab {
  label: string;
  badge?: number;
  active?: boolean;
  onClick: () => void;
}

interface TabNavigationProps {
  tabs: Tab[];
}


const TabNavigation = ({ tabs }: TabNavigationProps) => {
  return (
    <div className="flex p-1 border-zinc-800/30 rounded-xl border overflow-x-auto no-scrollbar max-w-full">
      {tabs.map((tab, index) => (
        <button
          key={index}
          onClick={tab.onClick}
          className={
            tab.active
              ? 'px-4 py-2 rounded-lg bg-primary/10 text-primary-dark dark:text-primary font-semibold text-sm whitespace-nowrap shadow-sm dark:shadow-none border-primary/20 transition-all'
              : 'px-4 py-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-zinc-800 font-medium text-sm whitespace-nowrap transition-colors ml-1'
          }
        >
          {tab.label}
          {tab.badge !== undefined && (
            <span className="ml-2 bg-primary/10 dark:bg-primary text-primary-dark dark:text-black text-xs font-bold px-1.5 py-0.5 rounded-full">
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;

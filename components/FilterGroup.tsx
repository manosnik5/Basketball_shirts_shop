"use client";


type GroupKey = "brand" | "league" | "team" | "size" | "price";

interface FilterGroupProps {
    title: string;
    k: GroupKey;
    expanded: boolean;
    setExpanded: React.Dispatch<React.SetStateAction<Record<GroupKey, boolean>>>;
    children: React.ReactNode;
}

const FilterGroup = ({ title, k, expanded, setExpanded, children }: FilterGroupProps) => {
  return (
    <div className=" py-4">
      <button
        className="flex w-full items-center justify-between text-body-medium text-text-dark cursor-pointer"
        onClick={() => setExpanded((s) => ({ ...s, [k]: !s[k] }))}
        aria-expanded={expanded}
        aria-controls={`${k}-section`}
      >
        <span>{title}</span>
        <span className="text-caption text-dark-700">{expanded ? "−" : "+"}</span>
      </button>

      <div id={`${k}-section`} className={`${expanded ? "mt-3 block" : "hidden"}`}>
        {children}
      </div>
    </div>
  );
}

export default FilterGroup
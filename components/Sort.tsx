"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useMemo } from "react";
import { setParam } from "@/lib/utils/query";
import { OPTIONS } from "@/lib/constants";

const Sort = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = useMemo(() => `?${searchParams.toString()}`, [searchParams]);
  const selected = searchParams.get("sort") ?? "newest";

  const onChange = (value: string) => {
    const withSort = setParam(pathname, search, "sort", value);
    const withPageReset = setParam(pathname, new URL(withSort, "http://dummy").search, "page", "1");
    router.push(withPageReset, { scroll: false });
  };
  
  return (
    <label className="inline-flex items-center gap-2">
      <span className="text-body text-dark-900 hidden sm:flex">Sort by</span>
      <select
        className="rounded-md border border-light-300 bg-light-100 py-1 sm:px-3 sm:py-2 text-body cursor-pointer"
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Sort products"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}

export default Sort
import qs from "query-string";

type QueryValue = string | number | boolean | null | undefined | string[] | number[] | boolean[];
type QueryObject = Record<string, QueryValue>;

export function parseQuery(search: string | URLSearchParams): QueryObject {
  // Convert URLSearchParams → string if needed
  const searchStr =
    typeof search === "string" ? search : `?${search.toString()}`;

  return qs.parse(searchStr, { arrayFormat: "none" }) as QueryObject;
}

/**
 * Converts an object into a query string (without array brackets []),
 * skipping null/empty values.
 */
export function stringifyQuery(query: Record<string, QueryValue>): string {
  return qs.stringify(query, {
    skipNull: true,
    skipEmptyString: true,
    arrayFormat: "none",
  });
}

/**
 * Updates query parameters safely while keeping existing ones.
 * Works for both string and URLSearchParams inputs.
 */
export function withUpdatedParams(
  pathname: string,
  currentSearch: string | URLSearchParams,
  updates: QueryObject
): string {
  const current = parseQuery(currentSearch);
  const next: QueryObject = { ...current };

  Object.entries(updates).forEach(([key, value]) => {
    if (
      value === undefined ||
      value === null ||
      (Array.isArray(value) && value.length === 0)
    ) {
      delete next[key];
    } else {
      next[key] = value;
    }
  });

  const search = stringifyQuery(next);
  return search ? `${pathname}?${search}` : pathname;
}

export function toggleArrayParam(
  pathname: string,
  currentSearch: string,
  key: string,
  value: string
): string {
  const current = parseQuery(currentSearch);
  const arr = new Set<string>(Array.isArray(current[key]) ? (current[key] as string[]) : current[key] ? [String(current[key])] : []);
  if (arr.has(value)) {
    arr.delete(value);
  } else {
    arr.add(value);
  }
  const nextValues = Array.from(arr);
  const updates: QueryObject = { [key]: nextValues.length ? nextValues : undefined };
  return withUpdatedParams(pathname, currentSearch, updates);
}

export function setParam(
  pathname: string,
  currentSearch: string,
  key: string,
  value: string | number | null | undefined
): string {
  return withUpdatedParams(pathname, currentSearch, { [key]: value === null || value === undefined ? undefined : String(value) });
}

export function removeParams(pathname: string, currentSearch: string, keys: string[]): string {
  const current = parseQuery(currentSearch);
  keys.forEach((k) => delete current[k]);
  const search = stringifyQuery(current);
  return search ? `${pathname}?${search}` : pathname;
}

export function getArrayParam(search: string, key: string): string[] {
  const q = parseQuery(search);
  const v = q[key];
  if (Array.isArray(v)) return v.map(String);
  if (v === undefined) return [];
  return [String(v)];
}

export function getStringParam(search: string, key: string): string | undefined {
  const q = parseQuery(search);
  const v = q[key];
  if (v === undefined) return undefined;
  return Array.isArray(v) ? (v[0] ? String(v[0]) : undefined) : String(v);
}


export type NormalizedShirtFilters = {
  search?: string;
  sizeSlugs: string[];
  brandSlugs: string[];
  leagueSlugs: string[];
  teamSlugs: string[];
  priceMin?: number;
  priceMax?: number;
  priceRanges: Array<[number | undefined, number | undefined]>;
  sort: "featured" | "newest" | "price_asc" | "price_desc";
  page: number;
  limit: number;
};

export function parseFilterParams(
  sp: Record<string, string | string[] | undefined>
): NormalizedShirtFilters {
  const getArr = (k: string) => {
    const v1 = sp[k];
    const v2 = sp[`${k}[]`];
    const arr1 = Array.isArray(v1) ? v1.map(String) : v1 === undefined ? [] : [String(v1)];
    const arr2 = Array.isArray(v2) ? (v2 as string[]).map(String) : v2 === undefined ? [] : [String(v2 as string)];
    return [...arr1, ...arr2];
  };

  const getStr = (k: string) => {
    const v = sp[k] ?? sp[`${k}[]`];
    if (v === undefined) return undefined;
    return Array.isArray(v) ? (v[0] ? String(v[0]) : undefined) : String(v);
  };

  const search = getStr("search")?.trim() || undefined;

  const sizeSlugs = getArr("size").map((s) => s.toLowerCase());
  const brandSlugs = getArr("brand").map((b) => b.toLowerCase());
  const leagueSlugs = getArr("league").map((l) => l.toLowerCase());
  const teamSlugs = getArr("team").map((t) => t.toLowerCase());

  const priceRangesStr = getArr("price");
  const priceRanges: Array<[number | undefined, number | undefined]> = priceRangesStr
    .map((r) => {
      const [minStr, maxStr] = String(r).split("-");
      const min = minStr ? Number(minStr) : undefined;
      const max = maxStr ? Number(maxStr) : undefined;
      return [
        Number.isNaN(min as number) ? undefined : min,
        Number.isNaN(max as number) ? undefined : max,
      ] as [number | undefined, number | undefined];
    })
    .filter(() => true);

  const priceMin = getStr("priceMin") ? Number(getStr("priceMin")) : undefined;
  const priceMax = getStr("priceMax") ? Number(getStr("priceMax")) : undefined;

  const sortParam = getStr("sort");
  const sort: NormalizedShirtFilters["sort"] =
    sortParam === "price_asc" || sortParam === "price_desc" || sortParam === "newest" || sortParam === "featured"
      ? sortParam
      : "newest";

  const page = Math.max(1, Number(getStr("page") ?? 1) || 1);
  const limitRaw = Number(getStr("limit") ?? 24) || 24;
  const limit = Math.max(1, Math.min(limitRaw, 60));

  return {
    search,
    sizeSlugs,
    brandSlugs,
    leagueSlugs,
    teamSlugs,
    priceMin: priceMin !== undefined && !Number.isNaN(priceMin) ? priceMin : undefined,
    priceMax: priceMax !== undefined && !Number.isNaN(priceMax) ? priceMax : undefined,
    priceRanges,
    sort,
    page,
    limit,
  };
}


export function buildProductQueryObject(filters: NormalizedShirtFilters) {
  return filters;
}
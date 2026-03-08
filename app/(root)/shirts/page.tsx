import Sort from "@/components/Sort";
import { auth } from '@/lib/auth';
import Filters from "@/components/Filters";
import { parseFilterParams } from "@/lib/utils/query";
import { getAllShirts } from "@/lib/actions/shirt";
import Image from "next/image";
import ShirtCard from "@/components/ShirtCard";
import Link from 'next/link';
import { headers } from 'next/headers';
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import SearchInput from "@/components/SearchInput";

type SearchParams = Record<string, string | string[] | undefined>;

const page = async ({searchParams}: {
  searchParams: Promise<SearchParams>;
}) => {
  
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const isAdmin = session?.user?.role === 'ADMIN';

    const sp = await searchParams;
    const parsed = parseFilterParams(sp);
    const currentPage = Number(sp.page ?? 1);
    const pageSize = Number(sp.pageSize ?? 6);

    const { shirts, totalCount } = await getAllShirts({
      ...parsed,
      search: typeof sp.search === 'string' ? sp.search : undefined,
      limit: pageSize,
      page: currentPage,  
    });

    const activeBadges: string[] = [];

    (sp.league ? (Array.isArray(sp.league) ? sp.league : [sp.league]) : []).forEach((l) =>
        activeBadges.push(String(l)[0].toUpperCase() + String(l).slice(1))
    );
    (sp.brand ? (Array.isArray(sp.brand) ? sp.brand : [sp.brand]) : []).forEach((b) =>
        activeBadges.push(String(b)[0].toUpperCase() + String(b).slice(1))
    );
    (sp.size ? (Array.isArray(sp.size) ? sp.size : [sp.size]) : []).forEach((s) => activeBadges.push(`Size: ${s}`));
    (sp.team ? (Array.isArray(sp.team) ? sp.team : [sp.team]) : []).forEach((t) =>
        activeBadges.push(String(t)[0].toUpperCase() + String(t).slice(1))
    );
    (sp.price ? (Array.isArray(sp.price) ? sp.price : [sp.price]) : []).forEach((p) => {
        const [min, max] = String(p).split("-");
        const label = min && max ? `$${min} - $${max}` : min && !max ? `Over $${min}` : `$0 - $${max}`;
        activeBadges.push(label);
    });
  return (
    <div className='mx-auto container pt-20 lg:pt-30 pb-12 px-4 sm:px-6 lg:px-8 min-h-screen'>
         <header className="flex items-center justify-between py-6">
           {isAdmin && (
          <Link 
            href="/admin/jerseys"
            className="inline-flex items-center gap-1.5 sm:gap-2  sm:px-4 py-1.5 sm:py-2 bg-white text-text-dark rounded-lg transition-colors text-xs sm:text-sm font-medium border border-black"
          >       
            <Image src="/add.png" alt="NextRide" width={20} height={20} priority className="sm:w-[27px] sm:h-[27px]" />         
            Add Jerseys
          </Link>
          )}
          <div className="">
             <SearchInput/>
          </div>
        
        <Sort />
      </header>

      {activeBadges.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {activeBadges.map((b, i) => (
            <span
              key={`${b}-${i}`}
              className="rounded-full border border-light-300 px-3 py-1 text-caption text-dark-900"
            >
              {b}
            </span>
          ))}
        </div>
      )}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr] ">
        <Filters />
        <div>
  {shirts.length === 0 ? (
    <div className="rounded-lg border border-light-300 p-8 text-center">
      <p className="text-body text-dark-700">No products match your filters.</p>
    </div>
  ) : (
    <>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 pb-6">
          {shirts.map((shirt) => (
            <ShirtCard key={shirt.id} shirt={shirt} isAdmin={isAdmin}/>
          ))}
        </div>

        <div className="flex justify-center pt-6">
          <PaginationWithLinks
            page={currentPage}
            pageSize={pageSize}
            totalCount={totalCount}
          />
        </div>
      </>
  )}
</div>

      </section>
    </div>
  )
}

export default page
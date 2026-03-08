"use client"

import { useState } from "react"
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { sanitizeSearchQuery, validateSearchQuery } from "@/lib/validation";

const SearchInput = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const initialSearch = searchParams.get('search') || '';
    const [inputValue, setInputValue] = useState(sanitizeSearchQuery(initialSearch));
    const [error, setError] = useState<string>("");

    const handleSearchCard = () => {
        const trimmedValue = inputValue.trim();

        if (!trimmedValue) {
            const params = new URLSearchParams(searchParams.toString());
            params.delete('search');
            params.delete('page');
            router.push(`?${params.toString()}`);
            return;
        }

        const sanitizedSearch = sanitizeSearchQuery(trimmedValue);

        if (!validateSearchQuery(sanitizedSearch)) {
            setError("Search contains invalid characters or is too long");
            return;
        }

        setError("");

        const params = new URLSearchParams(searchParams.toString());
        params.set('search', sanitizedSearch); 
        params.set('page', '1');
        
        router.push(`?${params.toString()}`);
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearchCard();
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        if (error) setError("");
    }
 
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="flex flex-row items-center justify-center">
                <input 
                    className={`text-text-dark h-9 w-[20vw] bg-light-light px-4 border border-black rounded-l-3xl outline-none text-sm ${error ? 'border-red-500 ring-2 ring-red-500' : ''}`}
                    type="text" 
                    placeholder="Search" 
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    maxLength={100}
                    autoComplete="off"
                />
                <button 
                    className="flex h-9 w-15 border border-l-0 border-black bg-light rounded-r-3xl cursor-pointer items-center justify-center hover:bg-light-100 transition" 
                    onClick={handleSearchCard}
                    aria-label="Search"
                >
                    <Image src="/search.png" alt="Search" width={22} height={22} priority />  
                </button>
            </div>
            {error && (
                <p className="text-sm text-red-500 mt-1 text-center">{error}</p>
            )}
        </div>
    )
}

export default SearchInput
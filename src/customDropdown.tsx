import { useState, useEffect, useRef } from "react";

interface Option {
    value: string;
    label: string;
}

export interface CustomDropdownProps {
    label: string;
    options: Option[];
    selected: string;
    onChange: (value: string) => void;
    wrapperClassName?: string;
    buttonClassName?: string;
    dropdownClassName?: string;
    optionClassName?: string;
}

export default function CustomDropdown({ label, options, selected, onChange, wrapperClassName = "", buttonClassName = "", dropdownClassName = "", optionClassName = "" }: CustomDropdownProps) {

    const [isOpen, setIsOpen] = useState(false);
    const [hoveredOption, setHoveredOption] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const searchTimeout = useRef<number | null>(null);

    const selectedIndex = options.findIndex(option => option.value === selected);
    let newIndex = selectedIndex;
    
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (isOpen && listRef.current) {
            const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
            if (selectedElement) {
                selectedElement.scrollIntoView({ block: "center" });
            }
        }
    }, [selected, isOpen, options, selectedIndex]);

    const handleButtonClick = (e: React.MouseEvent) => {
        e.preventDefault(); 
        setIsOpen((prev) => !prev);
    };
    
    const handleSelect = (value: string) => {
        if (value !== selected) {
            onChange(value);
        }
        setHoveredOption(null);
        setIsOpen(false);
        buttonRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            setIsOpen(false);
            return;
        }

        if (e.key === "Tab") {
            setIsOpen(false);
            return;
        }
           
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            newIndex = e.key === "ArrowDown" ? (selectedIndex + 1) % options.length : (selectedIndex - 1 + options.length) % options.length; 
            setHoveredOption(options[newIndex].value);
            onChange(options[newIndex].value);
        }
    
        if (e.key === "Enter") {
            e.preventDefault();
            setIsOpen((prev) => !prev);
        }

        if (/^[a-zA-Z0-9]$/.test(e.key)) {
            const newQuery = searchQuery + e.key.toLowerCase();
            setSearchQuery(newQuery);

            const match = options.find(opt => opt.label.toLowerCase().startsWith(newQuery));

            if (match) onChange(match.value);

            if (searchTimeout.current) clearTimeout(searchTimeout.current);

            searchTimeout.current = window.setTimeout(() => setSearchQuery(""), 1000);
        }
    };

    return (
        <div role="combobox" ref={dropdownRef} className={`relative w-[260px] ${wrapperClassName}`}>
            <label id={label}>{label}</label>
            <button
                aria-labelledby={label}
                aria-controls="dropdown-list"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-activedescendant={`option-${options[newIndex]?.value}`}
                ref={buttonRef}
                onKeyDown={handleKeyDown}
                onClick={handleButtonClick}
                className={`flex justify-between items-center w-full py-2 px-4 mt-2 border border-gray-400 bg-gray-100 rounded cursor-pointer font-sans hover:bg-gray-200 ${buttonClassName}`}  
            >
                <span className="truncate">{options[selectedIndex]?.label || options[0]?.label}</span>
                <span className="text-sm">⏷</span>
            </button>

            {isOpen && (
                <div
                    role="listbox"
                    id="dropdown-list"
                    className={`absolute w-full max-h-48 bg-white border border-gray-400 rounded shadow-lg ${dropdownClassName}`}                  
                    style={{
                        scrollbarWidth: "none",
                        WebkitOverflowScrolling: "touch",
                        overflowY: "scroll",
                    }}
                >
                    <ul ref={listRef} >
                        {options.map((option) => (
                            <li
                                aria-selected={selected === option.value}
                                role="option"
                                id={`option-${option.value}`}
                                key={option.value}
                                onMouseEnter={() => setHoveredOption(option.value)}
                                onMouseLeave={() => setHoveredOption(null)}
                                onClick={() => handleSelect(option.value)}
                                className={`px-4 mt-0.5 font-sans cursor-pointer ${selected === option.value ? 'bg-blue-500 text-white' : ''} ${hoveredOption === option.value ? 'bg-blue-100' : ''} ${optionClassName}`}                                  
                            >
                                {option.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
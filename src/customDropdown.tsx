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
        setIsOpen(false);
        buttonRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            setIsOpen(false);
            return;
        }  

        if (e.key === "ArrowDown") {
            newIndex = (selectedIndex + 1) % options.length;
        } else if (e.key === "ArrowUp") {
            newIndex = (selectedIndex - 1 + options.length) % options.length;
        }

        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            onChange(options[newIndex].value);
        }
    
        if (e.key === "Enter") {
            e.preventDefault();
            setIsOpen((prev) => !prev);
        }
    };

    return (
        <div className={`relative w-[260px] ${wrapperClassName}`} ref={dropdownRef} role="combobox" aria-haspopup="listbox" aria-expanded={isOpen} aria-labelledby={label}>
            <label id={label}>{label}</label>
            <button
                ref={buttonRef}
                onClick={handleButtonClick}
                onKeyDown={handleKeyDown}
                className={`w-full border border-gray-400 bg-gray-100 hover:bg-gray-200 rounded mt-2 py-2 px-4 font-sans cursor-pointer flex justify-between items-center ${buttonClassName}`}
                aria-labelledby={label}
                aria-controls="dropdown-list"
                aria-activedescendant={`option-${options[newIndex]?.value}`}
            >
                <span className="truncate">{options[selectedIndex]?.label || options[0]?.label}</span>
                <span className="text-sm">⏷</span>
            </button>

            {isOpen && (
                <div
                    id="dropdown-list"
                    role="listbox"
                    aria-labelledby={label}
                    className={`absolute w-full bg-white border border-gray-400 rounded shadow-lg max-h-48 ${dropdownClassName}`}
                    style={{
                        scrollbarWidth: "none",
                        WebkitOverflowScrolling: "touch",
                        overflowY: "scroll",
                    }}
                >
                    <ul ref={listRef} aria-labelledby={label}>
                        {options.map((option) => (
                            <li
                                key={option.value}
                                role="option"
                                id={`option-${option.value}`}
                                aria-selected={selected === option.value}
                                onClick={() => handleSelect(option.value)}
                                className={`px-4 cursor-pointer font-sans mt-0.5 ${selected === option.value ? 'bg-blue-500 text-white' : ''} ${hoveredOption === option.value ? 'bg-blue-100' : ''} ${optionClassName}`}
                                onMouseEnter={() => setHoveredOption(option.value)}
                                onMouseLeave={() => setHoveredOption(null)}
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
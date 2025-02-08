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

export default function CustomDropdown({ label, options, selected, onChange, wrapperClassName = "", buttonClassName = "", dropdownClassName = "", optionClassName = ""}: CustomDropdownProps) {

    const [isOpen, setIsOpen] = useState(false);
    const [hoveredOption, setHoveredOption] = useState<string | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number>(options.findIndex(option => option.value === selected));
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

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

    const handleSelect = (value: string) => {
        const newIndex = options.findIndex(option => option.value === value);
        setSelectedIndex(newIndex);
        onChange(value);
        setIsOpen(false);
        buttonRef.current?.focus()
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            setIsOpen(false);
            return;
        }
    
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
    
            setSelectedIndex((prevIndex) => {
                const newIndex = e.key === "ArrowDown"
                    ? Math.min(prevIndex + 1, options.length - 1)
                    : Math.max(prevIndex - 1, 0);
    
                onChange(options[newIndex].value);
    
                return newIndex;
            });
        }
    
        if (e.key === "Enter") {
            e.preventDefault();
            setIsOpen((prev) => !prev);
        }
    };    

    useEffect(() => {
        if (isOpen && listRef.current) {
            const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
            if (selectedElement) {
                selectedElement.scrollIntoView({ block: "center" });
            }
        }
    }, [selectedIndex, isOpen]);

    const handleMouseEnter = (value: string) => {
        setHoveredOption(value);
    };

    const handleMouseLeave = () => {
        setHoveredOption(null);
    };

    return (
        <div className={`relative w-[260px] ${wrapperClassName}`} ref={dropdownRef} role="combobox" aria-haspopup="listbox" aria-expanded={isOpen} aria-labelledby={label}>
            <label id={label}>{label}</label>
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                onKeyDown={handleKeyDown}
                className={`w-full border border-gray-400 bg-gray-100 hover:bg-gray-200 rounded mt-2 py-2 px-4 font-sans cursor-pointer flex justify-between items-center overflow-hidden text-ellipsis whitespace-nowrap ${buttonClassName}`}
                aria-labelledby={label}
                aria-controls="dropdown-list"
                aria-activedescendant={`option-${options[selectedIndex]?.value}`}
            >
                <span className="truncate">{options.find(option => option.value === selected)?.label || options[0]?.label}</span>
                <span className="text-sm">⏷</span>
            </button>

            {isOpen && (
                <div
                    id="dropdown-list"
                    role="listbox"
                    aria-labelledby={label}
                    className={`absolute w-full bg-white border border-gray-400 rounded shadow-lg max-h-48 overflow-y-auto ${dropdownClassName}`}
                    style={{
                        scrollbarWidth: "none",
                        WebkitOverflowScrolling: "touch",
                        overflowY: "scroll",
                    }}
                >
                    <ul ref={listRef}>
                        {options.map((option, index) => (
                            <li
                                key={option.value}
                                role="option"
                                id={`option-${option.value}`}
                                aria-selected={selected === option.value}
                                onClick={() => handleSelect(option.value)}
                                onMouseEnter={() => handleMouseEnter(option.value)}
                                onMouseLeave={handleMouseLeave}
                                tabIndex={-1}
                                className={`px-4 cursor-pointer font-sans ${selected === option.value ? 'bg-blue-500 text-white' : ''} ${hoveredOption === option.value ? 'bg-blue-100' : ''} ${index === selectedIndex ? 'bg-blue-100' : ''} ${optionClassName}`}
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
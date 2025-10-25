"use client"
import { useState } from "react"
import Image from "next/image"

const DropdownList = () => {
    const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="relative">
        <div className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
<div className="filter-trigger">
    <figure>
        <Image src="/assets/icons/hamburger.svg" alt="menu" width={14} height={14}/> 
        Most Recent
    </figure>
    <Image src="/assets/icons/arrow-down.svg" alt="arrow" width={20} height={20}/>
</div>
        </div>
        {isOpen && (
            <div className="dropdown">
                <ul>
{['Most Viewed', 'Most Recent', 'Oldest First', 'Least Viewed'].map((option, index) => (
                    <li key={index} className="dropdown-item">
                        <div className="flex items-center gap-2">
                            <Image src="/assets/icons/eye.svg" alt="eye" width={16} height={16}/>
                            {option}
                        </div>
                    </li>
                )
)}
                </ul>
            </div>
        )}
    </div>
  )
}

export default DropdownList
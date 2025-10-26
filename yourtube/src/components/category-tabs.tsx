import React, { useState } from 'react'
import { Button } from '@/components/ui/button';
const categories = [
    "All",
    "Music",
    "Gaming",
    "Movies",
    "News",
    "Sports",
    "Technology",
    "Comedy",
    "Education",
    "Science",
    "Travel",
    "Food",
    "Fashion",
];
export default function CategoryTabs() {
    const [activeCategory, setActiveCategory] = useState("All");
    return (
        <div className='flex gap-2 mb-6 overflow-x-auto pb-2 bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300'>
            {categories.map((category) => (
                <Button
                    key={category}
                    variant={activeCategory === category ? "default" : "secondary"}
                    className="whitespace-nowrap"
                    onClick={() => setActiveCategory(category)}
                >
                    {category}
                </Button>
            ))}
        </div>
    );
}
import HistoryContent from '@/components/HistoryContent';
import React, { Suspense, useEffect, useState } from 'react'

const index = () => {
    return (
        <main className='flex-1 p-6 bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300'>
            <div className='max-w-4xl'>
                <h1 className='text-2xl font-bold mb-6'>Watch History</h1>
                <Suspense fallback={<div>Loading...</div>}>
                    <HistoryContent />
                </Suspense>
            </div>
        </main>
    );
};

export default index;
import React, { useEffect, useState } from 'react';
import { useFirebase } from '../context/Firebase';

function View() {
    const { fetchUserPDFs } = useFirebase();
    const [pdfs, setPDFs] = useState([]);

    useEffect(() => {
        const loadPDFs = async () => {
            try {
                const pdfList = await fetchUserPDFs();
                setPDFs(pdfList);
            } catch (error) {
                console.error("Failed to load PDFs:", error);
            }
        };

        loadPDFs();
    }, [fetchUserPDFs]);

    return (
        <div className="min-h-screen bg-white flex flex-col items-center pt-16">
            <h2 className="text-2xl font-bold mb-6 text-center">Your Stored PDFs</h2>
            <div className="w-full max-w-2xl space-y-4">
                {pdfs.length > 0 ? (
                    pdfs.map((pdf, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow-lg flex justify-between items-center">
                            <p className="text-sm text-gray-700">PDF created at: {new Date(pdf.createdAt.seconds * 1000).toLocaleString()}</p>
                            <a href={pdf.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                View PDF
                            </a>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-700">No PDFs found for this user.</p>
                )}
            </div>
        </div>
    );
}

export default View;

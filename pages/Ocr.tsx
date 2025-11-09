import React, { useState, useCallback } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { useData } from '../context/DataContext';
import { Trip } from '../types';
import { fileToBase64 } from '../utils/image';
import Dropzone from '../components/Dropzone';

const tripSchema = {
    type: Type.OBJECT,
    properties: {
        driverNumber: { type: Type.STRING, description: "Driver's phone number, might be in the second column." },
        date: { type: Type.STRING, description: "Trip date in YYYY-MM-DD format. Example: 13-Jul-25 becomes 2025-07-13." },
        vehicleNumber: { type: Type.STRING },
        vehicleSize: { type: Type.STRING },
        weight: { type: Type.NUMBER, description: "Weight in tons. If a range is given (e.g., 20-25), use the first number." },
        freight: { type: Type.NUMBER, description: "From 'کرایہ بلٹی' column." },
        officeFare: { type: Type.NUMBER, description: "From 'دفتر کرایہ' column." },
        vehicleReceivedBilty: { type: Type.NUMBER, description: "From 'گاڑی وصول بلٹ' column." },
        vehicleFare: { type: Type.NUMBER, description: "From 'گاڑی کرایہ' column." },
        laborCharges: { type: Type.NUMBER, description: "From 'مزدوری' column. Default to 0 if empty." },
        exciseCharges: { type: Type.NUMBER, description: "From 'ایکسائز' column. Default to 0 if empty." },
        bonus: { type: Type.NUMBER, description: "From 'انعام' column. Default to 0 if empty." },
        miscExpenses: { type: Type.NUMBER, description: "From 'دیگر' column (the one after bonus). Default to 0 if empty." },
        dailyWages: { type: Type.NUMBER, description: "From 'دیہاڑی' column. Default to 0 if empty." },
        extraWeight: { type: Type.NUMBER, description: "From 'فالتو وزن' column. Default to 0 if empty." },
        partyBalance: { type: Type.NUMBER, description: "From 'پارٹی بیلنس' column." },
        partyReceived: { type: Type.NUMBER, description: "From 'پارٹی وصول' column." },
        brokerageCommission: { type: Type.NUMBER, description: "From 'بروکری + نشانہ' column." },
        vehicleBalance: { type: Type.NUMBER, description: "From 'گاڑی بیلنس' column." },
        vehicleAccount: { type: Type.STRING, description: "From 'گاڑی حساب' column." },
        additionalDetails: { type: Type.STRING, description: "From 'دیگرتفصیل' column." },
        station: { type: Type.STRING, description: "From 'اسٹیشن' column." },
        brokerName: { type: Type.STRING, description: "From 'اڈا بروکر' column." },
        partyName: { type: Type.STRING, description: "From 'پارٹی نام' column." },
        mt: { type: Type.NUMBER, description: "From 'MT' column. Default to 0 if empty." }
    }
};

const responseSchema = {
    type: Type.ARRAY,
    items: tripSchema
};

const Ocr: React.FC = () => {
    const { addTrip } = useData();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [extractedTrips, setExtractedTrips] = useState<Omit<Trip, 'id' | 'serialNumber'>[]>([]);
    const [addedTrips, setAddedTrips] = useState<Set<number>>(new Set());

    const handleFileAccepted = useCallback((file: File) => {
        if (file && file.type.startsWith('image/')) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            setError(null);
            setExtractedTrips([]);
        } else {
            setError('Please upload a valid image file.');
        }
    }, []);

    const handleProcessImage = async () => {
        if (!imageFile) {
            setError('Please select an image file first.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setExtractedTrips([]);
        setAddedTrips(new Set());

        try {
            const base64Image = await fileToBase64(imageFile);
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            const imagePart = {
                inlineData: {
                    mimeType: imageFile.type,
                    data: base64Image,
                },
            };

            const prompt = `You are an expert data entry specialist for a logistics company. Analyze the provided image of a ledger. Extract all the data from the table, row by row. Ignore the header row and any empty rows at the bottom. The language in the image is Urdu/Persian. Map the columns to the specified English keys in the JSON schema. For any empty cells in the image, use 0 for numbers and an empty string for text. Parse dates like '13-Jul-25' into '2025-07-13'. The 'weight' column might contain a range like '20-25'; in that case, use the first number (20). Ensure the output is a valid JSON array matching the provided schema.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: { parts: [imagePart, { text: prompt }] },
                config: {
                    responseMimeType: "application/json",
                    responseSchema: responseSchema,
                },
            });

            const jsonStr = response.text.trim();
            const parsedJson = JSON.parse(jsonStr);
            setExtractedTrips(Array.isArray(parsedJson) ? parsedJson : []);

        } catch (e) {
            console.error(e);
            setError('Failed to process image. The AI could not extract data. Please use a clearer image and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddTrip = (trip: Omit<Trip, 'id' | 'serialNumber'>, index: number) => {
        addTrip(trip);
        setAddedTrips(prev => new Set(prev).add(index));
    };

    return (
        <div className="space-y-6">
            <div className="bg-card p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold mb-4">Upload Ledger Image</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div>
                        <Dropzone onFileAccepted={handleFileAccepted} />
                         {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                    </div>
                    <div>
                        {imagePreview && (
                            <div className="border rounded-lg p-2">
                                <h3 className="text-sm font-medium mb-2 text-center">Image Preview</h3>
                                <img src={imagePreview} alt="Ledger preview" className="max-h-64 w-full object-contain rounded"/>
                            </div>
                        )}
                    </div>
                </div>
                <div className="mt-6 text-center">
                    <button
                        onClick={handleProcessImage}
                        disabled={!imageFile || isLoading}
                        className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                    >
                        {isLoading && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                        {isLoading ? 'Processing...' : 'Extract Data from Image'}
                    </button>
                </div>
            </div>

            {extractedTrips.length > 0 && (
                <div className="bg-card p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Extracted Trip Data</h2>
                    <p className="text-sm text-text-secondary mb-4">Review the data extracted from the image. Click 'Add Trip' to import a record into the system.</p>
                     
                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {extractedTrips.map((trip, index) => (
                            <div key={index} className="bg-white border rounded-lg p-4 shadow-sm">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-gray-800">{trip.vehicleNumber}</p>
                                        <p className="text-sm text-gray-500">{trip.date}</p>
                                    </div>
                                    <button
                                        onClick={() => handleAddTrip(trip, index)}
                                        disabled={addedTrips.has(index)}
                                        className="bg-green-600 text-white text-xs font-bold py-1 px-3 rounded-md hover:bg-green-700 transition duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    >
                                        {addedTrips.has(index) ? 'Added' : 'Add Trip'}
                                    </button>
                                </div>
                                <div className="mt-3 border-t pt-3 space-y-1 text-sm">
                                    <p><span className="font-semibold text-gray-700">Party:</span> {trip.partyName}</p>
                                    <p><span className="font-semibold text-gray-700">Broker:</span> {trip.brokerName}</p>
                                    <p><span className="font-semibold text-gray-700">Fare:</span> <span className="font-bold">PKR {trip.freight?.toLocaleString() || 0}</span></p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className="overflow-x-auto hidden md:block">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 whitespace-nowrap">Date</th>
                                    <th className="px-4 py-3 whitespace-nowrap">Vehicle No.</th>
                                    <th className="px-4 py-3 whitespace-nowrap">Party</th>
                                    <th className="px-4 py-3 whitespace-nowrap">Broker</th>
                                    <th className="px-4 py-3 whitespace-nowrap">Fare</th>
                                    <th className="px-4 py-3 whitespace-nowrap">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {extractedTrips.map((trip, index) => (
                                    <tr key={index} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-4 py-3 whitespace-nowrap">{trip.date}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">{trip.vehicleNumber}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">{trip.partyName}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">{trip.brokerName}</td>
                                        <td className="px-4 py-3 font-semibold whitespace-nowrap">PKR {trip.freight?.toLocaleString() || 0}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <button
                                                onClick={() => handleAddTrip(trip, index)}
                                                disabled={addedTrips.has(index)}
                                                className="bg-green-600 text-white text-xs font-bold py-1 px-3 rounded-md hover:bg-green-700 transition duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                            >
                                                {addedTrips.has(index) ? 'Added' : 'Add Trip'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Ocr;
"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import ImageUploader from "@/components/ui/ImageUploader";
import SelectField from "@/components/ui/SelectField";
import LocationInput from "@/components/ui/LocationButton";
import OpeningDaysSelector from "@/components/ui/OpeningDaysSelector";
import TimeSelector from "@/components/ui/TimeSelector";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BusinessSetupData } from "@/lib/validations/information-setup/setup";

export default function InformationSetupForm() {
    // Initialize form data
    const [formData, setFormData] = useState<BusinessSetupData>({
        businessType: "",
        logo: null,
        coverPhoto: null,
        location: "",
        openingDays: [],
        openingTime: "09:00 AM",
        closingTime: "05:00 PM",
        description: "",
    });

    // Handle input changes for text/select inputs
    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const name = e.target.name;
        const value = e.target.value;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle file changes
    const handleFileChange = (name: string, file: File) => {
        setFormData((prev) => ({
            ...prev,
            [name]: file,
        }));
    };

    // Handle day selection
    const handleDaySelection = (day: string) => {
        setFormData((prev) => {
            if (prev.openingDays.includes(day)) {
                return {
                    ...prev,
                    openingDays: prev.openingDays.filter((d) => d !== day),
                };
            } else {
                return {
                    ...prev,
                    openingDays: [...prev.openingDays, day],
                };
            }
        });
    };

    // Handle preset day selections
    const handlePresetDays = (preset: "all" | "weekdays" | "weekends") => {
        if (preset === "all") {
            setFormData((prev) => ({
                ...prev,
                openingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            }));
        } else if (preset === "weekdays") {
            setFormData((prev) => ({
                ...prev,
                openingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
            }));
        } else if (preset === "weekends") {
            setFormData((prev) => ({
                ...prev,
                openingDays: ["Sat", "Sun"],
            }));
        }
    };

    // Handle map click
    const handleMapClick = () => {
        console.log("Open map functionality");
        // Implement map functionality here
    };

    // Submit the form
    const handleSubmit = () => {
        try {
            console.log("Business setup data submitted:", formData);
            // Redirect to dashboard or confirmation page
        } catch (err) {
            console.error("Submission error:", err);
        }
    };

    // Business type options
    const businessTypeOptions = [
        { value: "restaurant", label: "Restaurant" },
        { value: "cafe", label: "Café" },
        { value: "bakery", label: "Bakery" },
        { value: "food_truck", label: "Food Truck" },
        { value: "bar", label: "Bar" },
        { value: "other", label: "Other" },
    ];

    return (
            <ScrollArea className="h-[calc(100vh-10rem)] w-full">
                <div className="px-6 pb-6">
                    {/* Main content layout */}
                    <div className="xl:gap-12">
                        {/* Left column with image uploader */}
                        <div>
                            <ImageUploader
                                coverPhoto={formData.coverPhoto || null}
                                logo={formData.logo || null}
                                onCoverPhotoChange={(file) =>
                                    handleFileChange("coverPhoto", file)
                                }
                                onLogoChange={(file) => handleFileChange("logo", file)}
                            />
                        </div>

                        {/* Right column with form fields */}
                        <div className="mt-6 space-y-4 md:space-y-5">
                            <SelectField
                                label="Business Type"
                                name="businessType"
                                value={formData.businessType}
                                onChange={handleChange}
                                options={businessTypeOptions}
                                placeholder="Select Business Type"
                            />

                            <LocationInput
                                value={formData.location}
                                onChange={handleChange}
                                onMapClick={handleMapClick}
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                                <TimeSelector
                                    label="Opening Time"
                                    name="openingTime"
                                    value={formData.openingTime}
                                    onChange={handleChange}
                                />

                                <TimeSelector
                                    label="Closing Time"
                                    name="closingTime"
                                    value={formData.closingTime}
                                    onChange={handleChange}
                                />
                            </div>

                            <OpeningDaysSelector
                                selectedDays={formData.openingDays}
                                onChange={handleDaySelection}
                                onPresetSelect={handlePresetDays}
                            />
                            
                            <div>
                                <label className="text-black font-normal block mb-2 md:mb-3">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    placeholder="Enter your business description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-lg border border-text/40 focus:outline-none focus:border-primary resize-none md:p-4"
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4 md:pt-6">
                                <Button onClick={handleSubmit}>Complete Setup</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollArea>
    );
}

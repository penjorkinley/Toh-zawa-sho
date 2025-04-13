import React from "react";

interface TimeSelectorProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
}

export default function TimeSelector({
  label,
  name,
  value,
  onChange,
  error,
}: TimeSelectorProps) {
  // Generate time options in 30-minute intervals
  const generateTimeOptions = () => {
    const options = [];
    const hours = [
      "12",
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
    ];
    const minutes = ["00", "30"];
    const periods = ["AM", "PM"];

    for (const period of periods) {
      for (const hour of hours) {
        for (const minute of minutes) {
          options.push(`${hour}:${minute} ${period}`);
        }
      }
    }

    return options;
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className="w-full">
      <label className="text-text font-normal block mb-2 md:mb-3">
        {label}
      </label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full appearance-none px-4 sm:px-5 py-3 sm:py-3.5 rounded-lg border bg-white
            ${error ? "border-red-500" : "border-text/40"}
            focus:outline-none focus:border-primary text-text font-normal`}
        >
          {timeOptions.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-400"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

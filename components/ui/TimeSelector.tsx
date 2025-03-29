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
  // Generate time options (hourly intervals)
  const timeOptions = Array.from({ length: 24 }).map((_, i) => {
    const hour = i;
    const amPm = hour < 12 ? "AM" : "PM";
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${hour12.toString().padStart(2, "0")}:00 ${amPm}`;
  });

  return (
    <div className="flex-1">
      <label className="text-text font-normal block mb-2">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 rounded-lg border appearance-none focus:outline-none focus:border-primary ${
          error ? "border-red-500" : "border-text/40"
        }`}
      >
        {timeOptions.map((timeStr) => (
          <option key={timeStr} value={timeStr}>
            {timeStr}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

interface OpeningDaysSelectorProps {
  selectedDays: string[];
  onChange: (day: string) => void;
  onPresetSelect: (preset: "all" | "weekdays" | "weekends") => void;
  error?: string;
}

export default function OpeningDaysSelector({
  selectedDays,
  onChange,
  onPresetSelect,
  error,
}: OpeningDaysSelectorProps) {
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const isAllSelected = selectedDays.length === 7;
  const isWeekdaysSelected =
    selectedDays.length === 5 &&
    ["Mon", "Tue", "Wed", "Thu", "Fri"].every((day) =>
      selectedDays.includes(day)
    );
  const isWeekendsSelected =
    selectedDays.length === 2 &&
    ["Sat", "Sun"].every((day) => selectedDays.includes(day));

  return (
    <div>
      <label className="text-text font-normal block mb-2">Opening Days</label>

      {/* Preset buttons */}
      <div className="flex flex-wrap gap-2 mb-3">
        <button
          type="button"
          className={`px-3 py-1.5 rounded-full border text-sm ${
            isAllSelected
              ? "bg-primary/10 border-primary text-primary"
              : "bg-white border-gray-300 text-gray-700"
          }`}
          onClick={() => onPresetSelect("all")}
        >
          All
        </button>
        <button
          type="button"
          className={`px-3 py-1.5 rounded-full border text-sm ${
            isWeekdaysSelected
              ? "bg-primary/10 border-primary text-primary"
              : "bg-white border-gray-300 text-gray-700"
          }`}
          onClick={() => onPresetSelect("weekdays")}
        >
          Weekdays
        </button>
        <button
          type="button"
          className={`px-3 py-1.5 rounded-full border text-sm ${
            isWeekendsSelected
              ? "bg-primary/10 border-primary text-primary"
              : "bg-white border-gray-300 text-gray-700"
          }`}
          onClick={() => onPresetSelect("weekends")}
        >
          Weekends
        </button>
      </div>

      {/* Individual day buttons */}
      <div className="flex flex-wrap gap-2">
        {daysOfWeek.map((day) => (
          <button
            key={day}
            type="button"
            className={`px-3 py-1.5 rounded-full border text-sm ${
              selectedDays.includes(day)
                ? "bg-primary/10 border-primary text-primary"
                : "bg-white border-gray-300 text-gray-700"
            }`}
            onClick={() => onChange(day)}
          >
            {day}
          </button>
        ))}
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

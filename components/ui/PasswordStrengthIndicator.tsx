import React from "react";

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
  met: boolean;
}

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

export const PasswordStrengthIndicator: React.FC<
  PasswordStrengthIndicatorProps
> = ({ password, className = "" }) => {
  const requirements: PasswordRequirement[] = [
    {
      label: "At least 8 characters",
      test: (pwd) => pwd.length >= 8,
      met: password.length >= 8,
    },
    {
      label: "One uppercase letter",
      test: (pwd) => /[A-Z]/.test(pwd),
      met: /[A-Z]/.test(password),
    },
    {
      label: "One lowercase letter",
      test: (pwd) => /[a-z]/.test(pwd),
      met: /[a-z]/.test(password),
    },
    {
      label: "One number",
      test: (pwd) => /\d/.test(pwd),
      met: /\d/.test(password),
    },
    {
      label: "One special character",
      test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
      met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ];

  const metRequirements = requirements.filter((req) => req.met).length;
  const totalRequirements = requirements.length;
  const strengthPercentage = (metRequirements / totalRequirements) * 100;

  const getStrengthColor = () => {
    if (strengthPercentage < 40) return "bg-red-500";
    if (strengthPercentage < 80) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (strengthPercentage < 40) return "Weak";
    if (strengthPercentage < 80) return "Medium";
    return "Strong";
  };

  const getStrengthTextColor = () => {
    if (strengthPercentage < 40) return "text-red-600";
    if (strengthPercentage < 80) return "text-yellow-600";
    return "text-green-600";
  };

  // Don't show the indicator if no password is entered
  if (!password) return null;

  return (
    <div className={`mt-3 ${className}`}>
      {/* Password Strength Bar Only */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Password Strength</span>
          <span className={`text-sm font-medium ${getStrengthTextColor()}`}>
            {getStrengthText()}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${strengthPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;

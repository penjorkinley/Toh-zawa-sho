// components/rejection-reason-modal.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/shadcn-button";
import { X } from "lucide-react";

interface RejectionReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  businessName: string;
  loading: boolean;
}

const commonReasons = [
  "Incomplete business license documentation",
  "Business license appears to be invalid or expired",
  "Business information does not meet our requirements",
  "Missing required documentation",
  "Business type not supported on our platform",
  "Application contains false or misleading information",
];

export default function RejectionReasonModal({
  isOpen,
  onClose,
  onConfirm,
  businessName,
  loading,
}: RejectionReasonModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");
  const [useCustomReason, setUseCustomReason] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    const finalReason = useCustomReason ? customReason : selectedReason;
    onConfirm(finalReason.trim() || undefined);
  };

  const handleClose = () => {
    if (!loading) {
      setSelectedReason("");
      setCustomReason("");
      setUseCustomReason(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Reject Registration
            </h2>
            <p className="text-sm text-gray-600 mt-1">{businessName}</p>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600">
            Please provide a reason for rejecting this registration. This will
            be included in the email sent to the applicant.
          </p>

          {/* Common Reasons */}
          {!useCustomReason && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Select a reason:
              </label>
              <div className="space-y-2">
                {commonReasons.map((reason, index) => (
                  <label
                    key={index}
                    className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedReason === reason
                        ? "border-red-200 bg-red-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="rejectionReason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className="mt-1 text-red-600 focus:ring-red-500"
                      disabled={loading}
                    />
                    <span className="text-sm text-gray-700 leading-relaxed">
                      {reason}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Custom Reason */}
          {useCustomReason && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Custom reason:
              </label>
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Enter your custom rejection reason..."
                className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                disabled={loading}
              />
            </div>
          )}

          {/* Toggle Custom Reason */}
          <button
            type="button"
            onClick={() => {
              setUseCustomReason(!useCustomReason);
              setSelectedReason("");
              setCustomReason("");
            }}
            disabled={loading}
            className="text-sm text-blue-600 hover:text-blue-700 underline disabled:opacity-50"
          >
            {useCustomReason
              ? "Choose from common reasons"
              : "Write custom reason"}
          </button>

          {/* Option to reject without reason */}
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              You can also reject without providing a specific reason by
              clicking "Reject" below.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? "Rejecting..." : "Reject Registration"}
          </Button>
        </div>
      </div>
    </div>
  );
}

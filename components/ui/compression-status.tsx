// components/ui/compression-status.tsx
"use client";

import { useState, useEffect } from "react";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface CompressionStatusProps {
  isCompressing: boolean;
  compressionComplete: boolean;
  error?: string;
  originalSize?: number;
  compressedSize?: number;
}

export function CompressionStatus({
  isCompressing,
  compressionComplete,
  error,
  originalSize,
  compressedSize,
}: CompressionStatusProps) {
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    if (isCompressing || compressionComplete || error) {
      setShowStatus(true);

      // Hide after 3 seconds if completed successfully
      if (compressionComplete && !error) {
        const timer = setTimeout(() => {
          setShowStatus(false);
        }, 3000);

        return () => clearTimeout(timer);
      }
    }
  }, [isCompressing, compressionComplete, error]);

  if (!showStatus) return null;

  const formatSize = (bytes: number) => {
    return (bytes / 1024).toFixed(1) + "KB";
  };

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
      {isCompressing && (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Compressing image...</span>
        </>
      )}

      {compressionComplete && !error && (
        <>
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span>
            Image compressed{" "}
            {originalSize && compressedSize && (
              <>
                ({formatSize(originalSize)} → {formatSize(compressedSize)})
              </>
            )}
          </span>
        </>
      )}

      {error && (
        <>
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span className="text-red-500">Compression failed: {error}</span>
        </>
      )}
    </div>
  );
}

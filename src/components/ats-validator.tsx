"use client";

import React, { useState } from "react";
import { atsCompatibility } from "@/lib/ats-utils";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

interface ATSValidatorProps {
  resumeData?: unknown;
  onScoreChange?: (score: number) => void;
}

export const ATSValidator: React.FC<ATSValidatorProps> = ({
  resumeData,
  onScoreChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const report = atsCompatibility.generateReport(resumeData);
  const score = report.score as number;

  React.useEffect(() => {
    onScoreChange?.(score);
  }, [score, onScoreChange]);

  const getScoreColor = (s: number): string => {
    if (s >= 80) return "bg-green-100 border-green-300";
    if (s >= 60) return "bg-yellow-100 border-yellow-300";
    return "bg-red-100 border-red-300";
  };

  const getScoreTextColor = (s: number): string => {
    if (s >= 80) return "text-green-700";
    if (s >= 60) return "text-yellow-700";
    return "text-red-700";
  };

  return (
    <div className="space-y-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full rounded-lg border-2 p-3 text-left ${getScoreColor(score)} transition-colors`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {score >= 80 ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : score >= 60 ? (
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <span className="font-semibold">
              ATS Compatibility Score: {score}%
            </span>
          </div>
          <span className={`text-sm font-semibold ${getScoreTextColor(score)}`}>
            {score >= 80 ? "Great" : score >= 60 ? "Good" : "Needs Work"}
          </span>
        </div>
      </button>

      {isExpanded && (
        <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900">Recommendations:</h4>
            {(report.recommendations as string[])?.map((rec, idx) => (
              <div key={idx} className="flex gap-2 text-sm">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                <span className="text-gray-700">{rec}</span>
              </div>
            ))}
          </div>

          {report.checklist && typeof report.checklist === "object" ? (
            <div className="space-y-2 border-t border-gray-200 pt-3">
              <h4 className="font-semibold text-gray-900">ATS Checklist:</h4>
              <div className="space-y-1">
                {Object.entries(report.checklist as Record<string, unknown>).map(
                  ([key, value]) => (
                    <div key={key} className="flex items-center gap-2 text-sm">
                      <CheckCircle2
                        className={`h-4 w-4 ${value ? "text-green-600" : "text-gray-300"}`}
                      />
                      <span className="text-gray-700">
                        {String(key)
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

import React from "react";

const Results = ({ pollResults }) => {
  const totalVotes = Object.values(pollResults).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-4">
      {totalVotes > 0 ? (
        <div className="space-y-3">
          {Object.entries(pollResults).map(([option, votes], index) => {
            const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
            
            return (
              <div key={index} className="relative">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-gray-900 dark:text-gray-100">{option}</span>
                  </div>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">
                    {Math.round(percentage)}%
                  </span>
                </div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden">
                  <div 
                    className="h-full bg-[#7765DA] rounded-md transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-600 dark:text-gray-400">
          No results yet.
        </div>
      )}
    </div>
  );
};

export default Results;

import React, { useState, useEffect } from "react";
import Form from "../components/Form";
import Results from "../components/Results";
import Chat from "../components/Chat";
import History from "../components/History";
import { IoEye } from "react-icons/io5";
import socket from "../socketConnect";

const Teacher = () => {
  const [pollResults, setPollResults] = useState({});
  const [pollHistory, setPollHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("ask");

  useEffect(() => {
    socket.on("pollResults", (results) => {
      setPollResults(results);
      setPollHistory((prevHistory) => {
        const updatedHistory = [...prevHistory];
        if (updatedHistory.length > 0) {
          updatedHistory[updatedHistory.length - 1].results = results;
        }
        return updatedHistory;
      });
    });

    socket.on("question", (questionData) => {
      setPollHistory((prevHistory) => {
        const newPollData = {
          question: questionData.text,
          results: {}
        };
        return [...prevHistory, newPollData];
      });
    });

    return () => {
      socket.off("pollResults");
      socket.off("question");
    };
  }, []);

  const handleKickStudent = (studentName) => {
    socket.emit("kickStudent", studentName);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 px-6 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-8">
            <div className="flex gap-4 text-xs sm:text-lg">
              <button
                onClick={() => setActiveTab("ask")}
                className={`px-4 py-2 rounded-full transition-colors ${activeTab === "ask" ? "bg-[#8F64E1] text-white" : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
              >
                Ask Question
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`px-4 py-2 rounded-full transition-colors ${activeTab === "history" ? "bg-[#8F64E1] text-white" : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
              >
                <div className="flex items-center gap-1">
                  <IoEye className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>View Poll History</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-grow flex p-2 sm:p-6">
        <div className="w-full max-w-4xl mx-auto space-y-6">
          {activeTab === "ask" ? (
            <>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-1 sm:p-6">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-semibold">Create New Question</h2>
                </div>
                <Form />
              </div>

              {Object.keys(pollResults).length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-6">Current Poll Results</h2>
                  <Results pollResults={pollResults} />
                </div>
              )}
            </>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Poll History</h2>
              <History pollHistory={pollHistory} />
            </div>
          )}
        </div>
      </div>
      <Chat user="Teacher" />
    </div>
  );
};

export default Teacher;

import React, { useState, useEffect, useRef } from "react";
import Results from "../components/Results";
import Chat from "../components/Chat";
import { FaClock } from "react-icons/fa";
import intervuePoll from "../assets/intervuePoll.svg";
import socket from "../socketConnect";

const Student = () => {
  const [name, setName] = useState("");
  const [storedName, setStoredName] = useState("");
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [pollResults, setPollResults] = useState({});
  const [timer, setTimer] = useState(60);
  const [showResults, setShowResults] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [answered, setAnswered] = useState(false);
  const timerRef = useRef(null);

  // Track if user has been kicked
  const [isKicked, setIsKicked] = useState(false);

  useEffect(() => {
    const sessionName = sessionStorage.getItem("studentName");
    if (sessionName) {
      setStoredName(sessionName);
      socket.emit("setName", sessionName);
    }

    socket.on("question", (data) => {
      setQuestion(data);
      setTimer(60);
      setShowResults(false);
      setCorrectAnswer("");
      setAnswered(false);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            if (!answered) {
              socket.emit("submitAnswer", selectedOption);
              setAnswered(true);
            }
            setShowResults(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    });

    socket.on("pollResults", (results) => setPollResults(results));

    socket.on("correctAnswer", (answer) => setCorrectAnswer(answer));

    socket.on("kicked", () => {
      sessionStorage.removeItem("studentName");
      setStoredName("");
      setQuestion(null);
      setIsKicked(true);
    });

    return () => {
      socket.off();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [answered, selectedOption]);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    sessionStorage.setItem("studentName", name);
    setStoredName(name);
    socket.emit("setName", name);
  };

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    socket.emit("submitAnswer", selectedOption);
    setShowResults(true);
    setAnswered(true);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-[#EDEDED] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {isKicked ? (
          <div className="text-center py-8">
            <div className="flex justify-center mb-8">
              <img src={intervuePoll} alt="" />
            </div>
            <h2 className="text-3xl font-bold mb-4">You've been Kicked out!</h2>
            <p className="text-gray-400 text-sm">
              The teacher removed you from the poll. Please try again later.
            </p>
            <button
              onClick={() => {
                sessionStorage.removeItem("studentName");
                setName("");
                setIsKicked(false);
                window.location.reload();
              }}
              className="mt-8 bg-[#7765DA] text-white py-3 px-6 rounded-lg hover:bg-[#6655CA] transition-colors font-medium"
            >
              Start Over
            </button>
          </div>
        ) : !storedName && !sessionStorage.getItem("studentName") ? (
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <img src={intervuePoll} alt="" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Let's Get Started</h1>
            <p className="text-gray-400 text-sm mb-6">
              Enter your name to join the poll and submit your responses.
            </p>
            <form onSubmit={handleNameSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 bg-[#2A2A2A] rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#7765DA] text-white"
              />
              <button
                type="submit"
                className="w-full bg-[#7765DA] text-white py-3 rounded-lg hover:bg-[#6655CA] transition-colors font-medium"
              >
                Continue
              </button>
            </form>
          </div>
        ) : question ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">Question</h2>
              <div className="flex items-center gap-2 text-[#7765DA]">
                <FaClock className="w-4 h-4" />
                <span className="font-medium">{formatTime(timer)}</span>
              </div>
            </div>

            <div className="bg-[#2A2A2A] rounded-lg shadow-lg p-4">
              <p className="font-medium text-lg">{question.text}</p>

              <form onSubmit={handleAnswerSubmit} className="mt-4 space-y-3">
                {question.options.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                      selectedOption === option
                        ? "bg-[#7765DA] text-white"
                        : "hover:bg-gray-700"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-medium ${
                        selectedOption === option
                          ? "bg-white text-[#7765DA]"
                          : "bg-gray-600 text-gray-300"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <input
                      type="radio"
                      name="option"
                      value={option}
                      checked={selectedOption === option}
                      onChange={(e) => setSelectedOption(e.target.value)}
                      className="hidden"
                    />
                    <span className="flex-grow">{option}</span>
                  </label>
                ))}

                <button
                  type="submit"
                  disabled={!selectedOption || answered}
                  className={`w-full py-3 rounded-lg font-medium transition-all ${
                    !selectedOption || answered
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-[#7765DA] hover:bg-[#6655CA] text-white"
                  }`}
                >
                  Submit Answer
                </button>
              </form>

              {showResults && (
                <div className="mt-4 p-4 bg-[#1B1B1B] rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Poll Results</h3>
                  <Results pollResults={pollResults} />
                  {correctAnswer && (
                    <div className="mt-3 p-3 bg-green-700 text-white rounded-lg">
                      <p className="font-medium">
                        Correct Answer: {correctAnswer}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="flex justify-center mb-8">
              <img src={intervuePoll} alt="" />
            </div>
            <h2 className="text-xl font-semibold text-[#EDEDED] mb-2">
              Waiting for Question
            </h2>
            <p className="text-[#EDEDED]">
              The teacher hasn't posted a question yet.
            </p>
          </div>
        )}
      </div>
      <Chat user={storedName || "Student"} />
    </div>
  );
};

export default Student;

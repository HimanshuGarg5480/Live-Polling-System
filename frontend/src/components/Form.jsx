import React, { useState, useEffect } from "react";
import socket from "../socketConnect";

const Form = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [correctOptions, setCorrectOptions] = useState({});
  const [charCount, setCharCount] = useState(0);
  const [timeLimit, setTimeLimit] = useState(60);

  useEffect(() => {
    const initialCorrectOptions = {};
    options.forEach((option, index) => {
      initialCorrectOptions[index] = index === 0 ? true : false;
    });
    setCorrectOptions(initialCorrectOptions);
  }, []);

  const handleQuestionChange = (e) => {
    const value = e.target.value;
    setQuestion(value);
    setCharCount(value.length);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCorrectOptionChange = (index, isCorrect) => {
    setCorrectOptions((prev) => ({
      ...prev,
      [index]: isCorrect,
    }));
  };

  const handleQuestionSubmit = (e) => {
    e.preventDefault();
    const correctOption =
      options[
        Object.entries(correctOptions).find(([_, isCorrect]) => isCorrect)[0]
      ];
    const questionData = {
      text: question,
      options: options.filter((option) => option.trim()),
      correctOption,
    };
    socket.emit("submitQuestion", questionData);
    setQuestion("");
    setOptions([]);
    setCorrectOptions({});
    setCharCount(0);
  };

  const addOption = () => {
    const newIndex = options.length;
    setOptions([...options, ""]);
    setCorrectOptions((prev) => ({
      ...prev,
      [newIndex]: false,
    }));
  };

  return (
    <div className="space-y-6 bg-gray-900 text-white p-2 sm:p-6 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <span className="px-4 py-1 bg-purple-500 text-white rounded-full text-sm">
          Intervue Poll
        </span>
      </div>

      <div className="mb-6">
        <h1 className="text-xl sm:text-3xl font-bold text-white mb-2">
          Let's Get Started
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm">
          You'll have the ability to create and manage polls, ask questions, and
          monitor your students' responses in real-time.
        </p>
      </div>

      <form onSubmit={handleQuestionSubmit} className="space-y-6">
        <div className="flex justify-between items-center">
          <label className="text-xs sm:text-lg font-medium text-white">
            Enter your question
          </label>
          <select
            value={timeLimit}
            onChange={(e) => setTimeLimit(Number(e.target.value))}
            className="bg-gray-800 rounded-md py-1 pl-3 pr-8 text-sm font-medium text-white focus:ring-purple-500"
          >
            <option value={60}>60 seconds</option>
            <option value={30}>30 seconds</option>
            <option value={90}>90 seconds</option>
          </select>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <textarea
            placeholder="Enter your question"
            value={question}
            onChange={handleQuestionChange}
            className="w-full p-2 bg-transparent focus:outline-none text-white placeholder-gray-500 text-base resize-none"
            required
            maxLength={100}
            rows={3}
          />
          <div className="text-right text-sm text-gray-400">
            {charCount}/100
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <h2 className="text-lg font-medium text-white">Edit Options</h2>
          <h2 className="text-lg font-medium text-white">Is it Correct?</h2>
        </div>

        {options.map((option, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center flex-shrink-0">
              {index + 1}
            </div>
            <input
              type="text"
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="w-full p-3 bg-gray-800 rounded-lg focus:outline-none text-white placeholder-gray-500 text-base"
              required
            />

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id={`correct-yes-${index}`}
                  name={`correctOption-${index}`}
                  checked={correctOptions[index] === true}
                  onChange={() => handleCorrectOptionChange(index, true)}
                  className="w-4 h-4 text-[#7765DA] focus:ring-[#7765DA] cursor-pointer"
                />
                <label
                  htmlFor={`correct-yes-${index}`}
                  className="text-sm text-[#dcd2d2] cursor-pointer"
                >
                  Yes
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id={`correct-no-${index}`}
                  name={`correctOption-${index}`}
                  checked={correctOptions[index] === false}
                  onChange={() => handleCorrectOptionChange(index, false)}
                  className="w-4 h-4 text-[#7765DA] focus:ring-[#7765DA] cursor-pointer"
                />
                <label
                  htmlFor={`correct-no-${index}`}
                  className="text-sm text-[#dcd2d2] cursor-pointer"
                >
                  No
                </label>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addOption}
          className="flex items-center justify-center gap-2 text-purple-400 font-medium"
        >
          <span className="text-lg">+</span> Add More option
        </button>

        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            disabled={
              !question.trim() ||
              options.length < 2 ||
              !Object.values(correctOptions).some((val) => val === true)
            }
            className="bg-purple-500 text-white py-3 px-12 rounded-full hover:bg-purple-400 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Ask Question
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;

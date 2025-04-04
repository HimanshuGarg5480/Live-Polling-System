import { useNavigate } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
import { useState } from "react";

const Home = () => {
  const roles = ["Student", "Teacher"];
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const handleContinue = () => {
    if (role === roles[0]) {
      navigate("/student");
    } else if (role === roles[1]) {
      // Redirect to the Teacher page
      navigate("/teacher");
    }
  };
  return (
    <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center p-4 text-white">
      <div className="w-full max-w-3xl">
        <div className="flex justify-center mb-8">
          <span className="px-4 py-1 bg-[#4F46E5] text-white rounded-full text-sm">
            Interview Poll
          </span>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome to the Live Polling System
          </h1>
          <p className="text-[#B0B0B0] text-sm">
            Please select the role that best describes you to begin using the
            live polling system
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div
            // to="/student"
            className={`p-6 bg-[#2A2A2A] rounded-lg border-2 hover:border-[#6B5DD3] ${
              role == roles[0] ? "border-[#6B5DD3]":"border-transparent"
            } transition-colors cursor-pointer`}
            onClick={() => setRole(roles[0])}
          >
            <h2 className="font-semibold text-lg text-white mb-2">
              I'm a Student
            </h2>
            <p className="text-[#B0B0B0] text-sm">
              Lorem ipsum is simply dummy text of the printing and typesetting
              industry
            </p>
          </div>

          <div
            // to="/teacher"
            className={`p-6 bg-[#2A2A2A] rounded-lg border-2 hover:border-[#6B5DD3] ${
              role == roles[1] ? "border-[#6B5DD3]":"border-transparent"
            } transition-colors cursor-pointer`}
            onClick={() => setRole(roles[1])}
          >
            <h2 className="font-semibold text-lg text-white mb-2">
              I'm a Teacher
            </h2>
            <p className="text-[#B0B0B0] text-sm">
              Submit answers and view live poll results in real-time.
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            className="px-8 py-3 bg-[#4F46E5] hover:bg-[#6B5DD3] text-white rounded-lg text-lg font-medium transition-colors flex items-center gap-2"
            onClick={handleContinue}
          >
            Continue
            <FaArrowRightLong />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;

import React, { useContext } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../context/UserContext";
import axios from "axios";

const Feedback = () => {
  const {
    feedbackMessage,
    setFeedbackMessage,
    userInfo,
    backendURL,
  } = useContext(UserContext);

  const handleSubmit = async () => {
    if (feedbackMessage.trim() === "") {
      toast.warning("Please enter your feedback first.");
      return;
    }
    try {
      await axios.post(`${backendURL}/api/feedback`, {
        message: feedbackMessage,
        user: userInfo ? {
          name: userInfo.name,
          srn: userInfo.srn,
          email: userInfo.email,
        } : undefined,
      });
      toast.success("✅ Feedback Submitted!");
      setFeedbackMessage("");
    } catch (err) {
      toast.error("Failed to submit feedback");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">We Value Your Feedback</h2>
        <textarea
          className="w-full min-h-[120px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition mb-4"
          placeholder="Write your feedback here..."
          value={feedbackMessage}
          onChange={(e) => setFeedbackMessage(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-2 rounded-lg transition"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Feedback;

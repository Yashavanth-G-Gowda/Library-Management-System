import React, { useContext } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../context/UserContext";

const Feedback = () => {
  const {
    isFeedbackVisible,
    setIsFeedbackVisible,
    feedbackMessage,
    setFeedbackMessage,
  } = useContext(UserContext);

  const handleSubmit = () => {
    if (feedbackMessage.trim() === "") {
      toast.warning("Please enter your feedback first.");
      return;
    }

    console.log("Feedback submitted:", feedbackMessage); // 👈 Log feedback
    toast.success("✅ Feedback Submitted!");
    setFeedbackMessage("");
    setIsFeedbackVisible(false); // close
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="relative w-[90%] max-w-md bg-white p-5 rounded-2xl shadow-2xl">
        {/* X Close */}
        <button
          onClick={() => setIsFeedbackVisible(false)}
          className="absolute top-3 right-4 text-gray-500 text-lg font-bold hover:text-red-500 transition"
        >
          X
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Feedback</h2>

        <textarea
          className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
          placeholder="Write your feedback here..."
          value={feedbackMessage}
          onChange={(e) => setFeedbackMessage(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="mt-4 w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-2 rounded-lg transition"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Feedback;

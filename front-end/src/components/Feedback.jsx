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

  if (!isFeedbackVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-end pointer-events-none">
      <div className="relative w-[95%] max-w-md bg-white p-5 rounded-t-2xl shadow-2xl mb-4 pointer-events-auto animate-slideUp">
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
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideUp {
          animation: slideUp 0.3s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </div>
  );
};

export default Feedback;

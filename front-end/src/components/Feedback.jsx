import React, { useContext, useState } from "react";
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
    setLoginComp,
  } = useContext(UserContext);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // Check if user is logged in
    if (!userInfo || !userInfo.srn) {
      toast.error("Please login to submit feedback");
      setLoginComp(true);
      return;
    }

    if (feedbackMessage.trim() === "") {
      toast.warning("Please enter your feedback first.");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`${backendURL}/api/feedback`, {
        message: feedbackMessage,
      }, {
        headers: {
          token: localStorage.getItem('token')
        }
      });
      toast.success("✅ Feedback Submitted!");
      setFeedbackMessage("");
    } catch (err) {
      console.error("Feedback submission error:", err);
      if (err.response?.status === 401) {
        toast.error("Please login to submit feedback");
        setLoginComp(true);
      } else {
        toast.error("Failed to submit feedback");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mobile floating button
  const [showMobileFeedback, setShowMobileFeedback] = useState(false);

  return (
    <>


      {/* Mobile Feedback Modal */}
      {showMobileFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-[95vw] max-w-xs bg-white p-4 rounded-2xl shadow-xl relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
              onClick={() => setShowMobileFeedback(false)}
              aria-label="Close Feedback"
            >
              ×
            </button>
            <h2 className="text-lg font-bold text-center text-gray-800 mb-3">We Value Your Feedback</h2>
            <textarea
              rows={4}
              className="w-full border rounded-lg p-2 mb-3 focus:ring-2 focus:ring-green-400"
              placeholder="Your feedback..."
              value={feedbackMessage}
              onChange={e => setFeedbackMessage(e.target.value)}
              disabled={isSubmitting}
            />
            <button
              className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </div>
      )}

      {/* Main Feedback Page (visible on desktop, or when navigating to /feedback) */}
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-2 sm:p-4">
        <div className="w-full max-w-[95vw] sm:max-w-md bg-white p-4 sm:p-6 rounded-2xl shadow-xl">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-4 sm:mb-6">We Value Your Feedback</h2>
          {/* Login Status */}
          {!userInfo || !userInfo.srn ? (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm text-center">
                Please <button 
                  onClick={() => setLoginComp(true)} 
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  login
                </button> to submit feedback
              </p>
            </div>
          ) : (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm text-center">
                Logged in as: {userInfo.name || userInfo.srn}
              </p>
            </div>
          )}
          <textarea
            className="w-full min-h-[120px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition mb-4"
            placeholder={!userInfo || !userInfo.srn ? "Please login to submit feedback..." : "Write your feedback here..."}
            value={feedbackMessage}
            onChange={(e) => setFeedbackMessage(e.target.value)}
            disabled={!userInfo || !userInfo.srn}
          />
          <button
            onClick={handleSubmit}
            disabled={!userInfo || !userInfo.srn || isSubmitting}
            className={`w-full font-medium py-2 rounded-lg transition ${
              !userInfo || !userInfo.srn 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : isSubmitting
                ? 'bg-cyan-400 text-white cursor-wait'
                : 'bg-cyan-500 hover:bg-cyan-600 text-white'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </>
  );
};

export default Feedback;

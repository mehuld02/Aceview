import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ConnectionPage = () => {
  const { username } = useParams();
  const location = useLocation();
  const match = location.state?.match;
  const navigate = useNavigate();

  if (!match) {
    return <p>No connection data found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Connected with {username}
        </h1>

        <div className="mb-6">
          <p><strong>🎯 Can Teach:</strong> {match.skillOffered}</p>
          <p><strong>🧠 Wants to Learn:</strong> {match.wantsToLearn}</p>
        </div>

        {/* Options */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600">
            💬 Chat
          </button>
         <button
  className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
  onClick={() => navigate("/classroom")}
>
  Join Classroom
</button>

          <button className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
            ✅ Verify
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectionPage;

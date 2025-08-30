import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const MatchesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedSkill = location.state?.matches?.[0]; 
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    if (!selectedSkill) return;

    fetch("http://localhost:5000/api/skills")
      .then((res) => res.json())
      .then((data) => {
        const foundMatches = data.filter((skill) => {
          return (
            skill.skillOffered.toLowerCase() ===
              selectedSkill.wantsToLearn.toLowerCase() &&
            skill.wantsToLearn.toLowerCase() ===
              selectedSkill.skillOffered.toLowerCase() &&
            skill.user !== selectedSkill.user
          );
        });
        setMatches(foundMatches);
      })
      .catch((err) => console.error(err));
  }, [selectedSkill]);

  if (!selectedSkill) {
    return <p>No skill selected for matching.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Matches for {selectedSkill.user}
        </h1>

        {matches.length === 0 ? (
          <p className="text-center text-gray-600">No matches found yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {matches.map((match, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800">
                  {match.user}
                </h2>
                <p>🎯 Can Teach: {match.skillOffered}</p>
                <p>🧠 Wants to Learn: {match.wantsToLearn}</p>

                {/* Connect Button */}
                <button
                  onClick={() => navigate(`/connect/${match.user}`, { state: { match } })}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Connect
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchesPage;

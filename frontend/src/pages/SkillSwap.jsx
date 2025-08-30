import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Correct import

const SkillSwap = () => {
  const [skills, setSkills] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    skillOffered: "",
    wantsToLearn: "",
    user: "",
  });

  const navigate = useNavigate();

  // Fetch existing skills
  useEffect(() => {
    fetch("http://localhost:5000/api/skills")
      .then((res) => res.json())
      .then((data) => setSkills(data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const newSkill = await res.json();
      setSkills([...skills, newSkill]);
      setFormData({ skillOffered: "", wantsToLearn: "", user: "" });
      setShowForm(false);
    } catch (error) {
      console.error("Error adding skill:", error);
    }
  };

  const handleMatchNow = (skillId) => {
  const selectedSkill = skills.find((s) => s._id === skillId);

  // Find matches: who wants to learn what I offer OR offers what I want
  const matchedUsers = skills.filter(
    (s) =>
      (s.wantsToLearn.toLowerCase() === selectedSkill.skillOffered.toLowerCase() &&
       s.user !== selectedSkill.user) ||
      (s.skillOffered.toLowerCase() === selectedSkill.wantsToLearn.toLowerCase() &&
       s.user !== selectedSkill.user)
  );

  navigate("/matches", { state: { selectedSkill, matches: matchedUsers } });
};


  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-10">
          SkillSwap - Peer-to-Peer Learning
        </h1>

        {/* Add Skill Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
          >
            + Add Your Skill
          </button>
        </div>

        {/* Add Skill Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md mb-6"
          >
            <input
              type="text"
              name="skillOffered"
              placeholder="Skill Offered"
              value={formData.skillOffered}
              onChange={handleChange}
              className="border p-2 w-full mb-3"
              required
            />
            <input
              type="text"
              name="wantsToLearn"
              placeholder="Wants to Learn"
              value={formData.wantsToLearn}
              onChange={handleChange}
              className="border p-2 w-full mb-3"
              required
            />
            <input
              type="text"
              name="user"
              placeholder="Your Name"
              value={formData.user}
              onChange={handleChange}
              className="border p-2 w-full mb-3"
              required
            />
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Save Skill
            </button>
          </form>
        )}

        {/* Skill Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <div key={index} className="bg-white shadow-md p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800">
                🎯 Skill Offered: {skill.skillOffered}
              </h2>
              <p className="mt-2 text-gray-600">
                🧠 Wants to Learn: {skill.wantsToLearn}
              </p>
              <p className="mt-4 text-sm text-gray-500">👤 User: {skill.user}</p>
              <button
                className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
                onClick={() => handleMatchNow(skill._id)} // ✅ Pass correct id from DB
              >
                Match Now
              </button>

               <button
    className="mt-2 w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600 transition"
    onClick={() => navigate("/classroom")}
  >
    Join Classroom
  </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillSwap;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SkillSwap = () => {
  const [formData, setFormData] = useState({
    teach: "",
    learn: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.teach || !formData.learn) {
      alert("Please enter both skills");
      return;
    }

    navigate("/matches", {
      state: {
        teach: formData.teach,
        learn: formData.learn,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-8 rounded-3xl w-[400px]"
      >
        <h2 className="text-2xl font-bold mb-6">Skill Swap</h2>

        <input
          type="text"
          name="teach"
          placeholder="Skill you can teach"
          value={formData.teach}
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded-xl bg-slate-900"
        />

        <input
          type="text"
          name="learn"
          placeholder="Skill you want to learn"
          value={formData.learn}
          onChange={handleChange}
          className="w-full p-3 mb-6 rounded-xl bg-slate-900"
        />

        <button className="w-full bg-indigo-500 py-3 rounded-xl font-bold">
          Find Matches
        </button>
      </form>
    </div>
  );
};

export default SkillSwap;

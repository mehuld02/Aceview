// src/components/CreateProfile.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import '../App.css'; 

const CreateProfile = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        displayName: '',
        location: '',
        bio: '',
    });
    // --- NEW STATE FOR SKILLS ---
    const [skills, setSkills] = useState([]);
    const [currentSkill, setCurrentSkill] = useState('');
    // ---
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- NEW FUNCTION TO ADD A SKILL ---
    const handleAddSkill = (e) => {
        e.preventDefault();
        const trimmedSkill = currentSkill.trim();
        if (trimmedSkill && !skills.includes(trimmedSkill)) {
            setSkills([...skills, trimmedSkill]);
        }
        setCurrentSkill(''); // Clear the input field
    };
    
    // --- NEW FUNCTION TO REMOVE A SKILL ---
    const handleRemoveSkill = (skillToRemove) => {
        setSkills(skills.filter(skill => skill !== skillToRemove));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const user = auth.currentUser;
        if (!user) {
            setError("No user is signed in.");
            setLoading(false);
            return;
        }

        try {
            await updateProfile(user, {
                displayName: formData.displayName,
            });

            const userDocRef = doc(db, 'users', user.uid);
            await setDoc(userDocRef, {
                displayName: formData.displayName,
                location: formData.location,
                bio: formData.bio,
                skills: skills, // <-- NEW: Save the skills array
            }, { merge: true });

            navigate('/profile'); 

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container dark">
            <form className="login-form dark" onSubmit={handleSubmit}>
                <h2>Complete Your Profile</h2>
                <p>Welcome! Let's get your profile set up.</p>
                <input
                    type="text" name="displayName" placeholder="Your Name"
                    value={formData.displayName} onChange={handleChange} required
                />
                <input
                    type="text" name="location" placeholder="Your Location (e.g., Mumbai, India)"
                    value={formData.location} onChange={handleChange}
                />
                <textarea
                    name="bio" placeholder="Tell us a little about yourself..."
                    value={formData.bio} onChange={handleChange} rows="3" className='createbio'
                />

                {/* --- NEW SKILLS SECTION --- */}
                <div className="skills-section">
                    <label>Skills</label>
                    <div className="skills-input-container">
                        <input
                            type="text"
                            placeholder="Add a skill (e.g., React)"
                            value={currentSkill}
                            onChange={(e) => setCurrentSkill(e.target.value)}
                        />
                        <button type="button" onClick={handleAddSkill} className="add-skill-btn">Add</button>
                    </div>
                    <div className="skills-display-container">
                        {skills.map((skill, index) => (
                            <div key={index} className="skill-tag">
                                {skill}
                                <button type="button" onClick={() => handleRemoveSkill(skill)} className="skill-remove-btn">
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                {/* --- END SKILLS SECTION --- */}

                <button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save and Continue'}
                </button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
};

export default CreateProfile;
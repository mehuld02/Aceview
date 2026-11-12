import React, { useEffect, useState, useMemo } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

// ✨ Sub-component for the Profile Completion progress bar
const ProfileCompletion = ({ percentage }) => {
    const barColor = percentage < 40 ? 'bg-red-500' : percentage < 80 ? 'bg-yellow-500' : 'bg-green-500';
    return (
        <div className="w-full mt-2">
            <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-300">Profile Completion</span>
                <span className="text-sm font-medium text-gray-300">{percentage}%</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2.5">
                <div className={`${barColor} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
};

// 💀 Sub-component for the loading state skeleton (Dark mode)
const ProfileSkeleton = () => (
    <div className="w-full max-w-4xl bg-gray-800 rounded-2xl shadow-lg overflow-hidden animate-pulse">
        <div className="relative h-56">
            <div className="h-40 bg-gray-700"></div>
            <div className="absolute left-8 top-20">
                <div className="w-32 h-32 rounded-full bg-gray-600 border-4 border-gray-800"></div>
            </div>
        </div>
        <div className="pt-4 pb-0 px-8">
            <div className="ml-40">
                <div className="h-8 w-1/2 bg-gray-700 rounded"></div>
                <div className="h-4 w-1/3 bg-gray-700 rounded mt-2"></div>
                <div className="h-10 w-full bg-gray-700 rounded mt-4"></div>
            </div>
            <div className="mt-6 flex space-x-4 border-b border-gray-600">
                <div className="h-10 w-24 bg-gray-700 rounded-t"></div>
                <div className="h-10 w-24 bg-gray-700 rounded-t"></div>
            </div>
        </div>
        <div className="p-8 space-y-4">
            <div className="h-6 w-3/4 bg-gray-700 rounded"></div>
            <div className="h-6 w-2/3 bg-gray-700 rounded"></div>
            <div className="h-6 w-1/2 bg-gray-700 rounded"></div>
        </div>
    </div>
);

// 📝 Sub-component for the Edit Profile Form
const EditProfileForm = ({ user, profileData, setActiveTab }) => {
    const [formData, setFormData] = useState({
        displayName: user.displayName || '',
        bio: profileData?.bio || '',
        location: profileData?.location || '',
        website: profileData?.website || '',
        socialLinks: profileData?.socialLinks || { github: '', linkedin: '' },
        skills: profileData?.skills || [],
        experience: profileData?.experience || [],
        education: profileData?.education || []
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSocialChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            socialLinks: {
                ...prev.socialLinks,
                [name]: value
            }
        }));
    };

    const handleAddSection = (section) => {
        const newItem = section === 'education'
            ? { school: '', degree: '', year: '' }
            : { company: '', title: '', startDate: '', endDate: '' };
        setFormData(prev => ({
            ...prev,
            [section]: [...prev[section], newItem]
        }));
    };

    const handleRemoveSection = (section, index) => {
        setFormData(prev => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index)
        }));
    };

    const handleSectionChange = (section, index, e) => {
        const { name, value } = e.target;
        const list = [...formData[section]];
        list[index][name] = value;
        setFormData(prev => ({ ...prev, [section]: list }));
    };

    const handleAddSkill = (e) => {
        e.preventDefault();
        const trimmedSkill = e.target.skill.value.trim();
        if (trimmedSkill && !formData.skills.includes(trimmedSkill) && formData.skills.length < 10) {
            setFormData(prev => ({ ...prev, skills: [...prev.skills, trimmedSkill] }));
            e.target.skill.value = '';
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setFormData(prev => ({ ...prev, skills: prev.skills.filter(skill => skill !== skillToRemove) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (formData.displayName !== user.displayName) {
                await updateProfile(auth.currentUser, { displayName: formData.displayName });
            }
            const userDocRef = doc(db, 'users', user.uid);
            await setDoc(userDocRef, { ...formData, displayName: formData.displayName }, { merge: true });
            setActiveTab('overview');
        } catch (error) {
            console.error('Error updating profile: ', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Basic Info</h3>
                <div>
                    <label htmlFor="displayName" className="block text-sm font-medium text-gray-300">Display Name</label>
                    <input type="text" id="displayName" name="displayName" value={formData.displayName} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-300">Bio</label>
                    <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows="3" className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                </div>
                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-300">Location</label>
                    <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Contact & Social</h3>
                <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-300">Website URL</label>
                    <input type="url" id="website" name="website" value={formData.website} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">Social Links</label>
                    <div className="mt-1 space-y-2">
                        <input type="url" name="github" placeholder="GitHub URL" value={formData.socialLinks.github} onChange={handleSocialChange} className="block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        <input type="url" name="linkedin" placeholder="LinkedIn URL" value={formData.socialLinks.linkedin} onChange={handleSocialChange} className="block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Skills</h3>
                <form onSubmit={handleAddSkill} className="flex gap-2">
                    <input type="text" name="skill" placeholder="Add a skill" className="block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    <button type="submit" className="py-2 px-4 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">Add</button>
                </form>
                <div className="flex flex-wrap gap-2 mt-3">
                    {formData.skills.map((skill, index) => (
                        <div key={index} className="flex items-center gap-2 bg-gray-600 text-gray-200 text-sm font-medium px-3 py-1 rounded-full">
                            {skill}
                            <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-gray-400 hover:text-white font-bold">&times;</button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Work Experience</h3>
                {formData.experience.map((exp, index) => (
                    <div key={index} className="space-y-2 p-4 bg-gray-900 rounded-lg relative group border border-gray-700">
                        <button type="button" onClick={() => handleRemoveSection('experience', index)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full bg-gray-800 hover:bg-gray-700 focus:outline-none">&times;</button>
                        <input type="text" name="title" value={exp.title} onChange={(e) => handleSectionChange('experience', index, e)} placeholder="Job Title" className="block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm text-gray-100" />
                        <input type="text" name="company" value={exp.company} onChange={(e) => handleSectionChange('experience', index, e)} placeholder="Company" className="block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm text-gray-100" />
                        <div className="flex gap-2">
                            <input type="text" name="startDate" value={exp.startDate} onChange={(e) => handleSectionChange('experience', index, e)} placeholder="Start Date" className="block w-1/2 px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm text-gray-100" />
                            <input type="text" name="endDate" value={exp.endDate} onChange={(e) => handleSectionChange('experience', index, e)} placeholder="End Date (or 'Present')" className="block w-1/2 px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm text-gray-100" />
                        </div>
                    </div>
                ))}
                <button type="button" onClick={() => handleAddSection('experience')} className="w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 transition-colors">Add Experience</button>
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Education</h3>
                {formData.education.map((edu, index) => (
                    <div key={index} className="space-y-2 p-4 bg-gray-900 rounded-lg relative group border border-gray-700">
                        <button type="button" onClick={() => handleRemoveSection('education', index)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full bg-gray-800 hover:bg-gray-700 focus:outline-none">&times;</button>
                        <input type="text" name="school" value={edu.school} onChange={(e) => handleSectionChange('education', index, e)} placeholder="School/University" className="block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm text-gray-100" />
                        <input type="text" name="degree" value={edu.degree} onChange={(e) => handleSectionChange('education', index, e)} placeholder="Degree/Field of Study" className="block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm text-gray-100" />
                        <input type="text" name="year" value={edu.year} onChange={(e) => handleSectionChange('education', index, e)} placeholder="Year" className="block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm text-gray-100" />
                    </div>
                ))}
                <button type="button" onClick={() => handleAddSection('education')} className="w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 transition-colors">Add Education</button>
            </div>

            <button type="submit" disabled={isSaving} className="w-full flex justify-center py-3 px-4 rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-500 transition-colors">
                {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
        </form>
    );
};

// 👤 Main Profile Component
function Profile() {
    const [user, setUser] = useState(auth.currentUser);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const userDocRef = doc(db, 'users', currentUser.uid);
                const userDoc = await getDoc(userDocRef);
                setProfileData(userDoc.exists() ? userDoc.data() : {
                    bio: '',
                    location: '',
                    website: '',
                    socialLinks: { github: '', linkedin: '' },
                    skills: [],
                    experience: [],
                    education: []
                });
            } else {
                setUser(null);
                setProfileData(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [activeTab]);

    const handleLogout = async () => {
        await auth.signOut();
    };

    // ✨ Calculate completion percentage
    const completionPercentage = useMemo(() => {
        if (!user || !profileData) return 0;
        let completedFields = 0;
        const totalFields = 7;
        if (user.photoURL && !user.photoURL.includes('ui-avatars.com')) completedFields++;
        if (user.displayName) completedFields++;
        if (profileData.bio) completedFields++;
        if (profileData.location) completedFields++;
        if (profileData.website) completedFields++;
        if (profileData.socialLinks?.github || profileData.socialLinks?.linkedin) completedFields++;
        if (profileData.skills?.length > 0) completedFields++;
        return Math.round((completedFields / totalFields) * 100);
    }, [user, profileData]);

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-6">
                        {/* About Section */}
                        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                            <h3 className="text-2xl font-semibold text-white mb-4">About</h3>
                            <p className="text-gray-300 mb-4">{profileData?.bio || 'No bio yet. Add one in the edit section!'}</p>
                            <div className="space-y-3 text-gray-400">
                                <div className="flex items-center space-x-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400 flex-shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                    <span>{profileData?.location || 'Not specified'}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400 flex-shrink-0"><circle cx="12" cy="12" r="10"></circle><path d="M2 12h20"></path><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                                    {profileData?.website ? (
                                        <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="hover:underline text-indigo-300 truncate">{profileData.website}</a>
                                    ) : (
                                        <span>Not specified</span>
                                    )}
                                </div>
                                <div className="flex items-center space-x-3">
                                    {profileData?.socialLinks?.github && (
                                        <a href={profileData.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0c-2.73-1.83-3.91-1.18-4-1.09A5.07 5.07 0 0 0 3.1 4.77 5.44 5.44 0 0 0 2 10.42c0 5.44 3.3 6.63 6.44 7.02-.08.23-.33.79-.38 1.48v2.96"></path></svg>
                                        </a>
                                    )}
                                    {profileData?.socialLinks?.linkedin && (
                                        <a href={profileData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Skills Section */}
                        {profileData?.skills?.length > 0 && (
                            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                                <h3 className="text-2xl font-semibold text-white mb-4">Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {profileData.skills.map((skill, index) => (
                                        <span key={index} className="bg-gray-700 text-indigo-300 text-sm font-medium px-4 py-1.5 rounded-full">{skill}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Experience Section */}
                        {profileData?.experience?.length > 0 && (
                            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                                <h3 className="text-2xl font-semibold text-white mb-4">Experience</h3>
                                <div className="space-y-6">
                                    {profileData.experience.map((exp, index) => (
                                        <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-gray-900 border border-gray-700">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400 flex-shrink-0 mt-1"><path d="M22 17H2v-7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v7zm0 0v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2"></path><path d="M12 9V2h-2v7"></path><path d="M18 9V2h-2v7"></path></svg>
                                            <div>
                                                <h4 className="text-lg font-semibold text-white">{exp.title}</h4>
                                                <p className="text-gray-400">{exp.company}</p>
                                                <p className="text-gray-500 text-sm">{exp.startDate} - {exp.endDate}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Education Section */}
                        {profileData?.education?.length > 0 && (
                            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                                <h3 className="text-2xl font-semibold text-white mb-4">Education</h3>
                                <div className="space-y-6">
                                    {profileData.education.map((edu, index) => (
                                        <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-gray-900 border border-gray-700">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400 flex-shrink-0 mt-1"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="12" y1="17" x2="12" y2="10"></line></svg>
                                            <div>
                                                <h4 className="text-lg font-semibold text-white">{edu.school}</h4>
                                                <p className="text-gray-400">{edu.degree}</p>
                                                <p className="text-gray-500 text-sm">{edu.year}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 'edit':
                return <EditProfileForm user={user} profileData={profileData} setActiveTab={setActiveTab} />;
            default:
                return null;
        }
    };

    if (loading) {
        return (<div className="bg-gray-900 min-h-screen p-4 sm:p-8 flex justify-center items-center"><ProfileSkeleton /></div>);
    }

    if (!user) {
        return (<div className="flex justify-center items-center h-screen bg-gray-900"><h2 className="text-2xl font-semibold text-white">Please login to view your profile.</h2></div>);
    }

    return (
        <div className="bg-gray-900 min-h-screen p-4 sm:p-8 flex justify-center">
            <div className="w-full max-w-4xl bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                <div className="relative h-56">
                    <div className="h-40 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                    <div className="absolute left-8 top-20">
                        <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || user.email}&background=4C51BF&color=fff&size=128`} alt="User Avatar" className="w-32 h-32 rounded-full border-4 border-gray-800 object-cover shadow-lg" />
                    </div>
                </div>
                <div className="pt-4 pb-0 px-8">
                    <div className="ml-40">
                        <h2 className="text-3xl font-bold text-white">{user.displayName || 'Anonymous User'}</h2>
                        <p className="text-sm text-gray-400">{user.email}</p>
                        <ProfileCompletion percentage={completionPercentage} />
                    </div>
                    <div className="mt-6 border-b border-gray-700">
                        <nav className="flex space-x-4">
                            <button className={`py-3 px-1 font-medium text-sm transition-colors ${activeTab === 'overview' ? 'border-b-2 border-indigo-500 text-indigo-400' : 'text-gray-400 hover:text-gray-200'}`} onClick={() => setActiveTab('overview')}>Overview</button>
                            <button className={`flex items-center gap-2 py-3 px-1 font-medium text-sm transition-colors ${activeTab === 'edit' ? 'border-b-2 border-indigo-500 text-indigo-400' : 'text-gray-400 hover:text-gray-200'}`} onClick={() => setActiveTab('edit')}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                Edit Profile
                            </button>
                        </nav>
                    </div>
                </div>
                <div className="p-8">{renderContent()}</div>
                <div className="px-8 py-4 bg-gray-900 border-t border-gray-700">
                    <button onClick={handleLogout} className="w-30 flex justify-center items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Profile;
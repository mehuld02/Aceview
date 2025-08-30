import React, { useEffect, useRef, useState } from "react";

const SkillSwapClassroom = () => {
  const teacherVideoRef = useRef(null);
  const studentVideoRefs = useRef([]); // store refs for student videos
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [localStream, setLocalStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);

  const students = [
    { id: 1, name: "Student 1" },
    { id: 2, name: "Student 2" },
    { id: 3, name: "Student 3" },
    { id: 4, name: "Student 4" },
  ];

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
        if (teacherVideoRef.current) {
          teacherVideoRef.current.srcObject = stream;
        }
        studentVideoRefs.current.forEach((video) => {
          if (video) video.srcObject = stream;
        });
      })
      .catch((err) => console.error("Camera access denied:", err));
  }, []);

  const handleSend = () => {
    if (newMessage.trim() === "") return;
    setChatMessages([...chatMessages, { sender: "You", text: newMessage }]);
    setNewMessage("");
  };

  const handleToggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  // End call (stop all media tracks)
  const handleEndCall = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
      if (teacherVideoRef.current) {
        teacherVideoRef.current.srcObject = null;
      }
      studentVideoRefs.current.forEach((video) => {
        if (video) video.srcObject = null;
      });
    }
    alert("Call ended.");
  };

  // Share screen
  const handleShareScreen = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      if (teacherVideoRef.current) {
        teacherVideoRef.current.srcObject = screenStream;
      }
    } catch (err) {
      console.error("Screen share failed:", err);
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-100 p-3 flex flex-col ">
      <div className="mb-2 text-center">
        <h1 className="text-xl font-bold text-indigo-600">SkillSwap Classroom</h1>
        <p className="text-gray-600 text-sm">Live Learning Session</p>
      </div>

      {/* Main Section */}
      <div className="flex-1 flex gap-3 overflow-hidden">
        <div className="flex-1 flex flex-col gap-3 overflow-hidden">
          <div className="flex-1 bg-black rounded-2xl relative shadow-lg">
            <video
              ref={teacherVideoRef}
              autoPlay
              muted={isMuted}
              className="w-full h-full rounded-2xl object-cover"
            />
            <span className="absolute bottom-2 left-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-lg">
              Teacher
            </span>
          </div>

          {/* Students Grid */}
          <div className="grid grid-cols-2 gap-2 flex-none">
            {students.map((student, index) => (
              <div
                key={student.id}
                className="bg-black rounded-xl relative shadow-md h-24"
              >
                <video
                  ref={(el) => (studentVideoRefs.current[index] = el)}
                  autoPlay
                  muted
                  className="w-full h-full rounded-xl object-cover bg-gray-800"
                />
                <span className="absolute bottom-1 left-1 bg-gray-800 text-white text-[10px] px-1 rounded">
                  {student.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Chat */}
        <div className="w-1/3 bg-white rounded-2xl shadow-lg flex flex-col ">
          <div className="p-2 border-b text-indigo-600 font-semibold text-sm">
            Classroom Chat
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2 text-sm">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg max-w-[75%] ${
                  msg.sender === "You"
                    ? "bg-indigo-500 text-white ml-auto"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <span className="font-bold">{msg.sender}: </span>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="p-2 border-t flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border rounded-lg px-2 py-1 text-sm"
            />
            <button
              onClick={handleSend}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 rounded-lg text-sm"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-2 flex justify-center gap-3">
        <button
          onClick={handleEndCall}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full shadow-md text-sm"
        >
          End Call
        </button>
        <button
          onClick={handleToggleMute}
          className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-full shadow-md text-sm"
        >
          {isMuted ? "Unmute" : "Mute"}
        </button>
        <button
          onClick={handleShareScreen}
          className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-full shadow-md text-sm"
        >
          Share Screen
        </button>
      </div>
    </div>
  );
};

export default SkillSwapClassroom;

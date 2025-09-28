import React, { useContext, useEffect, useRef, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CgMenuRight } from "react-icons/cg";
import { RxCross1 } from "react-icons/rx";
function Home() {
  const {userData,serverUrl,setUserData,getGeminiResponse}=useContext(userDataContext)
  const navigate=useNavigate()
  const [listening,setListening]=useState(false)
  const [userText,setUserText]=useState("")
  const [aiText,setAiText]=useState("")
  const isSpeakingRef=useRef(false)
  const recognitionRef=useRef(null)
  const [ham,setHam]=useState(false)
  const isRecognizingRef=useRef(false)
  const synth=window.speechSynthesis
  const [isLoading, setIsLoading] = useState(true)

  const handleLogOut=async ()=>{
    try {
      const result=await axios.get(`${serverUrl}/api/auth/logout`,{withCredentials:true})
      setUserData(null)
      navigate("/signin")
    } catch (error) {
      setUserData(null)
      console.log(error)
    }
  }

  const startRecognition = () => {
    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current?.start();
        console.log("Recognition requested to start");
      } catch (error) {
        if (error.name !== "InvalidStateError") {
          console.error("Start error:", error);
        }
      }
    }
  }

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone permission granted");
      stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
      // Now try to start recognition
      if (recognitionRef.current && !isSpeakingRef.current && !isRecognizingRef.current) {
        recognitionRef.current.start();
      }
    } catch (error) {
      console.error("Microphone permission denied:", error);
    }
  }

  const speak = (text) => {
    // Split into chunks of ~200 characters so long responses don’t fail
    const chunks = text.match(/.{1,200}(\s|$)/g);
  
    if (!chunks) return;
  
    let index = 0;
  
    const speakChunk = () => {
      if (index >= chunks.length) {
        // ✅ Finished all chunks
        setAiText("");
        isSpeakingRef.current = false;
        setTimeout(() => startRecognition(), 800);
        return;
      }
  
      const utterance = new SpeechSynthesisUtterance(chunks[index]);
      utterance.lang = "en-US";
  
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(
        (v) => v.lang === "en-US" || v.lang.startsWith("en")
      );
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
  
      utterance.onend = () => {
        index++;
        speakChunk(); // ⏭️ Speak next chunk
      };
  
      synth.speak(utterance);
    };
  
    synth.cancel(); // Stop anything already speaking
    isSpeakingRef.current = true;
    speakChunk();
  };

  

  const handleCommand=(data)=>{
    const {type, userInput, response}=data
      speak(response);

    if (type === 'google_search') {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, '_blank');
    }
     if (type === 'calculator_open') {

      window.open(`https://www.google.com/search?q=calculator`, '_blank');
    }
     if (type === "instagram_open") {
      window.open(`https://www.instagram.com/`, '_blank');
    }
    if (type ==="facebook_open") {
      window.open(`https://www.facebook.com/`, '_blank');
    }
     if (type ==="weather_show") {
      window.open(`https://www.google.com/search?q=weather`, '_blank');
    }

    if (type === 'youtube_search' || type === 'youtube_play') {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    }

  }

useEffect(() => {
  // Wait for userData to be loaded before setting up speech recognition
  if (!userData || !userData.name || !userData.assistantName) {
    console.log("Waiting for user data to load...");
    setIsLoading(true);
    return;
  }

  console.log("Setting up speech recognition for assistant:", userData.assistantName);
  setIsLoading(false);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.error("Speech recognition not supported in this browser");
    setIsLoading(false);
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.continuous = true;
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  recognitionRef.current = recognition;

  let isMounted = true;
  let recognitionStarted = false;

  const startRecognitionSafely = () => {
    if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current && !recognitionStarted) {
      try {
        recognition.start();
        recognitionStarted = true;
        console.log("Recognition started successfully");
      } catch (e) {
        if (e.name === "NotAllowedError") {
          console.error("Microphone permission denied. Please allow microphone access and refresh the page.");
          setIsLoading(false);
        } else if (e.name === "NotFoundError") {
          console.error("No microphone found. Please check your microphone connection.");
          setIsLoading(false);
        } else if (e.name !== "InvalidStateError") {
          console.error("Recognition start error:", e);
        }
      }
    }
  };

  recognition.onstart = () => {
    isRecognizingRef.current = true;
    setListening(true);
    recognitionStarted = true;
  };

  recognition.onend = () => {
    isRecognizingRef.current = false;
    setListening(false);
    recognitionStarted = false;
    if (isMounted && !isSpeakingRef.current) {
      setTimeout(() => {
        if (isMounted) {
          startRecognitionSafely();
        }
      }, 1000);
    }
  };

  recognition.onerror = (event) => {
    console.warn("Recognition error:", event.error);
    isRecognizingRef.current = false;
    setListening(false);
    recognitionStarted = false;
  
    if (event.error === "network") {
      console.log("SpeechRecognition network issue. Restarting...");
    }
  
    setTimeout(() => {
      if (!isSpeakingRef.current) {
        try {
          recognition.start();
          console.log("Recognition restarted after error");
        } catch (e) {
          console.error("Restart failed:", e);
        }
      }
    }, 1000);
  };
  
  recognition.onresult = async (e) => {
    const transcript = e.results[e.results.length - 1][0].transcript.trim();
    console.log("Heard:", transcript); // Debug log

    if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
      console.log("Assistant name detected:", userData.assistantName);
      setAiText("");
      setUserText(transcript);
      recognition.stop();
      isRecognizingRef.current = false;
      setListening(false);
      recognitionStarted = false;

      try {
        const data = await getGeminiResponse(transcript);
        console.log("API Response:", data);
        handleCommand(data);
        setAiText(data.response);
        setUserText("");
      } catch (error) {
        console.error("Error getting response:", error);
        speak("Sorry, I encountered an error. Please try again.");
        setAiText("Sorry, I encountered an error. Please try again.");
        setUserText("");
      }
    }
  };

  // Play greeting first
  const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, what can I help you with?`);
  greeting.lang = 'en-US'; // Changed to English

  greeting.onstart = () => {
    isSpeakingRef.current = true;
    console.log("Greeting started");
  };

  greeting.onend = () => {
    isSpeakingRef.current = false;
    console.log("Greeting finished, starting recognition");
    // Start recognition after greeting with a small delay
    setTimeout(() => {
      if (isMounted) {
        startRecognitionSafely();
      }
    }, 500);
  };

  window.speechSynthesis.speak(greeting);

  return () => {
    isMounted = false;
    recognition.stop();
    setListening(false);
    isRecognizingRef.current = false;
    recognitionStarted = false;
  };
}, [userData]); // Re-run when userData changes




  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#02023d] flex justify-center items-center flex-col gap-[15px] overflow-hidden'>
      <CgMenuRight className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={()=>setHam(true)}/>
      <div className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start ${ham?"translate-x-0":"translate-x-full"} transition-transform`}>
 <RxCross1 className=' text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={()=>setHam(false)}/>
 <button className='min-w-[150px] h-[60px]  text-black font-semibold   bg-white rounded-full cursor-pointer text-[19px] ' onClick={handleLogOut}>Log Out</button>
      <button className='min-w-[150px] h-[60px]  text-black font-semibold  bg-white  rounded-full cursor-pointer text-[19px] px-[20px] py-[10px] ' onClick={()=>navigate("/customize")}>Customize your Assistant</button>

<div className='w-full h-[2px] bg-gray-400'></div>
<h1 className='text-white font-semibold text-[19px]'>History</h1>

<div className='w-full h-[400px] gap-[20px] overflow-y-auto flex flex-col truncate'>
  {userData.history?.map((his)=>(
    <div className='text-gray-200 text-[18px] w-full h-[30px]  '>{his}</div>
  ))}

</div>

      </div>
      <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold absolute hidden lg:block top-[20px] right-[20px]  bg-white rounded-full cursor-pointer text-[19px] ' onClick={handleLogOut}>Log Out</button>
      <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold  bg-white absolute top-[100px] right-[20px] rounded-full cursor-pointer text-[19px] px-[20px] py-[10px] hidden lg:block ' onClick={()=>navigate("/customize")}>Customize your Assistant</button>
      <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg'>
<img src={userData?.assistantImage} alt="" className='h-full object-cover'/>
      </div>
      <h1 className='text-white text-[18px] font-semibold'>I'm {userData?.assistantName}</h1>

      {/* Visual indicator for listening state */}
      <div className={`w-[200px] h-[200px] rounded-full transition-all duration-300 ${
        listening ? 'bg-green-500 shadow-lg shadow-green-500/50' :
        aiText ? 'bg-blue-500' : 'bg-gray-500'
      }`}>
        {listening && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
          </div>
        )}
      </div>

      {/* Status text */}
      <div className='text-white text-[18px] font-semibold text-center min-h-[50px] flex items-center'>
        {isLoading ? (
          <span className='text-yellow-400'>⏳ Loading assistant...</span>
        ) : listening ? (
          <span className='text-green-400'>🎤 Listening...</span>
        ) : userText ? (
          userText
        ) : aiText ? (
          aiText
        ) : (
          <div className='flex flex-col items-center gap-2'>
            <span className='text-gray-400'>
              {userData?.assistantName ?
                `Say "${userData.assistantName}" to start` :
                'Speech recognition not supported in this browser'
              }
            </span>
            {!isLoading && userData?.assistantName && (
              <button
                onClick={requestMicrophonePermission}
                className='px-4 py-2 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 transition-colors'
              >
                🎤 Enable Microphone
              </button>
            )}
          </div>
        )}
      </div>
      
    </div>
  )
}

export default Home
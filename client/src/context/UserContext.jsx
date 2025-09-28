import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'
export const userDataContext=createContext()
function UserContext({children}) {
    const serverUrl = import.meta.env.VITE_SERVER_URL || ""
    const [userData,setUserData]=useState(null)
    const [frontendImage,setFrontendImage]=useState(null)
     const [backendImage,setBackendImage]=useState(null)
     const [selectedImage,setSelectedImage]=useState(null)
    const handleCurrentUser=async ()=>{
        try {
            const base = serverUrl ? serverUrl : ""
            const result=await axios.get(`${base}/api/user/current`,{withCredentials:true})
            setUserData(result.data)
            console.log(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getGeminiResponse=async (command)=>{
try {
  console.log("Making API call to:", `${serverUrl}/api/user/asktoassistant`);
  console.log("Command being sent:", command);
  const base = serverUrl ? serverUrl : ""
  const result=await axios.post(`${base}/api/user/asktoassistant`,{command},{withCredentials:true})
  console.log("API Response received:", result.data);
  return result.data
} catch (error) {
  console.error("API Error:", error);
  console.error("Error response:", error.response?.data);
  console.error("Error status:", error.response?.status);
  throw error; // Re-throw so the calling code can handle it
}
    }

    useEffect(()=>{
handleCurrentUser()
    },[])
    const resetImageSelection = () => {
        setSelectedImage(null)
        setFrontendImage(null)
        setBackendImage(null)
    }

    const value={
serverUrl,userData,setUserData,backendImage,setBackendImage,frontendImage,setFrontendImage,selectedImage,setSelectedImage,getGeminiResponse,resetImageSelection
    }
  return (
    <div>
    <userDataContext.Provider value={value}>
      {children}
      </userDataContext.Provider>
    </div>
  )
}

export default UserContext

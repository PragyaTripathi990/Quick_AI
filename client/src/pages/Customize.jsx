import React, { useContext, useRef, useState } from 'react'
import Card from '../components/Card'
import { RiImageAddLine } from "react-icons/ri";
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { MdKeyboardBackspace } from "react-icons/md";
function Customize() {
  const {serverUrl,userData,setUserData,backendImage,setBackendImage,frontendImage,setFrontendImage,selectedImage,setSelectedImage}=useContext(userDataContext)
  const navigate=useNavigate()
     const inputImage=useRef()

     const handleImage=(e)=>{
const file=e.target.files[0]
setBackendImage(file)
setFrontendImage(URL.createObjectURL(file))
     }
  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px] '>
        <MdKeyboardBackspace className='absolute top-[30px] left-[30px] text-white cursor-pointer w-[25px] h-[25px]' onClick={()=>navigate("/")}/>
        <h1 className='text-white mb-[40px] text-[30px] text-center '>Select your <span className='text-blue-200'>Assistant Image</span></h1>
        <div className='w-full max-w-[900px] flex justify-center items-center flex-wrap gap-[15px]'>
      <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-gray-500 rounded-2xl cursor-pointer hover:shadow-2xl hover:shadow-gray-950 hover:border-2 hover:border-white ${selectedImage=="gray"?"border-4 border-white shadow-2xl shadow-gray-950 ":null}`} onClick={()=>setSelectedImage("gray")}></div>
       <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-blue-500 rounded-2xl cursor-pointer hover:shadow-2xl hover:shadow-blue-950 hover:border-2 hover:border-white ${selectedImage=="blue"?"border-4 border-white shadow-2xl shadow-blue-950 ":null}`} onClick={()=>setSelectedImage("blue")}></div>
        <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-green-500 rounded-2xl cursor-pointer hover:shadow-2xl hover:shadow-green-950 hover:border-2 hover:border-white ${selectedImage=="green"?"border-4 border-white shadow-2xl shadow-green-950 ":null}`} onClick={()=>setSelectedImage("green")}></div>
         <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-red-500 rounded-2xl cursor-pointer hover:shadow-2xl hover:shadow-red-950 hover:border-2 hover:border-white ${selectedImage=="red"?"border-4 border-white shadow-2xl shadow-red-950 ":null}`} onClick={()=>setSelectedImage("red")}></div>
          <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-yellow-500 rounded-2xl cursor-pointer hover:shadow-2xl hover:shadow-yellow-950 hover:border-2 hover:border-white ${selectedImage=="yellow"?"border-4 border-white shadow-2xl shadow-yellow-950 ":null}`} onClick={()=>setSelectedImage("yellow")}></div>
           <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-purple-500 rounded-2xl cursor-pointer hover:shadow-2xl hover:shadow-purple-950 hover:border-2 hover:border-white ${selectedImage=="purple"?"border-4 border-white shadow-2xl shadow-purple-950 ":null}`} onClick={()=>setSelectedImage("purple")}></div>
            <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-pink-500 rounded-2xl cursor-pointer hover:shadow-2xl hover:shadow-pink-950 hover:border-2 hover:border-white ${selectedImage=="pink"?"border-4 border-white shadow-2xl shadow-pink-950 ":null}`} onClick={()=>setSelectedImage("pink")}></div>
     <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#020220] border-2 border-[#0000ff66] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white flex items-center justify-center ${selectedImage=="input"?"border-4 border-white shadow-2xl shadow-blue-950 ":null}` } onClick={()=>{
        inputImage.current.click()
        setSelectedImage("input")
     }}>
        {!frontendImage &&  <RiImageAddLine className='text-white w-[25px] h-[25px]'/>}
        {frontendImage && <img src={frontendImage} className='h-full object-cover'/>}
    
    </div>
    <input type="file" accept='image/*' ref={inputImage} hidden onChange={handleImage}/>
      </div>
{selectedImage && <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold cursor-pointer  bg-white rounded-full text-[19px] ' onClick={()=>navigate("/customize2")}>Next</button>}
      
    </div>
  )
}

export default Customize

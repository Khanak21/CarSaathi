import React, { useEffect, useState } from 'react';
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
const BookCard = ({ booking ,driverid,name,phone,setCurrentChat,currentChat}) => {
  const today = new Date();
  const bookDate = new Date(booking.Date);
  const textColorClass = bookDate < today ? 'text-red-900' : 'text-green-900';
  const navigate = useNavigate()
  console.log(driverid);

  const handleMessageClick = ()=>{
      const getConversation = async()=>{
          try{
              const res= await axios.get("http://localhost:3001/api/conversation/getConversation/" + booking.Bookingperson);
              let conversations = res.data 
              // console.log(conversations)

              // Find if conversation with the driver already exists
              let chatExists = conversations?.find(conversation => conversation.members.includes(booking.Driver));
              //console.log(chatExists)
              
              if(chatExists){
                  setCurrentChat(chatExists)  
                  if (currentChat) {
                    navigate("/messenger");
                  }
              }else{
               const res= await axios.post("http://localhost:3001/api/conversation/",{senderId:booking.Bookingperson,receiverId:booking.Driver});
               console.log(res.data)
               setCurrentChat(res.data)
               navigate("/messenger");
              }
          }catch(err){
             console.log(err)
          }
      }
      getConversation()
  }

  const userprofile=()=>{
    navigate(`/profile/${driverid}`)
  }

    return (
  <div
  className={` border border-gray-300 rounded-md p-4 transition-transform duration-500 ease-in-out transform hover:scale-105 ${textColorClass} ${
    textColorClass === "text-green-900" ? "bg-green-200" : "bg-red-200"
  }`}
  >
    <div className="flex justify-between items-center mb-4">
      <div>
        <p>Source: {booking.source}</p>
        <p>Destination: {booking.destination}</p>
      </div>
      <p>Fare: {booking.fare}</p>
    </div>
    <div className="flex justify-between items-center mb-4">
      <div>
        <p>Seats: {booking.NoofBookedSeats}</p>
        <button onClick={() => userprofile()}>
  <FontAwesomeIcon icon={faUser} className="mr-2" />
   Driver's Profile
</button>
      </div>
      <div>
        <p>Driver's Name: {name}</p>
        <p>Date of travelling: {new Date(booking.Date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>
    </div>
    {/* {textColorClass === "text-green-900" ? ( */}
        <div className="flex justify-end">
          <button className="bg-red-500 text-white rounded-md px-4 py-2 mr-2 hover:bg-red-600">
            Delete Trip
          </button>
          <button className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600" onClick={handleMessageClick}>
            Message Driver
          </button>
        </div>
      {/* ) : ( */}
        {/* <div></div> */}
      {/* )} */}
  </div>
);
};
export default BookCard;
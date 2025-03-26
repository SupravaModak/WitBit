import { useEffect, useRef, useState } from "react";
import Chatboticon from "./components/Chatboticon";
import ChatForm from "./components/ChatForm";
import ChatMessage from "./components/ChatMessage";
import { companyInfo } from "./companyInfo";
const App = () => {
  const [chatHistory, setChatHistory]= useState([
    {
    hideInChat : true,
    role :"model",
    text :companyInfo
  }]);
  const [showChatbot, setShowChatbot]= useState([false]);
  const chatBodyRef=useRef();
  const generateBotResponse = async(history) => {
    const updateHistory =(text)=>{
      setChatHistory((prev) => [
          ...prev.filter((msg) => msg.text !== "Thinking..."),
          { role: "model", text }, 
      ]);
      };
      
    history=history.map(({role,text})=>({role,parts:[{text}]}));
    const requestOptions ={
      method: "POST", 
      headers:{"Content-Type": "application/json"},
      body: JSON.stringify({contents: history}),
    };

    try{
      const response=await fetch(import.meta.env.VITE_WITBIT_API_URL, requestOptions);
      const data = await response.json();
      if(!response.ok) throw new Error(data.error.message || "Oops! Something is wrong");
      const apiResponseText=data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
      updateHistory(apiResponseText);
    } catch(error){
      console.log(error);
    }
  };
  
  useEffect(() =>{
    chatBodyRef.current.scrollTo({top:chatBodyRef.current.scrollHeight, behavior: "smooth"});
  }, [chatHistory]);
  return (
    <div className={`container ${showChatbot ? "show-chatbot" : ""} `}>
      <button onClick={() => setShowChatbot((prev) => !prev)} id="chatbot-toggler">
        <span className="material-symbols-rounded">mode_comment</span>
        <span className="material-symbols-rounded">close</span>
      </button>
      <div className="chatbot-popup">
        <div className="chat-header">
          <div className="header-info">
            <Chatboticon />
            <h2 className="logo-text">WitBit</h2>
          </div>
          <button onClick={() => setShowChatbot((prev) => !prev)} className="material-symbols-rounded">
            keyboard_arrow_down
          </button>
        </div>
        
        <div ref={chatBodyRef}className="chat-body">
          <div className="message bot-message">
            <Chatboticon></Chatboticon>
            <p className="message-text">
              Hey there geek! <br></br> How can I help you today?
            </p>
          </div>
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat= {chat}></ChatMessage>
          ))}
        </div>
        
        <div className="chat-footer">
          <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse}></ChatForm>
        </div>       
      </div>
    </div>
  );
};

export default App;
import { error } from "console";
import { useState } from "react"
const ChatBot = () => {
    const[input,setInput]=useState<string>("");
    const[resp,setResp]=useState<string | null>(null);
    const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=> {
        setInput(e.target.value)
    }
    const handleSubmit=async()=>{
        try {
              const response=await fetch('')
              if(!response.ok){
                throw new Error(`Server error ${response.status}`);
              }
   const data= await response.json();
   setResp(data);
        } catch (error) {
            console.error("Error analyzing image:", error);
           alert("Failed to analyze image. Please try again.");
            
        }
 


    }
  return (
    <div className="container w-[100px] h-[300px] bg-amber-700">
          <div>
              <div>
                  <p>Enter text:</p>
                  <input type="text"
                      value={input}
                      onChange={handleChange} />

              </div>
              <button onClick={handleSubmit}></button>
          </div>

          {resp && (
            <div className="m-top:10px">
                <strong>Response:</strong> {resp}
            </div>
          )}
        
       
        


    </div>
  )
}

export default ChatBot
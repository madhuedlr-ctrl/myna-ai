"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Home() {

const [prompt,setPrompt] = useState("");
const [messages,setMessages] = useState<any[]>([]);
const [loading,setLoading] = useState(false);
const [intro,setIntro] = useState(true);

const chatEndRef = useRef<HTMLDivElement>(null);

useEffect(()=>{
  const timer=setTimeout(()=>setIntro(false),2500);
  return ()=>clearTimeout(timer);
},[]);

useEffect(()=>{
chatEndRef.current?.scrollIntoView({behavior:"smooth"});
},[messages]);

async function askAI(){

if(!prompt.trim()) return;

const newMessages=[...messages,{role:"user",content:prompt}];

setMessages(newMessages);
setPrompt("");
setLoading(true);

try{

const res = await fetch("/api/chat",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({messages:newMessages})
});

const data = await res.json();

const aiMsg={role:"assistant",content:data.reply};

setMessages([...newMessages,aiMsg]);

}catch(err){
console.error(err);
}

setLoading(false);

}

function handleKey(e:any){
if(e.key==="Enter"){
askAI();
}
}

function copyText(text:string){
navigator.clipboard.writeText(text);
}

if(intro){

return(

<div className="min-h-screen flex items-center justify-center text-white relative overflow-hidden">

<div className="starfield"></div>

<div className="absolute w-[600px] h-[600px] bg-purple-600 opacity-20 blur-[200px]"></div>
<div className="absolute w-[500px] h-[500px] bg-blue-600 opacity-20 blur-[200px] right-0 bottom-0"></div>

<div className="text-center z-10">

<motion.div
initial={{scale:0.8,opacity:0}}
animate={{scale:1,opacity:1}}
transition={{duration:1}}
className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text"
>
MYNA
</motion.div>

<div className="mt-4 text-gray-400 text-lg">
Initialized with Intelligence...
</div>

</div>

</div>

);

}

return(

<div className="min-h-screen text-white flex relative">

<div className="starfield"></div>

{/* SIDEBAR */}

<div className="w-[260px] border-r border-white/10 backdrop-blur-xl p-6 relative z-10">

<div className="flex items-center gap-3 mb-8">

<div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold">
MN
</div>

<div>
<div className="font-semibold">MYNA</div>
<div className="text-xs text-gray-400">AI Assistant</div>
</div>

</div>

<div className="text-sm text-gray-400">
Chat History
</div>

<div className="mt-4 space-y-2">

<div className="bg-white/5 p-3 rounded-lg text-sm">
New Conversation
</div>

</div>

</div>


{/* MAIN CHAT */}

<div className="flex flex-col flex-1 relative z-10">

{/* HEADER */}

<div className="h-[70px] flex items-center px-10 border-b border-white/10 backdrop-blur-xl">

<div>

<div className="text-lg font-semibold">
MYNA
</div>

<div className="text-xs text-gray-400">
Built with beauty and brain.
</div>

</div>

</div>


{/* CHAT AREA */}

<div className="flex-1 overflow-y-auto px-6 py-10">

<div className="max-w-3xl mx-auto">

{messages.map((msg,i)=>(

<motion.div
key={i}
initial={{opacity:0,y:20}}
animate={{opacity:1,y:0}}
className={`flex mb-6 ${
msg.role==="user" ? "justify-end" : "justify-start"
}`}
>

{msg.role==="assistant" && (

<div className="flex gap-3">

<div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-sm font-bold">
MN
</div>

<div className="bg-white/5 backdrop-blur-xl px-5 py-4 rounded-2xl border border-white/10 max-w-[600px] text-gray-200">

<ReactMarkdown
remarkPlugins={[remarkGfm]}
components={{

p({children}) {
return <div className="mt-2">{children}</div>
},

code({ children } : any) {

if (inline) {
return (
<code className="bg-black/40 px-1 py-0.5 rounded">
{children}
</code>
)
}

return (
<pre className="bg-black/60 p-4 rounded-xl overflow-x-auto mt-3 text-sm">
<code>{children}</code>
</pre>
)

}

}}
>
{msg.content}
</ReactMarkdown>

<button
onClick={()=>copyText(msg.content)}
className="text-xs text-gray-400 mt-3 hover:text-white"
>
Copy
</button>

</div>

</div>

)}

{msg.role==="user" && (

<div className="bg-gradient-to-r from-purple-500 to-blue-500 px-5 py-4 rounded-2xl max-w-[600px]">
{msg.content}
</div>

)}

</motion.div>

))}

{loading && (

<div className="flex gap-3">

<div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-sm font-bold">
M
</div>

<div className="bg-white/5 px-4 py-3 rounded-xl flex gap-2 backdrop-blur-xl border border-white/10">

<div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
<div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></div>
<div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></div>

</div>

</div>

)}

<div ref={chatEndRef}></div>

</div>

</div>


{/* INPUT */}

<div className="border-t border-white/10 p-6 backdrop-blur-xl">

<div className="max-w-3xl mx-auto flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10">

<input
autoFocus
className="flex-1 bg-transparent outline-none text-gray-200 placeholder-gray-400"
placeholder="Ask MYNA anything..."
value={prompt}
onChange={(e)=>setPrompt(e.target.value)}
onKeyDown={handleKey}
/>

<button
onClick={askAI}
className="bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-2 rounded-lg font-medium hover:opacity-90"
>
Send
</button>

</div>

</div>

</div>

</div>

);

}
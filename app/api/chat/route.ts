import Groq from "groq-sdk";

export async function POST(req: Request) {

const { messages } = await req.json();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const chat = await groq.chat.completions.create({

model: "llama-3.3-70b-versatile",

messages: [
{
role:"system",
content:`
You are MYNA, an intelligent AI assistant created by Madhu.

Personality:
• intelligent and calm
• futuristic tone
• helpful and precise

Rules:
• answer clearly and accurately
• explain technical things step-by-step
• keep responses structured
• behave like an advanced AI system
`
},
...messages
],

temperature:0.7,
max_tokens:800

});

return Response.json({
reply: chat.choices[0].message.content
});

}
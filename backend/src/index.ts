require("dotenv").config()

import Groq from "groq-sdk";
import { BASE_PROMPT, getSystemPrompt } from "./prompts";
import express from "express"
import { basePrompt as nodeBasePrompt } from "./defautls/node";
import { basePrompt as reactBasePrompt } from "./defautls/react";
import cors from "cors"



const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const app=express()
app.use(express.json())
app.use(cors())

app.post('/template', async (req, res)=>{
  console.log("POST /template ", (new Date()).toLocaleTimeString())
  const prompt=req.body.prompt
  
  const response = await groq.chat.completions.create({
    messages: [
      {
        role:"system",
        content: `Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra `
      },
      {
        role: "user",
        content: prompt
      },
    ],
    model: "openai/gpt-oss-20b",
    max_completion_tokens: 200,
  });
  
  const answer = (await response).choices[0].message.content; // react or node
  if (answer == "react") {
    res.json({
      prompts: [BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
      uiPrompts: [reactBasePrompt]
    })
    return;
  }
  
  if (answer === "node") {
    res.json({
      prompts: [`Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
      uiPrompts: [nodeBasePrompt]
    })
    return;
  }
  
  res.status(403).json({message:"You can't access this."})
  
})

app.post('/chat', async(req,res)=>{
  console.log("POST /chat ", (new Date()).toLocaleTimeString())
  const messages=req.body.messages

  const response = await groq.chat.completions.create({
    messages: [ {"role":"system", "content": getSystemPrompt()}, ...messages],
    model: "openai/gpt-oss-20b",
    max_completion_tokens: 7500,
  });
  console.log(response.choices[0].message.content)
  res.json(response.choices[0].message.content)
})



app.listen(3000,()=>{
  console.log("app is listening on port 3000")
})
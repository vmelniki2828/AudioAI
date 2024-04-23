import React, { useEffect, useState } from 'react';
import OpenAI from 'openai';

export const Auddio = () => {
  const [transcription, setTranscription] = useState('');
  const [mainAssistant, setMainAssistant] = useState();
  const [mainMessage, setMainMessage] = useState();
  const [file, setFile] = useState();

  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_API_AI_KEY,
    dangerouslyAllowBrowser: true,
  });

  const assistant = async () => {
    const res = await openai.beta.assistants.retrieve(
      process.env.REACT_APP_ASSISTANT_AI_KEY
    );
    setMainAssistant(res);
  };

  useEffect(() => {
    assistant();
    console.log(mainAssistant);
  }, []);

  useEffect(() => {
    console.log(mainMessage);
  }, [mainMessage]);

  const checkRunStatus = async (threadId, runId) => {
    let completed = false;
    while (!completed) {
      const lastRun = await openai.beta.threads.runs.retrieve(threadId, runId);
      console.log(lastRun);

      if (lastRun.status === 'completed') {
        completed = true;
        const allMessages = await openai.beta.threads.messages.list(threadId);
        setMainMessage(allMessages);
      } else if (lastRun.status === 'requires_action') {
        console.log(lastRun.required_action.submit_tool_outputs.tool_calls[0].id)
        
        const toolCalls = lastRun.required_action.submit_tool_outputs.tool_calls;
        const toolOutputs = toolCalls.map(toolCall => ({
          output: "true",
          tool_call_id: toolCall.id,
        }));
        
        const run = await openai.beta.threads.runs.submitToolOutputs(
          threadId,
          runId,
          { tool_outputs: toolOutputs }
        );
        console.log('Ya tut zastyal');
      } else {
        console.log('Запуск еще не завершен.');
        // Ждем некоторое время перед повторной проверкой статуса
        await new Promise(resolve => setTimeout(resolve, 5000)); // ждем 5 секунд
      }
    }
  };

  const textToAssistant = async () => {

    const run = await openai.beta.threads.createAndRun({
      assistant_id: mainAssistant.id,
      thread: {
        messages: [
          { role: "user", content: transcription },
        ],
      },
    });
    console.log(run);

    await checkRunStatus(run.thread_id, run.id);


  };

  const handleFileChange = async event => {
    const transcription = await openai.audio.transcriptions.create({
      file,
      model: 'whisper-1',
    });
    setTranscription(transcription.text);
    console.log(transcription.text);
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 20,
        color: '#010101',
      }}
    >
        <>Audio</>
      <input
        type="file"
        accept="audio/*"
        onChange={e => {
          const selectedFile = e.target.files[0];
          setFile(selectedFile);
          console.log(selectedFile);
        }}
      />
      <button onClick={() => handleFileChange()}>transcriptions</button>
      {transcription && <p>{transcription}</p>}
      <button onClick={() => textToAssistant()}>analis</button>
      {mainMessage && <p>{mainMessage?.data[0]?.content[0]?.text?.value}</p>}
    </div>
  );
};

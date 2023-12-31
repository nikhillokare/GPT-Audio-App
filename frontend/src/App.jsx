import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Artyom from 'artyom.js';

const artyom = new Artyom();

const options = {
  continuous: true
};

function App() {
  const [gptReply, setGptReply] = useState("");
  const [listening, setListening] = useState(false);

  const {
    resetTranscript,
    browserSupportsSpeechRecognition,
    finalTranscript
  } = useSpeechRecognition();

  useEffect(() => {
    if (finalTranscript !== "") {
      getResponse(finalTranscript);
    }
  }, [finalTranscript]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Your Browser doesn't support speech recognition.</span>;
  }

  const startListeningAtPress = () => {
    setListening(true);
    SpeechRecognition.startListening(options);
  };

  const getResponse = async (text) => {
    setListening(false); // Stop showing "Listening..." text when response is received
    await axios.post("https://gpt-audio-web-app-egem.onrender.com/api/voice",
      {
        text: text
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      }
    ).then(({ data }) => {
      setGptReply(data.result.message.content);
      artyom.say(data.result.message.content);
    }).then(() => {
      resetTranscript();
    });
  };

  return (
    <div className="App">
      <div className="main">
        <p>{listening ? 'Listening...' : 'Tap To Speak'}</p>
        <button onClick={startListeningAtPress}>Tap Here</button>
        <p>{finalTranscript}</p>
        {gptReply && <p>{gptReply}</p>}
      </div>
    </div>
  );
}

export default App;

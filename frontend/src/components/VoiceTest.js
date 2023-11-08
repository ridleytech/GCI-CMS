import { useEffect, useRef, useState } from "react";
import useSocket from "../hooks/useSocket.tsx";
import useVoice from "../hooks/useVoice.tsx";
import { useDispatch } from "react-redux";

function VoiceTest() {
  const initialized = useRef(false);
  const [isIncoming, setisIncoming] = useState(true);

  const socket = useSocket(isIncoming, setisIncoming);
  const voice = useVoice(socket, isIncoming, setisIncoming);
  const dispatch = useDispatch();

  const dialList = ["7348901810", "3132416387"];
  const [callIndex, setCallIndex] = useState(0);

  useEffect(() => {
    // console.log("init");

    if (!initialized.current) {
      initialized.current = true;
      // getTemplates();

      dispatch({
        type: "UPDATE_CLIENT_NAME",
        payload: { clientName: "RandallRidley" },
      });
    }
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 0 }}>
        <h1>Voice Test</h1>
      </div>

      {!voice.device ? (
        <button
          style={{ marginBottom: 10 }}
          onClick={() => voice.createDevice()}
        >
          Start Session
        </button>
      ) : null}

      {isIncoming && socket.currentCall ? (
        <>
          <div style={{ marginBottom: 10 }}>
            Incoming Call: {socket.currentCall.From}
          </div>
          <div>
            {voice.currentVoiceCall ? (
              <>
                {/* <button
                  style={{ marginRight: 10 }}
                  onClick={() => manageCall("ignore")}
                >
                  Ignore
                </button> */}
                <button onClick={() => voice.endCall()}>End</button>
              </>
            ) : (
              <button
                style={{ marginRight: 10 }}
                onClick={() => voice.manageCall("answer")}
              >
                Answer
              </button>
            )}
          </div>
        </>
      ) : null}

      {!isIncoming && voice.currentVoiceCall ? (
        <>
          <div style={{ marginBottom: 10 }}>
            Outgoing Call: {voice.currentVoiceCall.customParameters.get("To")}
          </div>
          <div>
            {voice.currentVoiceCall ? (
              <>
                <button onClick={() => voice.endCall()}>End</button>
              </>
            ) : null}
          </div>
        </>
      ) : null}

      {voice.device && !voice.currentVoiceCall && !socket.currentCall ? (
        <div>
          <button style={{ marginRight: 10 }} onClick={() => voice.makeCall()}>
            Make Call
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default VoiceTest;

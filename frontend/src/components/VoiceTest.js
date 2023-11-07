import { useEffect, useRef, useState } from "react";
import useSocket from "../hooks/useSocket.tsx";
import useVoice from "../hooks/useVoice.tsx";
import { useDispatch } from "react-redux";

function VoiceTest() {
  const initialized = useRef(false);
  const socket = useSocket();
  const voice = useVoice(socket);
  const dispatch = useDispatch();

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

      {socket.currentCall ? (
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
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default VoiceTest;

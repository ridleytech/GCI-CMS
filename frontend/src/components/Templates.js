import { useEffect, useRef, useState } from "react";
import NavBar from "./NavBar.js";
import { Device } from "@twilio/voice-sdk";
// import initTwilioDevice from "./twilio";
import useSocket from "../hooks/useSocket.tsx";

function Templates() {
  const [templates, settemplates] = useState();
  const tempTxt = useRef();
  const initialized = useRef(false);
  const [token, settoken] = useState("");
  const [selected, setSelected] = useState();
  const socket = useSocket(token);

  useEffect(() => {
    // console.log("init");

    if (!initialized.current) {
      initialized.current = true;
      // getTemplates();
      getToken();
    }
  }, []);

  useEffect(() => {
    const clearSelected = () => {
      // console.log("click", selected);

      // const deviceOptions = {
      //   edge: 'ashburn',
      //   sounds: {
      //     incoming: 'http://mysite.com/incoming.mp3',
      //     outgoing: 'http://mysite.com/outgoing.mp3',
      //     dtmf8: 'http://mysite.com/8_button.mp3'
      //   }
      // }
      console.log("set new device");

      const newDevice = new Device(token);
      // newDevice.register();
      socket.setdevice(newDevice);
      try {
        socket.device.register();
        console.log("device register");
      } catch (error) {
        console.log("device register error", error);
      }
      setSelected(null);
    };
    window.addEventListener("click", clearSelected);
    return () => window.removeEventListener("click", clearSelected);
  }, []);

  useEffect(() => {
    if (token) {
      // console.log("token", token);
    }
  }, [token]);

  const getToken = async () => {
    const token = await fetch("http://localhost:3001/calls/getToken/")
      .then((data) => {
        //console.log("data", data.json());

        return data.json();
      })
      .then((json) => {
        // console.log("json", json);

        return json;
      });

    // console.log("token", token);

    // device.setup(token);

    settoken(token.token);

    // Twilio.Device.setup(token);

    // Twilio.Device.incoming((conn) => {
    //   conn.accept;
    // });
  };

  const answerCall1 = async () => {
    const temps = await fetch("http://localhost:3001/calls/answerCall/", {
      data: socket.currentCall,
    })
      .then((data) => {
        console.log("answerCall data", data);

        // return data.json();
      })
      .then((json) => {
        // console.log("json", json);

        return json;
      })
      .catch((e) => {
        console.log("answer call error", e);
      });
  };

  const getTemplates = async () => {
    // console.log("getTemplates");
    const temps = await fetch("http://localhost:3001/users/templates/")
      .then((data) => {
        //console.log("data", data.json());

        return data.json();
      })
      .then((json) => {
        // console.log("json", json);

        return json;
      });

    // console.log("temps", temps);

    settemplates(temps);
  };

  const renderTemplate = (temp) => {
    // console.log("temp", temp);

    tempTxt.current.value = temp.htmlBody;
  };

  return (
    <div style={{ padding: 20 }}>
      <NavBar />

      <div style={{ marginBottom: 0 }}>
        <h1>Templates</h1>
      </div>
      {templates
        ? templates.map((template) => {
            return (
              <div
                key={template.name}
                id={template.id}
                onClick={() => renderTemplate(template)}
              >
                {template.name}
              </div>
            );
          })
        : null}
      <textarea
        className="templateArea"
        ref={tempTxt}
        style={{ width: "100%", minHeight: 200, marginTop: 20 }}
      ></textarea>

      <button onClick={() => socket.startDevice()}>Answer call</button>
      <button>End call</button>

      {socket.currentCall ? (
        <div>Call: {socket.currentCall.CallSid}</div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default Templates;

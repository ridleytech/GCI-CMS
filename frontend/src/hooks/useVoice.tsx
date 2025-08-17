import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Device } from "@twilio/voice-sdk";

function useVoice(socket, isIncoming, setisIncoming) {
  const initialized = useRef(false);
  const [token, settoken] = useState("");
  const [device, setdevice] = useState(null);
  const [currentVoiceCall, setcurrentVoiceCall] = useState(null);
  const [answerStatus, setanswerStatus] = useState();
  const [deviceStarted, setdeviceStarted] = useState(false);
  const clientName = useSelector((state) => state.clientName);

  useEffect(() => {
    // console.log("init");

    if (!initialized.current) {
      initialized.current = true;
      // getTemplates();
      getToken();
    }
  }, []);

  useEffect(() => {
    if (currentVoiceCall) {
      console.log("currentVoiceCall", currentVoiceCall);

      currentVoiceCall.on("disconnect", (call) => {
        console.log("The call has been disconnected.");
        setcurrentVoiceCall(null);
      });
    }
  }, [currentVoiceCall]);

  useEffect(() => {
    if (device) {
      console.log("device set", device);

      device.on("incoming", (call) => {
        // console.log("incoming call", call);

        call.accept({
          rtcConfiguration: {
            sdpSemantics: "unified-plan",
          },
          // Other options
        });

        // call.reject();

        setcurrentVoiceCall(call);
      });

      device.on("registered", (device) => {
        console.log("The device is ready to receive incoming calls.");
        // window.removeEventListener("click", clearSelected);
      });

      device.on("registering", (device) => {
        console.log("The device is registering.");
      });

      device.on("error", (twilioError, call) => {
        console.log("An error has occurred: ", twilioError);
      });

      device.on("tokenWillExpire", () => {
        console.log("tokenWillExpire");

        // const token = getNewTokenViaAjax();
        // device.updateToken(token);
      });

      if (!deviceStarted) {
        startDevice();
      }
      setdeviceStarted(true);
    }
  }, [device]);

  // useEffect(() => {
  //   if (deviceStarted) {
  //     startDevice();
  //   }
  // }, [deviceStarted]);

  useEffect(() => {
    if (token) {
      // console.log("token", token);
      // window.addEventListener("click", clearSelected);
      // window.addEventListener("click", clearSelected);
      // return () => window.removeEventListener("click", clearSelected);
    }
  }, [token]);

  // window.addEventListener("click", clearSelected);

  const getToken = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      clientName: "RandallRidley",
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const token = await fetch(
      "http://localhost:3001/calls/getToken/",
      requestOptions
    )
      .then((data) => {
        //console.log("data", data.json());

        return data.json();
      })
      .then((json) => {
        // console.log("json", json);

        return json;
      });

    settoken(token.token);
  };

  const startDevice = () => {
    // console.log("Registering the device to receive calls.");

    try {
      device.register();
    } catch (error) {
      console.log("register error", error);
    }
  };

  const manageCall = async (status) => {
    setanswerStatus(status);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      data: socket.currentCall,
      answerStatus: status,
      clientName: "RandallRidley",
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    await fetch("http://localhost:3001/calls/answerCall/", requestOptions)
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

  const endCall = async () => {
    currentVoiceCall.disconnect();
    setcurrentVoiceCall(null);
  };

  const makeCall = async () => {
    var params = {
      To: "+17348901810",
      aCustomParameter: "the value of your custom parameter",
    };

    const call = await device.connect({ params });

    setcurrentVoiceCall(call);
    setisIncoming(false);

    // console.log(call.parameters);

    // PRINTS:
    // {}

    // For outgoing calls, the "accept" event is emitted when the Call's media session has finished setting up.
    call.on("accept", () => {
      console.log("make call accept", call.parameters);
    });
  };

  const createDevice = () => {
    if (!device) {
      const newDevice = new Device(token, {
        enableImprovedSignalingErrorPrecision: true,
      });
      // console.log("set new device1", token);
      // console.log("device", newDevice);

      // newDevice.register();
      setdevice(newDevice);
    }

    // setSelected(null);
  };
  // const rejectCall = () => {
  //   currentVoiceCall.reject();
  // };

  // const ignoreCall = () => {
  //   currentVoiceCall.ignore();
  // };
  return {
    token,
    device,
    currentVoiceCall,
    deviceStarted,
    clientName,
    createDevice,
    manageCall,
    endCall,
    makeCall,
  };
}

export default useVoice;

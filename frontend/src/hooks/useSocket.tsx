// import { K } from "handlebars";
import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

export default function useSocket() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState([]);
  const [calls, setcalls] = useState([]);
  const [currentCall, setcurrentCall] =
    useState();
    // { CallSid: "1111" }

  useEffect(() => {
    function onConnect() {
      // console.log("onConnect");

      setIsConnected(true);
    }

    function onDisconnect() {
      // console.log("onDisconnect");
      setIsConnected(false);
    }

    function onFooEvent(value) {
      console.log("onFooEvent");

      setFooEvents((previous) => [...previous, value]);
    }

    function callComing(value) {
      if (value.data.CallStatus == "ringing") {
        // console.log("callComing", value);
        setcurrentCall(value.data);
        setcalls((previous) => [...previous, value]);
      } else {
        setcalls([]);
        setcurrentCall(null);
      }
    }

    socket.on("connect", onConnect);
    socket.on("callComing", callComing);
    socket.on("disconnect", onDisconnect);
    socket.on("foo", onFooEvent);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("foo", onFooEvent);
      socket.off("callComing", callComing);
    };
  }, []);

  useEffect(() => {
    if (currentCall) {
      console.log("currentCall", currentCall);
    }
  }, [currentCall]);

  useEffect(() => {
    if (calls.length) {
      // console.log("calls", calls);
    }
  }, [calls]);

  return {
    isConnected,
    fooEvents,
    currentCall,
  };
}

import { useEffect, useRef } from "react";

const useSSE = (onUpdate) => {
  const eventSourceRef = useRef(null);
  const retryTimeoutRef = useRef(null);

  useEffect(() => {
    const connect = () => {
      if (eventSourceRef.current) {

        eventSourceRef.current.close();
      }
      // console.log(`${import.meta.env.VITE_API_URL}/sse`)
      // const es = new EventSource(`${import.meta.env.VITE_API_URL}/sse`);
      const es = new EventSource(`http://localhost:8080/sse`);
      eventSourceRef.current = es;

      es.onopen = () => {
        console.log("[SSE] Connected");
      };

      es.onmessage = (event) => {
        console.log("[SSE] Raw event:", event.data);
        if (event.data === "update") {
          console.log("[SSE] Received update");
          onUpdate();
        } else {
          console.log("[SSE] Keep-alive/ping received");
        }
      };

      es.onerror = (err) => {
        console.error("[SSE] Error occurred:", err);
        es.close();

        retryTimeoutRef.current = setTimeout(() => {
          console.log("[SSE] Attempting to reconnect...");
          connect();
        }, 3000);
      };
    };

    connect();

    return () => {
      if (eventSourceRef.current) eventSourceRef.current.close();
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    };
  }, [onUpdate]);
};

export default useSSE;
// import { useEffect } from "react";

// const useSSE = (onUpdate) => {
//   useEffect(() => {
//     const eventSource = new EventSource(`http://localhost:8080/stream`);

//     eventSource.onmessage = (event) => {
//       console.log(event.data)
//       if (event.data === "update") {
//         onUpdate(); // Запускаем обновление данных
//       }
//     };

//     // eventSource.addEventListener("stream_event", (event) => {
//     //   console.log("Named event received:", event.data);
//     // });

//     eventSource.onerror = (err) => {
//       console.error("SSE error:", err);
//       eventSource.close();
//     };

//     return () => {
//       eventSource.close();
//     };
//   }, [onUpdate]);
// };

// export default useSSE;
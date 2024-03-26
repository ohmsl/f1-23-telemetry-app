// src/workers/jsonParser.worker.ts

// The context for TypeScript to recognize it's a Web Worker
/// <reference lib="webworker" />

addEventListener("message", (event) => {
  try {
    const { data, type } = event.data;

    postMessage({ [type]: JSON.parse(data) });
  } catch (error) {
    postMessage({ error });
    console.error(error);
  }
});

// let requiredTypes = ["carTelemetry", "carStatus", "lapData"];
// let buffer: { [key: string]: any } = {};

// addEventListener("message", (event) => {
//   try {
//     const { data, type } = event.data;

//     buffer[type] = JSON.parse(data);

//     if (requiredTypes.every((type) => type in buffer)) {
//       postMessage(buffer);
//       buffer = {};
//     }
//   } catch (error) {
//     postMessage({ error });
//     console.error(error);
//   }
// });

// addEventListener("message", (event) => {
//   try {
//     const { data, type } = event.data;

//     postMessage({ [type]: JSON.parse(data) });
//   } catch (error) {
//     postMessage({ error });
//     console.error(error);
//   }
// });

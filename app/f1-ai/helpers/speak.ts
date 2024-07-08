export const speak = (text: string, audioContext?: AudioContext) => {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice =
      window.speechSynthesis
        .getVoices()
        .find((voice) => voice.name === "Google UK English Male") ||
      window.speechSynthesis.getVoices()[0];
    window.speechSynthesis.speak(utterance);
  } else {
    console.error("SpeechSynthesis is not supported in this browser.");
  }
};

// ./components/Controls.tsx
import { useVoice, VoiceReadyState } from "@humeai/voice-react";
export default function Controls() {
  const { connect, disconnect, readyState, isPlaying } = useVoice();

  if (readyState === VoiceReadyState.OPEN) {
    return (
      <button
        onClick={() => {
          disconnect();
        }}
      >
        End Session
      </button>
    );
  }

  return (
    <button
      onClick={() => {
        connect()
          .then(() => {
            /* handle success */
          })
          .catch(() => {
            /* handle error */
          });
      }}
    >
      Start Session
    </button>
  );
}

// ./pages/index.tsx
import Controls from "@/components/Controls";
import Messages from "@/components/Messages";
import { fetchAccessToken } from "hume";
import { VoiceProvider } from "@humeai/voice-react";
import { InferGetServerSidePropsType } from "next";

export const getServerSideProps = async () => {
  const accessToken = await fetchAccessToken({
    apiKey: String(process.env.NEXT_PUBLIC_HUME_API_KEY),
    secretKey: String(process.env.NEXT_PUBLIC_HUME_SECRET_KEY),
  });

  if (!accessToken) {
    return {
      redirect: {
        destination: "/error",
        permanent: false,
      },
    };
  }

  return {
    props: {
      accessToken,
    },
  };
};

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Test4({ accessToken }: PageProps) {
  return (
    <VoiceProvider auth={{ type: "accessToken", value: accessToken }} configId="60d82fe3-78f5-4e6c-ae4a-7c7e50fe3161">
      <Messages />
      <Controls />
    </VoiceProvider>
  );
}

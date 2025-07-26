import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import fetchGroqResponse from "../services/groq";
import { colorMeta } from "../data/colorMeta";
import MoodDisplay from "../components/MoodDisplay";
import AIResponseBox from "../components/AIResponseBox";
import AIChatBox from "../components/AIChatBox";

const PageWrapper = styled.div`
  min-height: 100vh;
  padding: 2rem 1rem;
  background-color: #111214;
  color: white;
  font-family: "Inter", sans-serif;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: -20%;
    left: -15%;
    width: 130%;
    height: 130%;
    background: radial-gradient(
      circle at top left,
      ${({ color }) => `${color}26`} 0%,
      transparent 70%
    );
    z-index: 0;
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -10%;
    right: -10%;
    width: 350px;
    height: 350px;
    background: radial-gradient(
      circle,
      ${({ color }) => `${color}33`} 0%,
      transparent 80%
    );
    filter: blur(100px);
    z-index: 0;
    pointer-events: none;
  }

  @media (max-width: 640px) {
    ${({ $centerMood }) =>
      $centerMood &&
      `
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 0 1rem;
    `}
  }
`;

const BackButton = styled.button`
  position: absolute;
  top: 1.2rem;
  left: 1.2rem;
  background: none;
  border: none;
  color: white;
  font-size: 1.6rem;
  cursor: pointer;
  z-index: 10;

  @media (max-width: 640px) {
    font-size: 1.2rem;
    top: 0.2rem;
    left: 0.5rem;
  }
`;

const GlassCard = styled.div`
  width: 95%;
  max-width: 1100px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 18px;
  padding: 1.8rem 1.5rem;
  box-shadow: 0 0 20px ${({ color }) => `${color}22`};
  backdrop-filter: blur(12px);
  transition: 0.3s;

  &:hover {
    box-shadow: 0 0 35px ${({ color }) => `${color}55`};
  }

  @media (max-width: 640px) {
    padding: 1.3rem 1rem;
  }
`;

const GradientHeading = styled.h1`
  font-family: "Playfair Display", serif;
  font-size: clamp(2.2rem, 6vw, 3.2rem);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: -1px;
  line-height: 1.2;
  text-align: center;
  margin: 1.5rem 1rem 0.6rem;

  .gradient-text {
    background: linear-gradient(90deg, ${({ color }) => `${color}`}, #ffffff);
    background-size: 200% auto;
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    animation: moveGradient 6s ease-in-out infinite;
    text-shadow: 0 0 10px ${({ color }) => `${color}99`};
  }

  @keyframes moveGradient {
    0% {
      background-position: 0% center;
    }
    50% {
      background-position: 100% center;
    }
    100% {
      background-position: 0% center;
    }
  }

  @media (max-width: 640px) {
    display: none;
  }
`;

const ChatWrapper = styled(GlassCard)`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  padding: 2rem;
`;

const Subtitle = styled.p`
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  margin-bottom: 1.5rem;

  @media (max-width: 640px) {
    display: none;
  }
`;

const CardHeaderMobile = styled.div`
  display: none;

  @media (max-width: 640px) {
    display: block;
    text-align: center;
    margin-bottom: 1rem;

    h2 {
      font-family: "Playfair Display", serif;
      font-size: 2rem;
      text-transform: uppercase;
      background: linear-gradient(90deg, ${({ color }) => `${color}`}, #ffffff);
      background-size: 200% auto;
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      animation: moveGradient 6s ease-in-out infinite;
      text-shadow: 0 0 10px ${({ color }) => `${color}99`};
      margin: 0;
    }

    p {
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.5);
      margin-top: 0.3rem;
    }

    @keyframes moveGradient {
      0% {
        background-position: 0% center;
      }
      50% {
        background-position: 100% center;
      }
      100% {
        background-position: 0% center;
      }
    }
  }
`;

const BubblePage = () => {
  const { colorName, topic } = useParams();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const colorInfo = colorMeta[colorName?.toLowerCase()];
  const colorHex = colorInfo?.hex || "#333";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      if (!colorInfo) {
        setContent("Invalid color selected.");
        setLoading(false);
        return;
      }

      if (topic === "chat" || topic === "mood") {
        setLoading(false);
        return;
      }

      const prompt = generatePrompt(topic, colorInfo.name);
      const res = await fetchGroqResponse(prompt);
      setContent(res);
      setLoading(false);
    };

    fetchData();
  }, [colorName, topic]);

  return (
    <PageWrapper
      color={colorHex}
      $centerMood={topic === "mood"}
      style={topic === "chat" ? { overflow: "hidden" } : {}}
    >
      <BackButton onClick={() => navigate(-1)}>&larr;</BackButton>
      {topic !== "chat" && (
        <>
          <GradientHeading color={colorHex}>
            <span className="gradient-text">{topic.toUpperCase()}</span>
          </GradientHeading>
          <Subtitle>A glimpse of how this color connects with {topic}</Subtitle>
        </>
      )}

      {loading ? (
        <GlassCard>
          <CardHeaderMobile color={colorHex}>
            <h2>{topic.toUpperCase()}</h2>
            <p>A glimpse of how this color connects with {topic}</p>
          </CardHeaderMobile>

          <p>Loading...</p>
        </GlassCard>
      ) : topic === "chat" ? (
        <>
          <AIChatBox colorName={colorInfo.name} />
        </>
      ) : topic === "mood" ? (
        <GlassCard>
          <CardHeaderMobile color={colorHex}>
            <h2>{topic.toUpperCase()}</h2>
            <MoodDisplay
              moods={colorInfo?.moods || []}
              emojis={colorInfo?.emojis || []}
            />
          </CardHeaderMobile>
        </GlassCard>
      ) : (
        <GlassCard>
          <CardHeaderMobile color={colorHex}>
            <h2>{topic.toUpperCase()}</h2>
            <p>A glimpse of how this color connects with {topic}</p>
          </CardHeaderMobile>

          <AIResponseBox content={content} />
        </GlassCard>
      )}
    </PageWrapper>
  );
};

const generatePrompt = (topic, colorName, userMessage = "") => {
  switch (topic) {
    case "food":
      return `List real foods or traditional dishes associated with the color ${colorName}, either visually or symbolically. Mention the flavor, usage, or cultural origin where known.
      Respond using bullet points only. If no valid examples are found, say so.`;

    case "fashion":
      return `List verified ways the color ${colorName} is used in traditional or modern fashion, including notable cultural associations, historical garments, or trends.
      Respond using bullet points only. If no valid examples are found, say so.`;

    case "about":
      return `Describe the color ${colorName} in terms of its cultural significance, emotional impact, visual qualities, and common associations. Include references to art, design, or tradition where relevant.
      Respond using bullet points only. If no meaningful information is found, say so.`;

    case "nature":
      return `List real natural elements where the color ${colorName} appears (plants, animals, minerals, landscapes). Mention how the color appears.
      Respond using bullet points only. If no valid examples are found, say so.`;

    case "music":
      return `List real songs, artists, or genres that are strongly associated with the mood or symbolism of the color ${colorName}. Include a short explanation.
      Respond using bullet points only. If no valid associations are found, say so.`;

    case "movie":
      return `List real films where the color ${colorName} is visually or symbolically significant (e.g. set design, mood, theme). Mention the context briefly.
      Respond using bullet points only. If no valid examples are found, say so.`;

    case "story":
      return `Write a short fictional or poetic passage where the color "${colorName}" plays a symbolic or emotional role. This is the only prompt that allows creativity.
      Use a clear title and limit to 2–3 short paragraphs. Do not use bullet points.`;

    case "chat":
      const message = userMessage || "Say something expressive about yourself.";
      return `You are the personality of the color "${colorName}". Respond to this message like a warm, expressive friend: "${message}". Use creativity and imagination.
      Respond in 1–3 casual lines. This is the only case where you can use first-person language.`;

    default:
      return `Provide only verified, factual information about the color ${colorName}. If listing examples, respond using bullet points only. If nothing is known, say so.`;
  }
};

export default BubblePage;

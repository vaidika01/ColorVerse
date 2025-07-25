import styled, { keyframes } from "styled-components";

const MoodWrapper = styled.div`
  text-align: center;
  font-family: "Playfair Display", serif;
  margin-top: 3rem;

  @media (max-width: 640px) {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 0;
    padding: 0 1rem;
  }
`;

const floatEmoji = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const MoodEmoji = styled.div`
  font-size: 7rem;
  margin-bottom: 0.8rem;
  animation: ${floatEmoji} 2.8s ease-in-out infinite;

  @media (max-width: 500px) {
    font-size: 5rem;
  }
`;

const MoodName = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(90deg, #ff4ec7, #4bc0ff, #ffe163);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
  letter-spacing: 0.5px;

  @media (max-width: 500px) {
    font-size: 1.4rem;
  }
`;

const MoodDisplay = ({ moods = [] }) => {
  if (!moods.length) return null;

  const randomIndex = Math.floor(Math.random() * moods.length);
  const { mood, emoji } = moods[randomIndex];

  return (
    <MoodWrapper>
      <MoodEmoji>{emoji}</MoodEmoji>
      <MoodName>{mood}</MoodName>
    </MoodWrapper>
  );
};

export default MoodDisplay;

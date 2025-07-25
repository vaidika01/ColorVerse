import { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { colorMeta } from "../data/colorMeta";

const Container = styled.div`
  height: 100vh;
  width: 100%;
  overflow: hidden;
  position: relative;
  background: #202123;
`;

const Header = styled.div`
  text-align: center;
  margin: 3.2rem 1rem 1.6rem;
  user-select: none;

  h1 {
    font-family: "Playfair Display", serif;
    font-size: clamp(2.2rem, 6vw, 3.2rem);
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: -1px;
    line-height: 1.2;

    .gradient-text {
      background: linear-gradient(
        90deg,
        #ff4ec7,
        #ff9151,
        #ffe163,
        #00ffa1,
        #4bc0ff,
        #d36fff,
        #ff4ec7
      );
      background-size: 200% auto;
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      animation: moveGradient 8s ease-in-out infinite;
    }
  }

  .sub {
    font-family: "Inter", sans-serif;
    font-size: clamp(0.9rem, 2.4vw, 1rem);
    color: rgba(255, 255, 255, 0.5);
    font-weight: 300;
    margin-top: 0.3rem;
  }

  .emoji {
    font-size: 1.1rem;
    margin-right: 0.2rem;
    vertical-align: middle;
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
`;

const ColorSliderWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const ColorSlider = styled.div`
  display: flex;
  width: 80%;
  margin: auto;
  height: 70vh;
  gap: 10px;
  align-items: flex-end;
`;

const ColorCard = styled.div`
  flex: ${({ $expanded }) => ($expanded ? 2.9 : 1)};
  transition: flex 0.4s ease-in-out;
  border-radius: 10px;
  height: 100%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  background: ${({ color }) =>
    `linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.05) 25%), ${color}`};
`;

const ColorLabel = styled.div`
  position: absolute;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  font-family: "Playfair Display", serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
`;

const floatUp = keyframes`
  0% { opacity: 0; transform: translateY(100px) scale(0.9); }
  15% { opacity: 1; transform: translateY(50px) scale(1); }
  85% { opacity: 1; transform: translateY(-50px); }
  100% { opacity: 0; transform: translateY(-100px); }
`;

const shimmer = keyframes`
  0%, 100% { box-shadow: 0 0 0 rgba(255,255,255,0); }
  50% { box-shadow: 0 0 20px rgba(255,255,255,0.5); }
`;

const Bubble = styled.div`
  position: absolute;
  top: ${({ $top }) => `${$top}%`};
  left: ${({ $left }) => `${$left}%`};
  width: 130px;
  height: 130px;
  border-radius: 50%;
  backdrop-filter: blur(12px);
  background: ${({ $color }) =>
    `radial-gradient(circle at 30% 30%, ${$color}dd, ${$color}99)`};
  border: 2px solid rgba(255, 255, 255, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Inter", sans-serif;
  font-size: 1.05rem;
  font-weight: 600;
  text-align: center;
  animation: ${floatUp} 3.5s ease-in-out forwards,
    ${shimmer} 4s ease-in-out infinite;
  cursor: pointer;
  z-index: 100;
  color: ${({ $color }) => (isLightColor($color) ? "#111" : "#fff")};
`;

const bubbles = [
  { label: "💬 Chat", path: "chat" },
  { label: "🧪 Mood", path: "mood" },
  { label: "🧠 About", path: "about" },
  { label: "📖 Story", path: "story" },
  { label: "🍽️ Food", path: "food" },
  { label: "👗 Fashion", path: "fashion" },
  { label: "🌿 Nature", path: "nature" },
  { label: "🎶 Music", path: "music" },
  { label: "🎥 Movie", path: "movie" },
];

const isLightColor = (hex) => {
  if (!hex || typeof hex !== "string") return false;
  const rgb = hex
    .replace("#", "")
    .match(/.{2}/g)
    ?.map((c) => parseInt(c, 16));
  if (!rgb || rgb.length !== 3) return false;
  const luminance = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
  return luminance > 0.7;
};

const DesktopHome = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
      clearInterval(intervalRef.current);
      timeoutRefs.current.forEach(clearTimeout);
    };
  }, []);

  const [hoveredIndex, setHoveredIndex] = useState(0);
  const [activeColor, setActiveColor] = useState(null);
  const [activeColorName, setActiveColorName] = useState(null);
  const [allBubbles, setAllBubbles] = useState([]);

  const navigate = useNavigate();
  const intervalRef = useRef(null);
  const timeoutRefs = useRef([]);

  const handleColorClick = (colorName, hex) => {
    clearInterval(intervalRef.current);
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];

    setAllBubbles([]);
    setActiveColor(hex);
    setActiveColorName(colorName.toLowerCase());

    const createBubbleBatch = () => {
      const newBatch = [];
      const usedPositions = [];

      const getNonOverlappingPosition = () => {
        let attempts = 0;
        while (attempts < 30) {
          const top = Math.random() * 70 + 10;
          const left = Math.random() * 70 + 10;
          const overlap = usedPositions.some(
            (pos) =>
              Math.abs(pos.top - top) * 10 < 130 &&
              Math.abs(pos.left - left) * 10 < 130
          );
          if (!overlap) {
            usedPositions.push({ top, left });
            return { top, left };
          }
          attempts++;
        }
        return { top: Math.random() * 70 + 10, left: Math.random() * 70 + 10 };
      };

      for (let i = 0; i < 8; i++) {
        const bubble = bubbles[Math.floor(Math.random() * bubbles.length)];
        const { top, left } = getNonOverlappingPosition();
        const id = `${bubble.path}-${Date.now()}-${Math.random()}`;
        newBatch.push({ ...bubble, id, top, left });
      }

      setAllBubbles((prev) => [...prev, ...newBatch]);

      const cleanup = setTimeout(() => {
        setAllBubbles((prev) =>
          prev.filter((b) => !newBatch.some((nb) => nb.id === b.id))
        );
      }, 3500);

      timeoutRefs.current.push(cleanup);
    };

    createBubbleBatch();

    intervalRef.current = setInterval(() => {
      createBubbleBatch();
    }, 3000);

    setTimeout(() => {
      clearInterval(intervalRef.current);
    }, 8000);
  };

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      timeoutRefs.current.forEach(clearTimeout);
    };
  }, []);

  const colors = Object.values(colorMeta);

  return (
    <Container>
      <Header>
        <h1>
          <span className="gradient-text">Colorverse</span>
        </h1>
        <p className="sub">A Universe of Colors & Emotions</p>
      </Header>

      <ColorSliderWrapper>
        <ColorSlider>
          {colors.map((color, index) => (
            <ColorCard
              key={color.name}
              color={color.hex}
              $expanded={hoveredIndex === index}
              onMouseEnter={() => setHoveredIndex(index)}
              onClick={() => handleColorClick(color.name, color.hex)}
            >
              {hoveredIndex === index && <ColorLabel>{color.name}</ColorLabel>}
            </ColorCard>
          ))}
        </ColorSlider>
      </ColorSliderWrapper>

      {allBubbles.map((b) => (
        <Bubble
          key={b.id}
          $color={activeColor}
          $top={b.top}
          $left={b.left}
          onClick={() => navigate(`/color/${activeColorName}/${b.path}`)}
        >
          {b.label}
        </Bubble>
      ))}
    </Container>
  );
};

export default DesktopHome;

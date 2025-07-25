import { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { colorMeta, gradientColors } from "../data/colorMeta";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

const Container = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 0.8rem;
  background: #202123;
  overflow: hidden;
`;

const Header = styled.div`
  text-align: center;
  margin: 3.2rem 1rem 1.2rem;
  user-select: none;

  h1 {
    font-family: "Playfair Display", serif;
    font-size: clamp(2.2rem, 6vw, 3.2rem);
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: -1px;
    line-height: 1.2;

    .gradient-text {
      background: linear-gradient(90deg, ${gradientColors});
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

const CardArea = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 1rem;
  margin-top: 1rem;
  position: relative;
  z-index: 10;
`;

const MobileCard = styled.div`
  height: 75vh;
  max-width: 90vw;
  margin: 0 auto;
  border-radius: 20px;
  overflow: hidden;
  background: ${({ color }) =>
    `linear-gradient(to top, rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.05) 20%), ${color}`};
  box-shadow: 0 12px 30px ${({ color }) => `${color}66`}, 0 0 0 2px #ffffff11;
  transition: transform 0.3s ease;

  &:active {
    transform: scale(0.96);
  }
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
  top: ${({ $top }) => `${$top}vh`};
  left: ${({ $left }) => `${$left}vw`};
  width: 130px;
  height: 130px;
  border-radius: 50%;
  backdrop-filter: blur(10px);
  background: ${({ $color }) =>
    `radial-gradient(circle at 30% 30%, ${$color}dd, ${$color}88)`};
  border: 2px solid rgba(255, 255, 255, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.1rem;
  text-align: center;
  font-family: "Inter", sans-serif;
  font-weight: 600;
  animation: ${floatUp} 3.5s ease-in-out forwards,
    ${shimmer} 4s ease-in-out infinite;
  cursor: pointer;
  z-index: 100;
  color: ${({ $color }) => (isLightColor($color) ? "#111" : "#fff")};
  text-shadow: ${({ $color }) =>
    isLightColor($color) ? "none" : "0 1px 3px rgba(0,0,0,0.35)"};

  @media (max-width: 500px) {
    width: 90px;
    height: 90px;
    font-size: 0.85rem;
  }
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

const MobileHome = () => {
  const navigate = useNavigate();
  const [activeColor, setActiveColor] = useState(null);
  const [activeColorName, setActiveColorName] = useState(null);
  const [allBubbles, setAllBubbles] = useState([]);
  const intervalRef = useRef(null);
  const timeoutRefs = useRef([]);
  const clickedRef = useRef(false);

  const [sliderRef] = useKeenSlider({
    loop: true,
    mode: "snap",
    slides: { perView: 1, spacing: 10 },
  });

  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.position = "static";
      document.body.style.width = "auto";
      clearInterval(intervalRef.current);
      timeoutRefs.current.forEach(clearTimeout);
    };
  }, []);

  const handleColorClick = (colorName, hex) => {
    if (clickedRef.current) return;
    clickedRef.current = true;
    setTimeout(() => (clickedRef.current = false), 500);

    clearInterval(intervalRef.current);
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];

    setAllBubbles([]);
    setActiveColor(hex);
    setActiveColorName(colorName.toLowerCase());

    const createBubbleBatch = () => {
      const newBatch = [];
      const usedPositions = [];
      const bubbleSize = window.innerWidth <= 500 ? 90 : 130;
      const bubbleVh = (bubbleSize / window.innerHeight) * 100;
      const bubbleVw = (bubbleSize / window.innerWidth) * 100;
      const maxTop = 100 - bubbleVh;
      const maxLeft = 100 - bubbleVw;

      const getNonOverlappingPosition = () => {
        let attempts = 0;
        while (attempts < 30) {
          const top = Math.random() * maxTop;
          const left = Math.random() * maxLeft;
          const overlap = usedPositions.some(
            (pos) =>
              Math.abs(pos.top - top) * 1.3 < bubbleSize &&
              Math.abs(pos.left - left) * 1.3 < bubbleSize
          );

          if (!overlap) {
            usedPositions.push({ top, left });
            return { top, left };
          }
          attempts++;
        }
        return { top: Math.random() * maxTop, left: Math.random() * maxLeft };
      };

      for (let i = 0; i < 7; i++) {
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
    intervalRef.current = setInterval(createBubbleBatch, 3000);
    setTimeout(() => clearInterval(intervalRef.current), 8500);
  };

  const colorList = Object.values(colorMeta);

  return (
    <Container>
      <Header>
        <h1>
          <span className="gradient-text">Colorverse</span>
        </h1>
        <p className="sub">A Universe of Colors & Emotions</p>
      </Header>

      <CardArea>
        <div ref={sliderRef} className="keen-slider">
          {colorList.map((color, index) => (
            <div
              key={color.name}
              className="keen-slider__slide"
              onClick={() => handleColorClick(color.name, color.hex)}
            >
              <MobileCard
                color={color.hex}
                role="button"
                aria-label={`Explore ${color.name}`}
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleColorClick(color.name, color.hex)
                }
              >
                <ColorLabel>{color.name}</ColorLabel>
              </MobileCard>
            </div>
          ))}
        </div>
      </CardArea>

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

export default MobileHome;

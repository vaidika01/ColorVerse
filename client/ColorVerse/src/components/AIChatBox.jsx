import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import fetchGroqResponse from "../services/groq";
import { colorMeta } from "../data/colorMeta";

const ChatWrapper = styled.div`
  max-width: 720px;
  height: 88vh;
  margin: auto;
  display: flex;
  flex-direction: column;
  background: ${({ $colorHex }) =>
    `linear-gradient(to bottom, #111, ${$colorHex}22)`};
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  overflow: hidden;
`;

const MessageArea = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column-reverse;
  gap: 0.7rem;
`;

const Bubble = styled.div`
  max-width: 75%;
  font-size: 0.95rem;
  line-height: 1.6;
  color: white;
  padding: 0.5rem 0.8rem;
  background: ${({ type, $colorHex }) =>
    type === "user" ? `${$colorHex}33` : "rgba(255, 255, 255, 0.08)"};
  align-self: ${({ type }) => (type === "user" ? "flex-end" : "flex-start")};
  border-radius: 10px;
  border: none;
  word-break: break-word;
  backdrop-filter: blur(4px);
`;

const InputBar = styled.form`
  display: flex;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 500px) {
    padding: 0.5rem;
    gap: 0.5rem;
  }
`;

const ChatInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: 0.75rem 1rem;
  border-radius: 20px;
  border: none;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  outline: none;

  &::placeholder {
    color: #ccc;
  }
`;

const SendButton = styled.button`
  margin-left: 0.6rem;
  padding: 0.75rem 1.2rem;
  border-radius: 20px;
  background: ${({ $colorHex }) => `${$colorHex}cc`};
  color: white;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: 0.3s ease;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    filter: brightness(1.1);
  }
`;

const AIChatBox = ({ colorName }) => {
  const hex = colorMeta[colorName?.toLowerCase()]?.hex || "#2ebaae";
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: `Hey! I'm the personality of **${colorName}**. Ask me anything! 🌈`,
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { type: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const res = await fetchGroqResponse(
      `You are the personality of the color "${colorName}". Reply briefly (1–3 lines) in a friendly, casual tone using first-person voice. Respond to this:\n"${input}".`
    );

    setIsTyping(false);
    setMessages((prev) => [...prev, { type: "bot", text: res.trim() }]);
  };

  return (
    <ChatWrapper $colorHex={hex}>
      <MessageArea ref={scrollRef}>
        {isTyping && (
          <Bubble type="bot" $colorHex={hex}>
            Typing...
          </Bubble>
        )}
        {[...messages].reverse().map((msg, i) => (
          <Bubble key={i} type={msg.type} $colorHex={hex}>
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </Bubble>
        ))}
      </MessageArea>

      <InputBar onSubmit={handleSubmit}>
        <ChatInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <SendButton type="submit" $colorHex={hex}>
          Send
        </SendButton>
      </InputBar>
    </ChatWrapper>
  );
};

export default AIChatBox;

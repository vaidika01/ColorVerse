import styled from "styled-components";
import ReactMarkdown from "react-markdown";

const Wrapper = styled.div`
  margin-top: 2rem;
  padding: 0.5rem 0;
  font-family: "Inter", sans-serif;
`;

const MarkdownWrapper = styled.div`
  color: white;
  font-size: 1.075rem;
  line-height: 1.6;
  max-width: 90ch;
  margin: 0 auto;
  padding: 0 1.25rem;
  text-align: left;
  word-break: normal;

  p {
    margin: 1rem 0;
  }

  h1,
  h2,
  h3 {
    font-family: "Playfair Display", serif;
    font-weight: 700;
    color: white;
    margin: 1.6rem 0 0.8rem;
    line-height: 1.3;
  }

  ul,
  ol {
    padding-left: 1.5rem;
    margin: 0.8rem 0;
  }

  li {
    margin-bottom: 0.4rem;
  }

  pre,
  code {
    background: rgba(255, 255, 255, 0.08);
    padding: 0.4rem 0.6rem;
    border-radius: 6px;
    font-family: "Fira Code", monospace;
    color: #fff;
    display: inline-block;
    max-width: 100%;
    overflow-x: auto;
  }

  a {
    color: #4bc0ff;
    text-decoration: underline;
  }

  @media (max-width: 640px) {
    font-size: 0.95rem;
    padding: 0 0.75rem;

    p {
      margin: 0.4rem 0;
    }

    h1,
    h2,
    h3 {
      margin: 0.9rem 0 0.4rem;
    }

    ul,
    ol {
      margin: 0.4rem 0;
      padding-left: 1rem;
    }
  }
`;

const AIResponseBox = ({ content }) => {
  const cleanedContent = content.replace(/^\s*•\s+/gm, "- ");

  return (
    <Wrapper>
      <MarkdownWrapper>
        <ReactMarkdown>{cleanedContent}</ReactMarkdown>
      </MarkdownWrapper>
    </Wrapper>
  );
};

export default AIResponseBox;

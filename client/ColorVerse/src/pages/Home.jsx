import MobileHome from "./MobileHome";
import DesktopHome from "./DesktopHome";
import useIsMobile from "../utils/useIsMobile";

const Home = () => {
  const isMobile = useIsMobile();
  return isMobile ? <MobileHome /> : <DesktopHome />;
};

export default Home;

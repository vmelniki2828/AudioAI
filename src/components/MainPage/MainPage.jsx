import { Link } from 'react-router-dom';

const MainPage = () => {
  return (
    <>
      <Link to={'chat'}>
        <button>Chat</button>
      </Link>
      <Link to={'audio'}>
        <button>Audio</button>
      </Link>
    </>
  );
};

export default MainPage;

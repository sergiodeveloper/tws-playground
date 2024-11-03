import Loader from '../Loader/Loader';
import './MainButton.css';

function MainButton(props: {
  onClick: () => void;
  text: string;
  loading: boolean;
}) {
  return (
    <button
      onClick={() => props.onClick()}
      className="main-button-root"
      disabled={props.loading}
    >
      <span
        style={{
          visibility: props.loading ? 'hidden' : 'visible',
        }}
      >{props.text}</span>

      <span
        style={{
          visibility: props.loading ? 'visible' : 'hidden',
        }}
        className="loader"
      >
        <Loader size={25} color="white" />
      </span>
    </button>
  );
}

export default MainButton;

import './Loader.css';

function Loader(props: { size: number, color: string }) {
  return (
    <div
      role="loader"
      className="loader-root"
      style={{
        width: props.size,
        borderRightColor: props.color,
      }}
    />
  );
}

export default Loader;

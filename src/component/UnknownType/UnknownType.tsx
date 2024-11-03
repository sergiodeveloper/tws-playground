
function UnknownType(props: { definition: string }) {
  const { definition } = props;

  return (
    <div>
      <div
        style={{
          color: 'red',
          fontWeight: 'bold',
          fontSize: '10px',
          fontFamily: 'monospace',
        }}
      >Unknown type:</div>
      <pre
        role="type-definition"
        style={{
          border: '1px dashed #ccc',
          padding: '3px',
          fontSize: '8px',
          margin: '0',
        }}
      >{definition}</pre>
    </div>
  );
}

export default UnknownType;

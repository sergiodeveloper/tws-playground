import './RemoveButton.css';

import { RiDeleteBinLine } from "@remixicon/react";

function RemoveButton(props: { onClick: () => void }) {
  return (
    <button
      onClick={() => props.onClick()}
      className="remove-button"
      aria-label="Remove"
    >
      <RiDeleteBinLine
        size={24}
      />
    </button>
  );
}

export default RemoveButton;

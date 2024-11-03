import './ClearButton.css';

import { RiCloseLine } from "@remixicon/react";

function ClearButton(props: { onClick: () => void }) {
  return (
    <button
      onClick={() => props.onClick()}
      className="clear-button"
      aria-label="Clear"
    >
      <RiCloseLine
        size={24}
      />
    </button>
  );
}

export default ClearButton;

import { RiAddCircleLine } from '@remixicon/react';
import './AddButton.css'

function AddButton(props: { onClick: () => void }) {
  return (
    <button
      onClick={() => props.onClick()}
      className="add-button"
      aria-label="Add"
    >
      <RiAddCircleLine
        size={24}
      />
    </button>
  );
}

export default AddButton;

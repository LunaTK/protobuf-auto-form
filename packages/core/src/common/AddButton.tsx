import React, { DOMAttributes } from 'react';
import PlusIcon from '../icon/PlusIcon';

interface Props {
  onClick?: DOMAttributes<HTMLButtonElement>['onClick'];
}

const AddButton: React.FC<Props> = ({ onClick }) => (
  <button type="button" className="btn btn-xs" onClick={onClick} data-testid="add-btn">
    <PlusIcon />
    Add
  </button>
);

export default AddButton;

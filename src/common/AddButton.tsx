import React, { DOMAttributes } from 'react';
import PlusIcon from '../icon/PlusIcon';

interface Props {
    onClick?: DOMAttributes<HTMLButtonElement>['onClick']
}

const AddButton: React.FC<Props> = ({ onClick }) => (
  <button type="button" className="btn btn-xs btn-outline" onClick={onClick}>
    <PlusIcon />
    Add
  </button>
);

export default AddButton;

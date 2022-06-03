import React, { DOMAttributes } from 'react';
import MinusIcon from '../icon/MinusIcon';

interface Props {
    onClick?: DOMAttributes<HTMLButtonElement>['onClick']
}

const AddButton: React.FC<Props> = ({ onClick }) => (
  <button type="button" className="btn btn-xs btn-outline btn-error" onClick={onClick}>
    <MinusIcon />
  </button>
);

export default AddButton;

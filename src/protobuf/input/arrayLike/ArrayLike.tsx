import React from 'react';
import AddButton from '../../../common/AddButton';
import DelButton from '../../../common/DelButton';

interface Props {
  onAdd: VoidFunction;
  onRemove: (index: number) => void;
  render: (props: { idx: number }) => React.ReactNode;
  fields: Record<'id', string>[];
}

const ArrayLike: React.VFC<Props> = ({ fields, onAdd, onRemove, render }) => {
  return (
    <div>
      <header className="flex items-center gap-2 text-gray-400">
        <AddButton onClick={onAdd} />
        ({fields.length} items)
      </header>

      {fields.map((f, idx) => (
        <div key={f.id} className="flex items-center gap-2 my-2">
          <DelButton onClick={() => onRemove(idx)} />
          {render({ idx })}
        </div>
      ))}
    </div>
  );
};

export default ArrayLike;

import React, { ReactNode } from 'react';
import AddButton from '../../../common/AddButton';
import DelButton from '../../../common/DelButton';

interface Props {
  onAdd: VoidFunction;
  onRemove: (index: number) => void;
  render: (props: { idx: number }) => React.ReactNode;
  fields: Record<'id', string>[];
}

const collapseIfTooMany = (nodes: ReactNode[]) => {
  if (nodes.length < 10) return nodes;

  return (
    <details className="open">
      <summary className="cursor-pointer text-gray-600">Show items</summary>
      {nodes}
    </details>
  );
};

const ArrayLike: React.VFC<Props> = ({ fields, onAdd, onRemove, render }) => {
  return (
    <div>
      <span className="flex items-center gap-2 text- mb-2">
        <AddButton onClick={onAdd} />
        ({fields.length} items)
      </span>
      {collapseIfTooMany(
        fields.map((f, idx) => (
          <div key={f.id} className="flex items-center gap-2 my-2">
            <span className="w-min text-center text-gray-400">
              {idx}
              <DelButton onClick={() => onRemove(idx)} />
            </span>
            {render({ idx })}
          </div>
        )),
      )}
    </div>
  );
};

export default ArrayLike;

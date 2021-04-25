import React from 'react';
import './TreeView.css';
import cx from 'classnames';

type Leaf = {
  id: number;
  name: string;
  passed: boolean;
};
export type Group = {
  id: number;
  name: string;
  groupChildren: Group[];
  leafChildren: Leaf[];
};

const LeafView: React.FC<{ leaf: Leaf }> = ({ leaf }) => {
  return (
    <div className="ttv_leaf" tabIndex={0}>
      <div className="ttv_leaf-id">#{leaf.id}</div>
      <div className="ttv_leaf-state">{leaf.passed ? '✅' : '⛔'}</div>
      <div className="ttv_leaf-name">{leaf.name}</div>
    </div>
  );
};

const GroupView: React.FC<{ group: Group; depth: number }> = ({ group, depth }) => {
  const [opened, setOpened] = React.useState(depth === 0);
  const toggleOpeend = React.useCallback(() => setOpened((x) => !x), []);
  const handleKeyboard = React.useCallback((event: React.KeyboardEvent) => {
    if (['Enter', ' '].includes(event.key)) {
      toggleOpeend();
      event.preventDefault();
    }
  }, []);

  const isEmpty = group.groupChildren.length + group.leafChildren.length === 0;

  return (
    <div className="ttv_group">
      <div
        className={cx('ttv_group-header', opened && 'ttv_group-opened-header')}
        onClick={toggleOpeend}
        onKeyDown={handleKeyboard}
        title={`${group.name} #${group.id}`}
        tabIndex={0}
      >
        <div className="ttv_group-state">{opened ? '📂' : '📁'}</div>
        <div className="ttv_group-name">{group.name}</div>
      </div>
      {opened && (
        <>
          {/* <div className="ttv_group-bottom-divider" /> */}
          <div className={cx('ttv_group-content', isEmpty && 'ttv_group-empty')} tabIndex={isEmpty ? 0 : undefined}>
            {group.groupChildren.map((group) => (
              <GroupView key={group.id} group={group} depth={depth + 1} />
            ))}
            {group.leafChildren.map((leaf) => (
              <LeafView key={leaf.id} leaf={leaf} />
            ))}
            {isEmpty && 'Nothing here'}
          </div>
        </>
      )}
      {opened && depth === 0 && <div className="ttv_group-bottom-divider" />}
    </div>
  );
};

export const TreeView: React.FC<{ rootGroup: Group }> = ({ rootGroup }) => {
  return (
    <div className="ttv_root">
      <GroupView group={rootGroup} depth={0} />
    </div>
  );
};

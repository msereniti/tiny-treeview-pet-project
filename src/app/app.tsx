import React from 'react';
import { render } from 'react-dom';
import { Group, TreeView } from '../TreeView';
import usePromise from 'react-use-promise';
import './app.css';

const App: React.FC = () => {
  const [data, error, status] = usePromise<Group>(() => fetch('/data.json').then((response) => response.json()), []);

  if (status === 'pending') return <div>Loading data...</div>;
  if (status === 'rejected' || !data) return <pre>Error occured: {error?.message || `data is not received`}</pre>;

  return (
    <div>
      <TreeView rootGroup={data} />
    </div>
  );
};

render(<App />, document.querySelector('#root'));

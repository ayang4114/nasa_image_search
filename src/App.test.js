import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App quote="Explore the Advancements to the Final Frontier" />, div);
  ReactDOM.unmountComponentAtNode(div);
});

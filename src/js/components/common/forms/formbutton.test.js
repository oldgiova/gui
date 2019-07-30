import React from 'react';
import renderer from 'react-test-renderer';
import FormButton from './formbutton';

it('renders correctly', () => {
  const tree = renderer.create(<FormButton />).toJSON();
  expect(tree).toMatchSnapshot();
});

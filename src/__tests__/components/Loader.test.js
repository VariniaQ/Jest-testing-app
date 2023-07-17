import React from 'react';
import { render } from '@testing-library/react';
import renderer from 'react-test-renderer';
import Loader from '../../components/Loader';

describe('Loader', () => {
  it('should render the Loader component', () => {
    const { container } = render(<Loader />);
    const loaderElement = container.querySelector('.loader');

    // Assert that the loader element is in the document
    expect(loaderElement).toBeInTheDocument();

    // Create a snapshot of the Loader component and compare with the saved snapshot
    const component = renderer.create(<Loader />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

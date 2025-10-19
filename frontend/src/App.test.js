import { render, screen } from '@testing-library/react';

test('renders learn react link', () => {
  render(
    <div>
      <a href="https://reactjs.org">Learn React</a>
    </div>
  );
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

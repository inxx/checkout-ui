import { render, screen } from '@testing-library/react'
import App from './App'

test('renders checkout ui heading', () => {
  render(<App />)
  const heading = screen.getByText(/checkout ui/i)
  expect(heading).toBeInTheDocument()
})

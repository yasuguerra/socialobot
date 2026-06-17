import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// A simple test to verify React Testing Library setup
const DummyComponent = ({ message }: { message: string }) => <div>{message}</div>;

describe('React Component Test', () => {
  it('renders the message correctly', () => {
    render(<DummyComponent message="Hello QA" />);
    expect(screen.getByText('Hello QA')).toBeInTheDocument();
  });
});
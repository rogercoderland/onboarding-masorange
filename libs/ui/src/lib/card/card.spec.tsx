import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Card } from './card';
import { CardMedia } from './card-media';
import { CardBadge } from './card-badge';
import { CardHeader } from './card-header';
import { CardBrand } from './card-brand';
import { CardTitle } from './card-title';
import { CardContent } from './card-content';
import { CardActions } from './card-actions';

describe('Card', () => {
  it('renders the full compound structure using dot-notation', () => {
    render(
      <Card>
        <Card.Media src="/phone.png" alt="Phone">
          <Card.Badge>New</Card.Badge>
        </Card.Media>
        <Card.Header>
          <Card.Brand>Acme</Card.Brand>
          <Card.Title>Model X</Card.Title>
        </Card.Header>
        <Card.Content>From 9.99€/mo</Card.Content>
        <Card.Actions>
          <button type="button">Add</button>
        </Card.Actions>
      </Card>,
    );

    expect(screen.getByText('Acme')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 3, name: 'Model X' }),
    ).toBeInTheDocument();
    expect(screen.getByText('From 9.99€/mo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
  });

  it('exposes the same parts via dot-notation and named exports', () => {
    expect(Card.Media).toBe(CardMedia);
    expect(Card.Badge).toBe(CardBadge);
    expect(Card.Header).toBe(CardHeader);
    expect(Card.Brand).toBe(CardBrand);
    expect(Card.Title).toBe(CardTitle);
    expect(Card.Content).toBe(CardContent);
    expect(Card.Actions).toBe(CardActions);
  });

  it('renders an <img> when CardMedia has a src', () => {
    render(<CardMedia src="/phone.png" alt="A phone" />);

    const img = screen.getByRole('img', { name: 'A phone' });
    expect(img).toHaveAttribute('src', '/phone.png');
    expect(img).toHaveClass('card__image');
  });

  it('renders no image when CardMedia has no src', () => {
    const { container } = render(<CardMedia>placeholder</CardMedia>);

    expect(container.querySelector('img')).not.toBeInTheDocument();
    expect(container.querySelector('.card__media')).toBeInTheDocument();
  });

  it('applies the solid badge variant by default and outline on request', () => {
    const { rerender, container } = render(<CardBadge>Hot</CardBadge>);
    expect(container.querySelector('.card__badge')).toHaveClass(
      'card__badge--solid',
    );

    rerender(<CardBadge variant="outline">Hot</CardBadge>);
    expect(container.querySelector('.card__badge')).toHaveClass(
      'card__badge--outline',
    );
  });

  it('forwards the ref on the Card root', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Card ref={ref}>body</Card>);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass('card');
  });
});

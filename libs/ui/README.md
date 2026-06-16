# @onboarding-nx/ui

Shared UI components built on [Base UI](https://base-ui.com/) and styled with plain
CSS that reads tokens from [`@onboarding-nx/theme`](../theme). No Tailwind in the
markup, no workspace prefix on the class names — so the components are easy to drop
into other workspaces.

## Getting started

Import the theme once at your app root, then use the components:

```tsx
import '@onboarding-nx/theme/styles.css';
import { Button, Input, Card, CardMedia, CardHeader, CardTitle } from '@onboarding-nx/ui';
```

## Button

Variants: `primary` (default), `secondary`, `ghost`. Sizes: `sm`, `md` (default), `lg`.
`loading` shows a spinner and blocks clicks.

```tsx
<Button onClick={save}>Save</Button>
<Button variant="secondary" iconLeft={<PlusIcon />}>Add</Button>
<Button loading>Saving…</Button>
```

## Input

Wraps Base UI's `Field` + `Input`. Pass `error` to show a message and turn the field red.

```tsx
<Input label="Email" placeholder="you@example.com" value={v} onChange={onChange} />
<Input label="Price" value="000" error="Enter a valid price" />
<Input label="Locked" value="No editable" disabled />
```

## Card

A **compound** component: building blocks you compose yourself. The parts come two
ways — dot-notation (`Card.Media`, `Card.Header`, …) or named exports (`CardMedia`,
`CardHeader`, …). `Card.Media` shows an image when you give it a `src`, otherwise a
placeholder. `Card.Badge` can be `solid` or `outline`.

```tsx
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
    <Button>Add to cart</Button>
  </Card.Actions>
</Card>
```

## Scripts

```sh
pnpm nx test ui              # run unit tests (Vitest + Testing Library)
pnpm nx test ui --coverage   # tests with coverage
pnpm nx build ui             # build the library
```

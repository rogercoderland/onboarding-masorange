import { render } from '@testing-library/react';

import OnboardingNxUi from './ui';

describe('OnboardingNxUi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<OnboardingNxUi />);
    expect(baseElement).toBeTruthy();
  });
});

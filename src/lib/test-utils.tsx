import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement } from 'react';

function CustomRender(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { ...options });
}
export * from '@testing-library/react';
export { CustomRender as render };

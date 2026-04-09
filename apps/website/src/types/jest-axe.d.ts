declare module 'jest-axe' {
  export function axe(html: Element | string, options?: any): Promise<any>;
  export const toHaveNoViolations: any;
  export function configureAxe(options?: any): typeof axe;
}

declare namespace jest {
  interface Matchers<R> {
    toHaveNoViolations(): R;
  }
}

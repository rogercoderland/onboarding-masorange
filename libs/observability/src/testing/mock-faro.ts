import { faro } from '@grafana/faro-web-sdk';

type Call = unknown[];

export interface Recorder {
  (...args: unknown[]): void;
  calls: Call[];
}

function recorder(): Recorder {
  const fn = ((...args: unknown[]) => {
    fn.calls.push(args);
  }) as Recorder;
  fn.calls = [];
  return fn;
}

export interface MockFaroApi {
  pushError: Recorder;
  pushLog: Recorder;
  pushEvent: Recorder;
  setUser: Recorder;
  resetUser: Recorder;
}

export function mockFaroApi(): MockFaroApi {
  const api: MockFaroApi = {
    pushError: recorder(),
    pushLog: recorder(),
    pushEvent: recorder(),
    setUser: recorder(),
    resetUser: recorder(),
  };
  (faro as unknown as Record<string, unknown>)['api'] = api;
  return api;
}

/** Restores the un-initialized state. */
export function clearMockFaro(): void {
  (faro as unknown as Record<string, unknown>)['api'] = undefined;
}

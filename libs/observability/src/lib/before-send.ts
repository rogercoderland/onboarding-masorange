import { TransportItemType } from '@grafana/faro-web-sdk';
import type { BeforeSendHook, TransportItem } from '@grafana/faro-web-sdk';
import { COLLECTOR_URL_MARKER } from './constants';

function isSelfReport(item: TransportItem): boolean {
  const payload = item.payload as Record<string, unknown> | undefined;
  if (!payload) return false;

  const url = typeof payload['url'] === 'string' ? payload['url'] : undefined;
  const attributes = payload['attributes'] as
    | Record<string, unknown>
    | undefined;
  const name =
    typeof attributes?.['name'] === 'string'
      ? (attributes['name'] as string)
      : undefined;

  return [url, name].some((value) => value?.includes(COLLECTOR_URL_MARKER));
}

function isIgnoredException(
  item: TransportItem,
  ignoreErrors: RegExp[],
): boolean {
  const value = (item.payload as { value?: unknown } | undefined)?.value;
  if (typeof value !== 'string') return false;
  return ignoreErrors.some((pattern) => pattern.test(value));
}

export function createBeforeSend(ignoreErrors: RegExp[]): BeforeSendHook {
  return (item) => {
    if (isSelfReport(item)) return null;
    if (
      item.type === TransportItemType.EXCEPTION &&
      isIgnoredException(item, ignoreErrors)
    ) {
      return null;
    }
    return item;
  };
}

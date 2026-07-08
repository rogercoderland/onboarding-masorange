import type { ContentfulConfig } from './config';
import { ContentfulHttpAdapter } from './contentful-http.adapter';
import { ContentfulApiError, ContentfulValidationError } from './errors';

const config: ContentfulConfig = {
  spaceId: 'space',
  environment: 'master',
  deliveryToken: 'tok',
  preview: false,
};

function mockFetch(
  body: unknown,
  init: { ok?: boolean; status?: number } = {},
) {
  return vi.fn().mockResolvedValue({
    ok: init.ok ?? true,
    status: init.status ?? 200,
    statusText: 'OK',
    json: async () => body,
  } as unknown as Response);
}

describe('ContentfulHttpAdapter', () => {
  afterEach(() => vi.restoreAllMocks());

  it('validates the collection and builds the CDA url + auth header', async () => {
    const collection = {
      total: 1,
      skip: 0,
      limit: 100,
      items: [{ sys: { id: 'e1', type: 'Entry' }, fields: { name: 'x' } }],
    };
    const fetchMock = mockFetch(collection);
    vi.stubGlobal('fetch', fetchMock);

    const adapter = new ContentfulHttpAdapter(config);
    const result = await adapter.getEntries({ content_type: 'device', include: 2 });

    expect(result.items).toHaveLength(1);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toContain('/spaces/space/environments/master/entries?');
    expect(url).toContain('content_type=device');
    expect(url).toContain('include=2');
    expect((options as RequestInit).headers).toEqual({ Authorization: 'Bearer tok' });
  });

  it('uses the preview host + token when preview is on', async () => {
    const fetchMock = mockFetch({ total: 0, skip: 0, limit: 0, items: [] });
    vi.stubGlobal('fetch', fetchMock);

    const adapter = new ContentfulHttpAdapter({
      ...config,
      preview: true,
      previewToken: 'preview-tok',
    });
    await adapter.getEntries({ content_type: 'device' });

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toContain('https://preview.contentful.com');
    expect((options as RequestInit).headers).toEqual({
      Authorization: 'Bearer preview-tok',
    });
  });

  it('throws ContentfulApiError on a non-2xx response', async () => {
    vi.stubGlobal('fetch', mockFetch({}, { ok: false, status: 401 }));
    const adapter = new ContentfulHttpAdapter(config);
    await expect(
      adapter.getEntries({ content_type: 'device' }),
    ).rejects.toBeInstanceOf(ContentfulApiError);
  });

  it('throws ContentfulValidationError when the shape is wrong', async () => {
    vi.stubGlobal('fetch', mockFetch({ unexpected: true }));
    const adapter = new ContentfulHttpAdapter(config);
    await expect(
      adapter.getEntries({ content_type: 'device' }),
    ).rejects.toBeInstanceOf(ContentfulValidationError);
  });
});

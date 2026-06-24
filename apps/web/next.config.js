//@ts-check

const { composePlugins, withNx } = require('@nx/next');

const ONE_MINUTE = 60;
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;
const ONE_MONTH = 30 * ONE_DAY;

/**
 * Named `cacheLife` profiles. Referenced by name inside a cached scope, e.g.
 * `cacheLife('catalog')`:
 *   - stale:      how long a cached entry is served without checking freshness
 *   - revalidate: time-based refresh window (background)
 *   - expire:     hard cap before the entry must be regenerated
 * See https://nextjs.org/docs/app/api-reference/functions/cacheLife#custom-cache-profiles
 */
const cacheLife = {
  // The shared device catalog (Catálogo / ISR). Refreshes every 5 minutes in the
  // background but keeps serving the cached list far longer if the mock API fails.
  catalog: {
    stale: ONE_MONTH,
    revalidate: 5 * ONE_MINUTE,
    expire: ONE_MONTH,
  },
};

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  // Use this to set Nx-specific options
  // See: https://nx.dev/recipes/next/next-config-setup
  nx: {},
  cacheComponents: true,
  cacheLife,
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);

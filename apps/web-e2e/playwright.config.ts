import { defineConfig, devices } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const envPath = resolve(__dirname, '../web/.env.local');
try {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
  }
} catch {
  // .env.local is optional locally; the 401 test still runs without it.
}

const PORT = 3300;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './src',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [['list']],
  outputDir: '../../dist/.playwright/web-e2e/test-results',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],
  webServer: {
    command: `pnpm exec next start -p ${PORT}`,
    cwd: resolve(__dirname, '../web'),
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});

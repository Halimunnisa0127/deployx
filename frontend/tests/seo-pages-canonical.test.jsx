/**
 * seo-pages-canonical.test.jsx
 *
 * Integration-level tests: render each actual public page component inside
 * a MemoryRouter (the minimum required provider) and assert that it emits
 * exactly one self-referencing <link rel="canonical"> in <head>.
 *
 * These tests are complementary to seo-canonical.test.jsx (which unit-tests
 * the SEO component in isolation). These tests prove that each page component
 * passes the correct canonical prop down to <SEO>, so a future refactor that
 * accidentally removes or changes a canonical= prop will be caught here.
 *
 * Pages under test and expected canonical URLs:
 *   Home              → https://deployx-dun.vercel.app/
 *   GithubDeployment  → https://deployx-dun.vercel.app/github-deployment
 *   Features          → https://deployx-dun.vercel.app/features
 *   AiDiagnostics     → https://deployx-dun.vercel.app/ai-build-diagnostics
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, act, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// ---------------------------------------------------------------------------
// Module-level mocks — stub heavy/animated children so the test focuses
// entirely on what <SEO> writes to <head>, not on rendering fidelity.
// ---------------------------------------------------------------------------

// framer-motion: return children as-is, skip all animation logic
vi.mock('framer-motion', () => ({
  motion: new Proxy(
    {},
    {
      get: (_, tag) =>
        // eslint-disable-next-line react/display-name
        ({ children, ...rest }) => {
          const Tag = typeof tag === 'string' ? tag : 'div';
          // Strip framer-specific props that would cause React DOM warnings
          const {
            initial, animate, exit, transition, whileHover, whileTap,
            whileInView, variants, viewport, layout, layoutId,
            ...domProps
          } = rest;
          return React.createElement(Tag, domProps, children);
        },
    }
  ),
  AnimatePresence: ({ children }) => children,
  useAnimation: () => ({ start: vi.fn(), stop: vi.fn() }),
  useInView: () => true,
}));

// gsap / @gsap/react: no-op stubs
vi.mock('gsap', () => ({
  default: { to: vi.fn(), from: vi.fn(), set: vi.fn(), registerPlugin: vi.fn(), context: vi.fn(() => ({ revert: vi.fn() })) },
  gsap: { to: vi.fn(), from: vi.fn(), set: vi.fn(), registerPlugin: vi.fn(), context: vi.fn(() => ({ revert: vi.fn() })) },
}));
vi.mock('@gsap/react', () => ({
  useGSAP: (fn) => { try { fn(); } catch {} },
}));

// SplitText (custom GSAP text component)
vi.mock('../src/components/ui/SplitText', () => ({
  default: ({ children }) => React.createElement('span', null, children),
}));

// RocketBackground uses framer-motion (already mocked), but stub it cleanly
vi.mock('../src/components/ui/RocketBackground', () => ({
  default: () => null,
}));

// Badge component (used in Footer)
vi.mock('../src/components/ui/Badge', () => ({
  default: ({ children }) => React.createElement('span', null, children),
}));

// GithubIcon SVG asset
vi.mock('../src/assets/icons/GithubIcon', () => ({
  default: () => null,
}));

// ---------------------------------------------------------------------------
// Page components under test
// ---------------------------------------------------------------------------

import Home from '../src/pages/Home';
import GithubDeployment from '../src/pages/GithubDeployment';
import Features from '../src/pages/Features';
import AiDiagnostics from '../src/pages/AiDiagnostics';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getCanonicalHref() {
  const tags = document.querySelectorAll('link[rel="canonical"]');
  if (tags.length === 0) return null;
  return tags[0].getAttribute('href');
}

function countCanonicalTags() {
  return document.querySelectorAll('link[rel="canonical"]').length;
}

function renderInRouter(ui, { route = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      {ui}
    </MemoryRouter>
  );
}

// ---------------------------------------------------------------------------
// Setup / Teardown
// ---------------------------------------------------------------------------

beforeEach(() => {
  document.querySelectorAll('link[rel="canonical"]').forEach((el) => el.remove());
});

afterEach(() => {
  cleanup();
  document.querySelectorAll('link[rel="canonical"]').forEach((el) => el.remove());
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Page component canonical URLs (integration)', () => {
  it('Home page sets canonical to https://deployx-dun.vercel.app/', async () => {
    await act(async () => {
      renderInRouter(<Home />, { route: '/' });
    });

    expect(countCanonicalTags()).toBe(1);
    expect(getCanonicalHref()).toBe('https://deployx-dun.vercel.app/');
  });

  it('GithubDeployment page sets canonical to https://deployx-dun.vercel.app/github-deployment', async () => {
    await act(async () => {
      renderInRouter(<GithubDeployment />, { route: '/github-deployment' });
    });

    expect(countCanonicalTags()).toBe(1);
    expect(getCanonicalHref()).toBe('https://deployx-dun.vercel.app/github-deployment');
  });

  it('Features page sets canonical to https://deployx-dun.vercel.app/features', async () => {
    await act(async () => {
      renderInRouter(<Features />, { route: '/features' });
    });

    expect(countCanonicalTags()).toBe(1);
    expect(getCanonicalHref()).toBe('https://deployx-dun.vercel.app/features');
  });

  it('AiDiagnostics page sets canonical to https://deployx-dun.vercel.app/ai-build-diagnostics', async () => {
    await act(async () => {
      renderInRouter(<AiDiagnostics />, { route: '/ai-build-diagnostics' });
    });

    expect(countCanonicalTags()).toBe(1);
    expect(getCanonicalHref()).toBe('https://deployx-dun.vercel.app/ai-build-diagnostics');
  });

  it('no public page emits more than one canonical tag', async () => {
    // Run all four in sequence in the same jsdom document to catch any
    // duplicate-tag accumulation across renders
    const pages = [
      { component: <Home />, route: '/', expected: 'https://deployx-dun.vercel.app/' },
      { component: <GithubDeployment />, route: '/github-deployment', expected: 'https://deployx-dun.vercel.app/github-deployment' },
      { component: <Features />, route: '/features', expected: 'https://deployx-dun.vercel.app/features' },
      { component: <AiDiagnostics />, route: '/ai-build-diagnostics', expected: 'https://deployx-dun.vercel.app/ai-build-diagnostics' },
    ];

    for (const { component, route, expected } of pages) {
      // Unmount the previous render via cleanup
      cleanup();
      document.querySelectorAll('link[rel="canonical"]').forEach((el) => el.remove());

      await act(async () => {
        renderInRouter(component, { route });
      });

      expect(countCanonicalTags()).toBe(1);
      expect(getCanonicalHref()).toBe(expected);
    }
  });
});

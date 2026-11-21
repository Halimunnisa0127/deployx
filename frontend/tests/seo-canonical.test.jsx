/**
 * seo-canonical.test.jsx
 *
 * Verifies that every public SEO page renders exactly one self-referencing
 * <link rel="canonical"> after mount, and that client-side navigation between
 * pages leaves the correct canonical behind (no stale homepage URL).
 *
 * Pages under test:
 *   /                    → https://deployx-dun.vercel.app/
 *   /github-deployment   → https://deployx-dun.vercel.app/github-deployment
 *   /features            → https://deployx-dun.vercel.app/features
 *   /ai-build-diagnostics → https://deployx-dun.vercel.app/ai-build-diagnostics
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, act, cleanup } from '@testing-library/react';
import React from 'react';
import SEO from '../src/components/common/SEO';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Return the href of the single canonical tag, or null if none exists. */
function getCanonicalHref() {
  const tags = document.querySelectorAll('link[rel="canonical"]');
  if (tags.length === 0) return null;
  return tags[0].getAttribute('href');
}

/** Return how many canonical tags exist in <head>. */
function countCanonicalTags() {
  return document.querySelectorAll('link[rel="canonical"]').length;
}

// ---------------------------------------------------------------------------
// Setup / Teardown
// ---------------------------------------------------------------------------

beforeEach(() => {
  // Remove any canonical tags left from a previous test (jsdom persists <head>)
  document.querySelectorAll('link[rel="canonical"]').forEach((el) => el.remove());
});

afterEach(() => {
  cleanup();
  // Ensure a clean head for the next test
  document.querySelectorAll('link[rel="canonical"]').forEach((el) => el.remove());
});

// ---------------------------------------------------------------------------
// Individual page canonical URL tests
// ---------------------------------------------------------------------------

describe('SEO canonical — public pages (direct navigation)', () => {
  it('Homepage outputs canonical https://deployx-dun.vercel.app/', async () => {
    await act(async () => {
      render(
        <SEO
          title="DeployX – GitHub Deployment Platform & AI Build Diagnostics"
          canonical="https://deployx-dun.vercel.app/"
          robots="index,follow"
        />
      );
    });

    expect(countCanonicalTags()).toBe(1);
    expect(getCanonicalHref()).toBe('https://deployx-dun.vercel.app/');
  });

  it('GitHub Deployment outputs canonical https://deployx-dun.vercel.app/github-deployment', async () => {
    await act(async () => {
      render(
        <SEO
          title="GitHub Deployment Platform | DeployX"
          canonical="https://deployx-dun.vercel.app/github-deployment"
          robots="index,follow"
        />
      );
    });

    expect(countCanonicalTags()).toBe(1);
    expect(getCanonicalHref()).toBe('https://deployx-dun.vercel.app/github-deployment');
  });

  it('Features outputs canonical https://deployx-dun.vercel.app/features', async () => {
    await act(async () => {
      render(
        <SEO
          title="DeployX Features"
          canonical="https://deployx-dun.vercel.app/features"
          robots="index,follow"
        />
      );
    });

    expect(countCanonicalTags()).toBe(1);
    expect(getCanonicalHref()).toBe('https://deployx-dun.vercel.app/features');
  });

  it('AI Build Diagnostics outputs canonical https://deployx-dun.vercel.app/ai-build-diagnostics', async () => {
    await act(async () => {
      render(
        <SEO
          title="AI Build Diagnostics | DeployX"
          canonical="https://deployx-dun.vercel.app/ai-build-diagnostics"
          robots="index,follow"
        />
      );
    });

    expect(countCanonicalTags()).toBe(1);
    expect(getCanonicalHref()).toBe('https://deployx-dun.vercel.app/ai-build-diagnostics');
  });
});

// ---------------------------------------------------------------------------
// No duplicate tags
// ---------------------------------------------------------------------------

describe('SEO canonical — no duplicate tags', () => {
  it('renders exactly one canonical tag, never more', async () => {
    // Simulate a stale tag already in the document (like the old index.html had)
    const stale = document.createElement('link');
    stale.setAttribute('rel', 'canonical');
    stale.setAttribute('href', 'https://deployx-dun.vercel.app/');
    document.head.appendChild(stale);

    await act(async () => {
      render(
        <SEO
          title="AI Build Diagnostics | DeployX"
          canonical="https://deployx-dun.vercel.app/ai-build-diagnostics"
          robots="index,follow"
        />
      );
    });

    // Must have collapsed to exactly one tag with the correct page URL
    expect(countCanonicalTags()).toBe(1);
    expect(getCanonicalHref()).toBe('https://deployx-dun.vercel.app/ai-build-diagnostics');
  });
});

// ---------------------------------------------------------------------------
// Client-side navigation simulation
// ---------------------------------------------------------------------------

describe('SEO canonical — client-side navigation between public pages', () => {
  it('navigating Home → AI Diagnostics leaves the AI Diagnostics canonical', async () => {
    // 1. Mount Home
    const { unmount: unmountHome } = await act(async () =>
      render(
        <SEO
          title="Home"
          canonical="https://deployx-dun.vercel.app/"
          robots="index,follow"
        />
      )
    );

    expect(getCanonicalHref()).toBe('https://deployx-dun.vercel.app/');

    // 2. Unmount Home (simulates navigation away)
    await act(async () => { unmountHome(); });

    // 3. Mount AI Diagnostics (simulates new route rendering)
    await act(async () => {
      render(
        <SEO
          title="AI Build Diagnostics | DeployX"
          canonical="https://deployx-dun.vercel.app/ai-build-diagnostics"
          robots="index,follow"
        />
      );
    });

    expect(countCanonicalTags()).toBe(1);
    expect(getCanonicalHref()).toBe('https://deployx-dun.vercel.app/ai-build-diagnostics');
  });

  it('navigating AI Diagnostics → Features leaves the Features canonical', async () => {
    const { unmount: unmountAi } = await act(async () =>
      render(
        <SEO
          title="AI Build Diagnostics | DeployX"
          canonical="https://deployx-dun.vercel.app/ai-build-diagnostics"
          robots="index,follow"
        />
      )
    );

    expect(getCanonicalHref()).toBe('https://deployx-dun.vercel.app/ai-build-diagnostics');

    await act(async () => { unmountAi(); });

    await act(async () => {
      render(
        <SEO
          title="DeployX Features"
          canonical="https://deployx-dun.vercel.app/features"
          robots="index,follow"
        />
      );
    });

    expect(countCanonicalTags()).toBe(1);
    expect(getCanonicalHref()).toBe('https://deployx-dun.vercel.app/features');
  });

  it('navigating Features → GitHub Deployment leaves the GitHub Deployment canonical', async () => {
    const { unmount: unmountFeatures } = await act(async () =>
      render(
        <SEO
          title="DeployX Features"
          canonical="https://deployx-dun.vercel.app/features"
          robots="index,follow"
        />
      )
    );

    expect(getCanonicalHref()).toBe('https://deployx-dun.vercel.app/features');

    await act(async () => { unmountFeatures(); });

    await act(async () => {
      render(
        <SEO
          title="GitHub Deployment | DeployX"
          canonical="https://deployx-dun.vercel.app/github-deployment"
          robots="index,follow"
        />
      );
    });

    expect(countCanonicalTags()).toBe(1);
    expect(getCanonicalHref()).toBe('https://deployx-dun.vercel.app/github-deployment');
  });

  it('navigating GitHub Deployment → Home leaves the Home canonical', async () => {
    const { unmount: unmountGithub } = await act(async () =>
      render(
        <SEO
          title="GitHub Deployment | DeployX"
          canonical="https://deployx-dun.vercel.app/github-deployment"
          robots="index,follow"
        />
      )
    );

    expect(getCanonicalHref()).toBe('https://deployx-dun.vercel.app/github-deployment');

    await act(async () => { unmountGithub(); });

    await act(async () => {
      render(
        <SEO
          title="DeployX Home"
          canonical="https://deployx-dun.vercel.app/"
          robots="index,follow"
        />
      );
    });

    expect(countCanonicalTags()).toBe(1);
    expect(getCanonicalHref()).toBe('https://deployx-dun.vercel.app/');
  });
});

// ---------------------------------------------------------------------------
// Private/auth routes — no canonical tag emitted
// ---------------------------------------------------------------------------

describe('SEO canonical — private/auth routes', () => {
  it('emits no canonical tag when canonical prop is omitted (private route)', async () => {
    await act(async () => {
      render(
        <SEO
          title="Dashboard | DeployX"
          robots="noindex,nofollow"
          // no canonical prop — private/auth route
        />
      );
    });

    expect(countCanonicalTags()).toBe(0);
  });

  it('removes an existing canonical tag when navigating to a private route', async () => {
    // Simulate coming from a public page that set a canonical
    const { unmount: unmountPublic } = await act(async () =>
      render(
        <SEO
          title="DeployX Features"
          canonical="https://deployx-dun.vercel.app/features"
          robots="index,follow"
        />
      )
    );

    expect(countCanonicalTags()).toBe(1);

    await act(async () => { unmountPublic(); });

    // Navigate to dashboard (private — no canonical)
    await act(async () => {
      render(
        <SEO
          title="Dashboard | DeployX"
          robots="noindex,nofollow"
        />
      );
    });

    expect(countCanonicalTags()).toBe(0);
  });
});

import { describe, it, expect, beforeEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { StrictMode } from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import SEO from '../src/components/common/SEO';
import AuthLayout from '../src/layouts/AuthLayout';
import DashboardLayout from '../src/layouts/DashboardLayout';
import AdminLayout from '../src/layouts/AdminLayout';
import OAuthSuccess from '../src/features/auth/pages/OAuthSuccess';
import Home from '../src/pages/Home';
import GithubDeployment from '../src/pages/GithubDeployment';
import Features from '../src/pages/Features';
import AiDiagnostics from '../src/pages/AiDiagnostics';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// Minimal mock store for layouts
const createMockStore = (initialAuthState = {}) => {
  return configureStore({
    reducer: {
      auth: (state = { user: null, token: null, status: 'idle', ...initialAuthState }) => state,
      ui: (state = { isAIAssistantOpen: false }) => state,
      projects: (state = {}) => state,
      notifications: (state = { items: [] }) => state,
    },
  });
};

describe('DeployX Technical SEO & Metadata Tests', () => {
  beforeEach(() => {
    cleanup();
    document.title = 'Default Title';
    // Clean up head tags
    document
      .querySelectorAll(
        'meta[name="robots"], meta[name="description"], meta[property^="og:"], meta[name^="twitter:"], link[rel="canonical"], script[type="application/ld+json"][data-deployx-seo="true"]'
      )
      .forEach((el) => el.remove());
  });

  it('updates title, description, robots, canonical, OG, Twitter, and JSON-LD for public homepage', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Home />
      </MemoryRouter>
    );

    expect(document.title).toBe('DeployX – GitHub Deployment Platform & AI Build Diagnostics');

    const robotsMeta = document.querySelector('meta[name="robots"]');
    expect(robotsMeta?.getAttribute('content')).toBe('index,follow');

    const descMeta = document.querySelector('meta[name="description"]');
    expect(descMeta?.getAttribute('content')).toContain('Deploy GitHub projects with automated builds');

    const canonicalLink = document.querySelector('link[rel="canonical"]');
    expect(canonicalLink?.getAttribute('href')).toBe('https://deployx-dun.vercel.app/');

    const ogTitle = document.querySelector('meta[property="og:title"]');
    expect(ogTitle?.getAttribute('content')).toBe('DeployX – GitHub Deployment Platform & AI Build Diagnostics');

    const jsonLd = document.querySelector('script[type="application/ld+json"][data-deployx-seo="true"]');
    expect(jsonLd).not.toBeNull();
    const parsed = JSON.parse(jsonLd?.textContent || '{}');
    expect(parsed['@graph']).toBeDefined();
    expect(parsed['@graph'].some((item) => item['@type'] === 'SoftwareApplication')).toBe(true);

    const org = parsed['@graph'].find((item) => item['@type'] === 'Organization');
    expect(org).toBeDefined();
    expect(org?.logo).toBe('https://deployx-dun.vercel.app/deployx-logo.jpg');

    const app = parsed['@graph'].find((item) => item['@type'] === 'SoftwareApplication');
    expect(app).toBeDefined();
    expect(app?.offers).toBeUndefined();
  });

  it('renders correct SEO metadata and self-referencing canonical for /github-deployment', () => {
    render(
      <MemoryRouter initialEntries={['/github-deployment']}>
        <GithubDeployment />
      </MemoryRouter>
    );

    expect(document.title).toContain('GitHub Deployment Platform');
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('index,follow');

    const canonicalLink = document.querySelector('link[rel="canonical"]');
    expect(canonicalLink?.getAttribute('href')).toBe('https://deployx-dun.vercel.app/github-deployment');

    const h1 = document.querySelector('h1');
    expect(h1?.textContent).toContain('GitHub Deployment Platform');
  });

  it('renders correct SEO metadata and self-referencing canonical for /features', () => {
    render(
      <MemoryRouter initialEntries={['/features']}>
        <Features />
      </MemoryRouter>
    );

    expect(document.title).toContain('DeployX Features');
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('index,follow');

    const canonicalLink = document.querySelector('link[rel="canonical"]');
    expect(canonicalLink?.getAttribute('href')).toBe('https://deployx-dun.vercel.app/features');

    const h1 = document.querySelector('h1');
    expect(h1?.textContent).toContain('DeployX Features');
  });

  it('renders correct SEO metadata and self-referencing canonical for /ai-build-diagnostics', () => {
    render(
      <MemoryRouter initialEntries={['/ai-build-diagnostics']}>
        <AiDiagnostics />
      </MemoryRouter>
    );

    expect(document.title).toContain('AI Build Diagnostics');
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('index,follow');

    const canonicalLink = document.querySelector('link[rel="canonical"]');
    expect(canonicalLink?.getAttribute('href')).toBe('https://deployx-dun.vercel.app/ai-build-diagnostics');

    const h1 = document.querySelector('h1');
    expect(h1?.textContent).toContain('AI-Powered Build Diagnostics');
  });

  it('removes canonical link when navigating from public route to auth route', () => {
    // Pre-populate canonical as if loaded from /
    const initialCanonical = document.createElement('link');
    initialCanonical.setAttribute('rel', 'canonical');
    initialCanonical.setAttribute('href', 'https://deployx-dun.vercel.app/');
    document.head.appendChild(initialCanonical);

    expect(document.querySelector('link[rel="canonical"]')).not.toBeNull();

    // Render an auth SEO component without canonical
    render(
      <SEO
        title="Sign In – DeployX"
        description="Sign in to your DeployX account."
        robots="noindex,nofollow"
      />
    );

    expect(document.title).toBe('Sign In – DeployX');
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex,nofollow');
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
  });

  it('applies noindex,nofollow via AuthLayout on /login, /signup, /forgot-password', () => {
    const { unmount } = render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<div>Login Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(document.title).toBe('Sign In – DeployX');
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex,nofollow');
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
    unmount();

    render(
      <MemoryRouter initialEntries={['/forgot-password']}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/forgot-password" element={<div>Forgot Password</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(document.title).toBe('Reset Password – DeployX');
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex,nofollow');
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
  });

  it('applies noindex,nofollow on OAuthSuccess component', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/oauth/success']}>
          <OAuthSuccess />
        </MemoryRouter>
      </Provider>
    );

    expect(document.title).toBe('Connecting Account – DeployX');
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex,nofollow');
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
  });

  it('applies noindex,nofollow via DashboardLayout on /dashboard routes', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/dashboard']}>
          <DashboardLayout>
            <div>Dashboard Content</div>
          </DashboardLayout>
        </MemoryRouter>
      </Provider>
    );

    expect(document.title).toBe('Dashboard – DeployX');
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex,nofollow');
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
  });

  it('applies noindex,nofollow via AdminLayout on /admin routes', () => {
    const store = createMockStore({ user: { role: 'admin' } });
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/admin']}>
          <AdminLayout>
            <div>Admin Content</div>
          </AdminLayout>
        </MemoryRouter>
      </Provider>
    );

    expect(document.title).toBe('Admin Dashboard – DeployX');
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex,nofollow');
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
  });

  it('deduplicates tags and prevents stale meta in React StrictMode', () => {
    render(
      <StrictMode>
        <SEO
          title="Strict Mode Test – DeployX"
          description="Testing React StrictMode behavior"
          robots="index,follow"
          canonical="https://deployx-dun.vercel.app/test"
          ogTitle="Strict OG Title"
          jsonLd={{ "@type": "Thing", "name": "Strict Test" }}
        />
      </StrictMode>
    );

    expect(document.title).toBe('Strict Mode Test – DeployX');

    const robotsMetas = document.querySelectorAll('meta[name="robots"]');
    expect(robotsMetas.length).toBe(1);

    const descMetas = document.querySelectorAll('meta[name="description"]');
    expect(descMetas.length).toBe(1);

    const canonicalLinks = document.querySelectorAll('link[rel="canonical"]');
    expect(canonicalLinks.length).toBe(1);

    const ogTitles = document.querySelectorAll('meta[property="og:title"]');
    expect(ogTitles.length).toBe(1);

    const jsonLds = document.querySelectorAll('script[type="application/ld+json"][data-deployx-seo="true"]');
    expect(jsonLds.length).toBe(1);
  });

  it('removes static og:url on private routes to prevent leaking homepage URL', () => {
    // Simulate static index.html og:url tag
    const staticOgUrl = document.createElement('meta');
    staticOgUrl.setAttribute('property', 'og:url');
    staticOgUrl.setAttribute('content', 'https://deployx-dun.vercel.app/');
    document.head.appendChild(staticOgUrl);

    expect(document.querySelector('meta[property="og:url"]')?.getAttribute('content')).toBe(
      'https://deployx-dun.vercel.app/'
    );

    // Render private route SEO (no ogUrl and no canonical)
    const { unmount } = render(
      <SEO
        title="Dashboard – DeployX"
        description="Private deployment dashboard."
        robots="noindex,nofollow"
      />
    );

    // og:url MUST be removed so private routes do not retain homepage URL
    expect(document.querySelector('meta[property="og:url"]')).toBeNull();

    // On unmount, previousContent is restored cleanly
    unmount();
    expect(document.querySelector('meta[property="og:url"]')?.getAttribute('content')).toBe(
      'https://deployx-dun.vercel.app/'
    );
  });

  it('removes static og:url under React StrictMode on private routes', () => {
    const staticOgUrl = document.createElement('meta');
    staticOgUrl.setAttribute('property', 'og:url');
    staticOgUrl.setAttribute('content', 'https://deployx-dun.vercel.app/');
    document.head.appendChild(staticOgUrl);

    render(
      <StrictMode>
        <SEO
          title="Sign In – DeployX"
          description="Authentication page."
          robots="noindex,nofollow"
        />
      </StrictMode>
    );

    expect(document.querySelector('meta[property="og:url"]')).toBeNull();
  });
});

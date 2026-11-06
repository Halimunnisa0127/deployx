import { useEffect } from "react";

export default function SEO({
  title = "DeployX – GitHub Deployment Platform & AI Build Diagnostics",
  description = "Deploy GitHub projects with automated builds, deployment monitoring, live logs, rollback workflows, and AI-powered build diagnostics. Simplify your deployment workflow with DeployX.",
  robots = "index,follow",
  canonical,
  ogTitle,
  ogDescription,
  ogType = "website",
  ogUrl,
  twitterTitle,
  twitterDescription,
  jsonLd,
}) {
  useEffect(() => {
    const previousTitle = document.title;

    // Helper to update standard meta tags without duplicating them
    const updateMeta = (name, content) => {
      if (content === undefined) return () => {};
      const elements = document.querySelectorAll(`meta[name="${name}"]`);
      let element = elements[0];
      const existed = Boolean(element);

      // Remove any duplicate tags
      for (let i = 1; i < elements.length; i++) {
        elements[i].remove();
      }

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute("name", name);
        document.head.appendChild(element);
      }

      const previousContent = existed ? element.getAttribute("content") : null;
      element.setAttribute("content", content);

      return () => {
        if (existed) {
          if (previousContent === null) {
            element.removeAttribute("content");
          } else {
            element.setAttribute("content", previousContent);
          }
        } else {
          element.remove();
        }
      };
    };

    // Helper to update Open Graph meta tags (property="...")
    const updatePropertyMeta = (property, content) => {
      const elements = document.querySelectorAll(`meta[property="${property}"]`);
      let element = elements[0];
      const existed = Boolean(element);
      const previousContent = existed ? element.getAttribute("content") : null;

      for (let i = 1; i < elements.length; i++) {
        elements[i].remove();
      }

      if (content) {
        if (!element) {
          element = document.createElement("meta");
          element.setAttribute("property", property);
          document.head.appendChild(element);
        }
        element.setAttribute("content", content);
      } else {
        if (element) {
          element.remove();
        }
      }

      return () => {
        if (existed) {
          let currentEl = document.querySelector(`meta[property="${property}"]`);
          if (previousContent !== null) {
            if (!currentEl) {
              currentEl = document.createElement("meta");
              currentEl.setAttribute("property", property);
              document.head.appendChild(currentEl);
            }
            currentEl.setAttribute("content", previousContent);
          } else if (currentEl) {
            currentEl.remove();
          }
        } else {
          const currentEl = document.querySelector(`meta[property="${property}"]`);
          if (currentEl) {
            currentEl.remove();
          }
        }
      };
    };

    // Helper to manage canonical link tag
    const updateCanonical = (canonicalUrl) => {
      const elements = document.querySelectorAll('link[rel="canonical"]');
      let element = elements[0];
      const existed = Boolean(element);
      const previousHref = existed ? element.getAttribute("href") : null;

      // Remove any duplicate canonical links
      for (let i = 1; i < elements.length; i++) {
        elements[i].remove();
      }

      if (canonicalUrl) {
        if (!element) {
          element = document.createElement("link");
          element.setAttribute("rel", "canonical");
          document.head.appendChild(element);
        }
        element.setAttribute("href", canonicalUrl);
      } else {
        // Remove canonical tag if route does not specify one
        if (element) {
          element.remove();
        }
      }

      return () => {
        if (existed) {
          let currentEl = document.querySelector('link[rel="canonical"]');
          if (previousHref) {
            if (!currentEl) {
              currentEl = document.createElement("link");
              currentEl.setAttribute("rel", "canonical");
              document.head.appendChild(currentEl);
            }
            currentEl.setAttribute("href", previousHref);
          } else if (currentEl) {
            currentEl.remove();
          }
        } else {
          const currentEl = document.querySelector('link[rel="canonical"]');
          if (currentEl) {
            currentEl.remove();
          }
        }
      };
    };

    // Helper to manage JSON-LD structured data
    const updateJsonLd = (schemaData) => {
      const elements = document.querySelectorAll('script[type="application/ld+json"][data-deployx-seo="true"]');
      let element = elements[0];
      const existed = Boolean(element);
      const previousContent = existed ? element.textContent : null;

      for (let i = 1; i < elements.length; i++) {
        elements[i].remove();
      }

      if (schemaData) {
        if (!element) {
          element = document.createElement("script");
          element.setAttribute("type", "application/ld+json");
          element.setAttribute("data-deployx-seo", "true");
          document.head.appendChild(element);
        }
        element.textContent = JSON.stringify(schemaData);
      } else {
        if (element) {
          element.remove();
        }
      }

      return () => {
        if (existed) {
          let currentEl = document.querySelector('script[type="application/ld+json"][data-deployx-seo="true"]');
          if (previousContent) {
            if (!currentEl) {
              currentEl = document.createElement("script");
              currentEl.setAttribute("type", "application/ld+json");
              currentEl.setAttribute("data-deployx-seo", "true");
              document.head.appendChild(currentEl);
            }
            currentEl.textContent = previousContent;
          } else if (currentEl) {
            currentEl.remove();
          }
        } else {
          const currentEl = document.querySelector('script[type="application/ld+json"][data-deployx-seo="true"]');
          if (currentEl) {
            currentEl.remove();
          }
        }
      };
    };

    document.title = title;

    const restoreDescription = updateMeta("description", description);
    const restoreRobots = updateMeta("robots", robots);
    const restoreCanonical = updateCanonical(canonical);

    // Open Graph metadata
    const restoreOgTitle = updatePropertyMeta("og:title", ogTitle || title);
    const restoreOgDesc = updatePropertyMeta("og:description", ogDescription || description);
    const restoreOgType = updatePropertyMeta("og:type", ogType);
    const restoreOgUrl = updatePropertyMeta("og:url", ogUrl || canonical);

    // Twitter metadata
    const restoreTwitterTitle = updateMeta("twitter:title", twitterTitle || title);
    const restoreTwitterDesc = updateMeta("twitter:description", twitterDescription || description);

    // Structured Data
    const restoreJsonLd = updateJsonLd(jsonLd);

    return () => {
      document.title = previousTitle;
      restoreDescription();
      restoreRobots();
      restoreCanonical();
      restoreOgTitle();
      restoreOgDesc();
      restoreOgType();
      restoreOgUrl();
      restoreTwitterTitle();
      restoreTwitterDesc();
      restoreJsonLd();
    };
  }, [
    title,
    description,
    robots,
    canonical,
    ogTitle,
    ogDescription,
    ogType,
    ogUrl,
    twitterTitle,
    twitterDescription,
    jsonLd,
  ]);

  return null;
}

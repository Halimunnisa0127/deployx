import { useEffect } from "react";

export default function SEO({
  title = "DeployX – GitHub Deployment Platform",
  description = "Deploy GitHub projects with automated builds and AI-powered diagnostics.",
  robots = "index,follow",
  canonical,
}) {
  useEffect(() => {
    const previousTitle = document.title;

    // Helper to update meta tags without duplicating them
    const updateMeta = (name, content) => {
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

    document.title = title;

    const restoreDescription = updateMeta("description", description);
    const restoreRobots = updateMeta("robots", robots);
    const restoreCanonical = updateCanonical(canonical);

    return () => {
      document.title = previousTitle;
      restoreDescription();
      restoreRobots();
      restoreCanonical();
    };
  }, [title, description, robots, canonical]);

  return null;
}

# ADR-002: Migrate Frontend Framework from React SPA to Next.js

**Date:** 2026-06-30  
**Status:** Accepted  
**Deciders:** Engineering Department  

## Context
Our current application is built as a client-side rendered (CSR) React Single Page Application (SPA) using Vite/Create React App. As the project grows, we are facing critical limitations regarding search engine optimization (SEO) and initial page load performance. Because the application renders entirely in the browser, search engine web crawlers struggle to index our dynamic content efficiently, and users experience a blank screen or a heavy loading spinner while the JavaScript bundle downloads. 

We need a framework that retains our React component ecosystem while solving these performance, routing, and discoverability issues.

## Decision
We will migrate our core frontend framework from a standard React SPA to **Next.js** using the modern **App Router**. We will leverage its hybrid rendering capabilities, using Server-Side Rendering (SSR) for public, content-heavy marketing pages to maximize SEO, while continuing to utilize Client Components (`'use client'`) for highly interactive, authenticated dashboard views.

## Alternatives Considered

| Option | Pros | Cons |
| :--- | :--- | :--- |
| **Next.js (App Router)** | • Built-in SSR/SSG for excellent SEO<br>• Automatic code splitting and image optimization<br>• File-system routing simplifies codebase | • Steeper learning curve for the team<br>• Requires migrating existing routing logic |
| **React SPA + Vite + Prerendering** | • Minimal code refactoring required<br>• Familiar development workflow<br>• Fast build times | • Prerendering plugins are brittle for dynamic data<br>• Large initial JS bundle sizes persist<br>• No native server-side capabilities |
| **Remix** | • Excellent data loading and mutation APIs<br>• Strong emphasis on web standards | • Smaller community and ecosystem than Next.js<br>• Migration path from our current React code is steeper |

## Consequences

- **Positive:** Significant boost in SEO performance and core web vitals (FCP/LCP). Out-of-the-box optimization features (Fonts, Images, Scripts) reduce manual performance tuning.
- **Negative:** The team must adapt to the Next.js mental model of Server vs. Client components. Existing client-side routing (`react-router-dom`) must be rewritten to match Next.js's file-system structure.
- **Neutral:** Server deployment infrastructure must now support a Node.js server runtime (or Vercel/Amplify) instead of hosting simple static files on an S3 bucket.

## Links
- [Next.js Official Documentation](https://nextjs.org/docs)
- Related ADR: ADR-001 (Use PostgreSQL as the primary database)

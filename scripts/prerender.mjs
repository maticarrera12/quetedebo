// Runs after `vite build`: renders every route in src/seo.ts to static HTML inside dist/.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

const escapeAttr = (value) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

const server = await createServer({ root, appType: "custom", server: { middlewareMode: true }, logLevel: "error" });

try {
  const { render } = await server.ssrLoadModule("/src/entry-server.tsx");
  const { PRERENDER_ROUTES, SITE_URL } = await server.ssrLoadModule("/src/seo.ts");
  const template = await readFile(join(dist, "index.html"), "utf8");

  for (const route of PRERENDER_ROUTES) {
    const url = new URL(route.path, SITE_URL).href;
    const title = escapeAttr(route.title);
    const description = escapeAttr(route.description);

    const html = template
      .replace('<div id="root"></div>', `<div id="root">${render(route.path)}</div>`)
      .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
      .replace(/(<meta\s+name="description"\s+content=")[^"]*"/, `$1${description}"`)
      .replace(
        /<link rel="canonical" href="[^"]*" \/>/,
        route.errorFile ? '<meta name="robots" content="noindex" />' : `<link rel="canonical" href="${url}" />`
      )
      .replace(/(<meta property="og:title" content=")[^"]*"/, `$1${title}"`)
      .replace(/(<meta name="twitter:title" content=")[^"]*"/, `$1${title}"`)
      .replace(/(<meta property="og:url" content=")[^"]*"/, `$1${url}"`);

    const file = route.errorFile
      ? join(dist, route.errorFile)
      : route.path === "/"
        ? join(dist, "index.html")
        : join(dist, route.path, "index.html");
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, html);
    console.log(`prerendered ${route.path} -> ${file.replace(root + "/", "")}`);
  }
} finally {
  await server.close();
}

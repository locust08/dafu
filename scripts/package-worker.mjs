import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const server = new URL('../dist/server/', import.meta.url);
const deploy = new URL('../dist/deploy/', import.meta.url);
const config = JSON.parse(await readFile(new URL('wrangler.json', server), 'utf8'));

// Collapse Astro's server chunks into one module for the Worker upload.
await mkdir(deploy, { recursive: true });
await build({
  entryPoints: [fileURLToPath(new URL(config.main, server))],
  outfile: fileURLToPath(new URL(config.main, deploy)),
  bundle: true,
  platform: 'node',
  format: 'esm',
  external: ['cloudflare:*'],
  minify: true,
});
await writeFile(new URL('wrangler.json', deploy), JSON.stringify(config, null, 2) + '\n');

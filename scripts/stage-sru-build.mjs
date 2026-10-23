// Keep the existing Cloudflare build command and output directory working.
import {cp, rm} from 'node:fs/promises';
const output = new URL('../build/', import.meta.url);
await rm(output, {recursive: true, force: true});
await cp(new URL('../apps/loi-sru/build/', import.meta.url), output, {recursive: true});

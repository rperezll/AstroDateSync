/**
 * Copyright © rperezll (https://github.com/rperezll)
 *
 * This file is part of a project licensed under the GPL-3.0 License.
 * See the LICENSE file in the root directory for more information.
 */

import type { AstroIntegration } from 'astro';

import * as path from 'path';
import * as fs from 'fs';
import { debugLogger } from './logger';
import { updatePublishDate } from './searchUpdateDate';

let lastModified: Record<string, number> = {};
let fileContents: Record<string, string> = {};

/**
 * **AstroDateSync** Integration.
 * 
 * @abstract 
 * AstroDateSync is an integration for Astro that **automatically updates** the `publishDate` field 
 * in the frontmatter of your `.mdx` files whenever they are modified, ensuring your documentation 
 * content reflects the most current update date.
 * 
 * @documentation https://github.com/rperezll/
 * 
 * @param {string} docsPath - The file path (glob pattern) to the `.mdx` documents that need to be watched 
 *                            for changes.
 * @param {Object} [config] - (*Optional*) Configuration object.
 * @param {boolean} [config.debug] - (*Optional*) Debug flag to enable detailed logging for debugging purposes. Default is `false`.
 * 
 * @returns {AstroIntegration} The integration to be used with Astro.
 */
export const AstroDateSync = (docsPath: string, config?: { debug: boolean } ): AstroIntegration => {
  return {
    name: 'astro-date-sync',
    hooks: {
      'astro:server:setup': async ({ logger }) => {
        logger.info('Setup watcher...');

        const docsDir = path.resolve(process.cwd(), docsPath);
        const filesToWatch = path.resolve(process.cwd(), `${docsPath}/**/*.mdx`);

        logger.info(`Watching path: ${filesToWatch}`);

        const readFileContent = (filePath: string) => {
          return new Promise<string>((resolve, reject) => {
            fs.readFile(filePath, 'utf-8', (err, data) => {
              if (err) {
                reject(`Error reading file: ${filePath}`);
              } else {
                resolve(data);
              }
            });
          });
        };

        fs.watch(docsDir, { recursive: true }, async (eventType, filename) => {
          if (filename && filename.endsWith('.mdx')) {
            const filePath = path.join(docsDir, filename);

            const now = Date.now();
            const lastTime = lastModified[filePath] || 0;
            const timeDifference = now - lastTime;

            // If the file has been modified within a short interval (debounce), ignore it
            if (timeDifference < 1000) return;
            lastModified[filePath] = now;

            try {
              const currentContent = await readFileContent(filePath);
              const previousContent = fileContents[filePath];

              if (previousContent && previousContent !== currentContent) {
                //detectChanges(previousContent, currentContent);
                updatePublishDate(filePath, logger, config?.debug ?? false);
                debugLogger(config?.debug ?? false, logger, `File changed: ${filename}`);
              } else {
                debugLogger(config?.debug ?? false, logger, `File changed (no visible change): ${filename}`);
              }

              fileContents[filePath] = currentContent;
            } catch (error) {
              logger.error(`${error}`);
            }
          }
        });

        logger.info('Setup complete!');
      },
    },
  };
}

// TO-DO
function detectChanges(previousContent: string, currentContent: string): string {
  const previousLines = previousContent.split('\n');
  const currentLines = currentContent.split('\n');
  
  let changes: string[] = [];

  const maxLength = Math.max(previousLines.length, currentLines.length);
  for (let i = 0; i < maxLength; i++) {
    if (previousLines[i] !== currentLines[i]) {
      changes.push(`Line ${i + 1} changed: \n  - Before: ${previousLines[i] || 'N/A'}\n  - After: ${currentLines[i] || 'N/A'}`);
    }
  }

  return changes.length ? changes.join('\n') : 'No visible change detected';
}


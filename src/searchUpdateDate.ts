/**
 * Copyright © rperezll (https://github.com/rperezll)
 *
 * This file is part of a project licensed under the GPL-3.0 License.
 * See the LICENSE file in the root directory for more information.
 */

import { AstroIntegrationLogger } from 'astro';

import * as fs from 'fs';
import { FrontMatterRegex } from './globals';
import { debugLogger } from './logger';

export const updatePublishDate = (filePath: string, logger: AstroIntegrationLogger, debug: boolean) => {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const match = FrontMatterRegex.exec(fileContent);

        if (match) {
        let frontMatter = match[1];

        debugLogger(debug, logger, `Found FrontMatter to update:\n ${frontMatter} in ${filePath}`);

        const publishDateRegex = /publishDate:\s*"([^"]*)"/;
        const currentDate = new Date().toISOString().split('T')[0];

        if (publishDateRegex.test(frontMatter)) {
            frontMatter = frontMatter.replace(publishDateRegex, `publishDate: "${currentDate}"`);
        } else {
        //   frontMatter += `\npublishDate: "${currentDate}"`;
            debugLogger(debug, logger, `The date field does not exist:\n ${frontMatter} in ${filePath}`);
        }

        const updatedContent = fileContent.replace(FrontMatterRegex, `---\n${frontMatter}\n---\n\n`);

        fs.writeFileSync(filePath, updatedContent, 'utf-8');

        logger.info(`Date field updated to ${currentDate} in ${filePath}`);
        } else {
        debugLogger(debug, logger, `No frontmatter found in ${filePath}`);
        }
    } catch (error) {
        logger.error(`Error updating publishDate in ${filePath}: ${error}`);
    }
};
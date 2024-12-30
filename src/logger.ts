/**
 * Copyright © rperezll (https://github.com/rperezll)
 *
 * This file is part of a project licensed under the GPL-3.0 License.
 * See the LICENSE file in the root directory for more information.
 */

import { AstroIntegrationLogger } from "astro";

export const debugLogger = (debug: boolean, logger: AstroIntegrationLogger, message: string) => {
    if (debug) {
        logger.info(message);
    }
}
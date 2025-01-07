import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
    {
        extends: "./vitest.config.js",
        test: {
            name: "Node"
        }
    },
    {
        extends: "./vitest.config.js",
        test: {
            name: "Browser",
            browser: {
                enabled: true
            }
        }
    }
]);

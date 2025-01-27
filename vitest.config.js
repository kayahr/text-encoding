import { defineConfig } from "vitest/config";

import tsconfig from "./tsconfig.json" with { type: "json" };

export default defineConfig({
    esbuild: {
        target: tsconfig.compilerOptions.target
    },
    test: {
        include: [ "src/test/**/*.test.ts" ],
        reporters: [
            "default",
            [ "junit", { outputFile: "lib/test/junit.xml", suiteName: "cdi tests" } ]
        ],
        env: {
            NODE_OPTIONS: `${process.env.NODE_OPTIONS ?? ""} --expose-gc`
        },
        browser: {
            provider: "playwright",
            headless: true,
            screenshotFailures: false,
            instances: [
                {
                    browser: "chromium",
                    launch: {
                        args: [
                            "--js-flags=--expose-gc"
                        ]
                    }
                }
            ]
        },
        coverage: {
            enabled: true,
            reporter: [ "text-summary", "json", "lcov", "clover", "cobertura", "html" ],
            reportsDirectory: "lib/test/coverage",
            include: [ "src/main/**/*.ts" ]
        }
    }
});

/* eslint-disable node/no-unpublished-import */

import { defineConfig } from "cypress";

export default defineConfig({
    e2e: {
        baseUrl: "http://localhost:7000",
        specPattern: "cypress/e2e/**/*.cy.ts",
        supportFile: false,
        projectId: "xya1fn"
    }
});

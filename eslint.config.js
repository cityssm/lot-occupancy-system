import { configWebApp, tseslint } from 'eslint-config-cityssm';
export const config = tseslint.config(...configWebApp, {
    languageOptions: {
        parserOptions: {
            project: ['./tsconfig.json', './tsconfig.client.json']
        }
    }
});
export default config;

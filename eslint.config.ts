import { configWebApp } from 'eslint-config-cityssm'
import tseslint from 'typescript-eslint'

export const config = tseslint.config(
  ...configWebApp,
  {
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json', './tsconfig.client.json']
      }
    }
  }
)

export default config

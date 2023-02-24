import { defineConfig } from 'vite'
import { pages } from './plugin/page'

export default defineConfig({
  plugins: [pages()]
})

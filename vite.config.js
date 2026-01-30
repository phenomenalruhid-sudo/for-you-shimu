import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // If your GitHub URL is https://<USERNAME>.github.io/<REPO>/
  // Change 'repo-name' to your actual GitHub repository name.
  // If you are using a custom domain, use '/' instead.
  base: '/shimu-special-site/', 
})
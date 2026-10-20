import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// "base" precisa ser o nome do repositório no GitHub, entre barras,
// para o site funcionar no GitHub Pages (https://jeferprog.github.io/Minha-Garagem/).
// Se você renomear o repositório, troque este valor pelo novo nome.
export default defineConfig({
  plugins: [react()],
  base: '/Minha-Garagem/',
})

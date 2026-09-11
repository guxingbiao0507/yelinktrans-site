import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = join(root, '.output', 'public')
const outputDir = join(root, 'deliverables')
const outputFile = join(outputDir, '源译官网_主页_第一阶段审核预览_V0.3.1.html')

let html = await readFile(join(publicDir, 'index.html'), 'utf8')
const stylesheetMatch = html.match(/<link rel="stylesheet" href="([^"]+)"[^>]*>/)

if (!stylesheetMatch) {
  throw new Error('未找到首页主样式文件，请先运行 pnpm generate。')
}

const css = await readFile(join(publicDir, stylesheetMatch[1].replace(/^\//, '')), 'utf8')

html = html
  .replace(stylesheetMatch[0], `<style>\n${css}\n</style>`)
  .replace(/<link\b[^>]*rel="(?:preload|modulepreload|prefetch)"[^>]*>/gi, '')
  .replace(/<link\b[^>]*href="\/favicon\.svg"[^>]*>/gi, '')
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(
    '</body>',
    `<script>
      const toggle = document.querySelector('.menu-toggle');
      const nav = document.querySelector('.primary-nav');
      const closeMenu = () => {
        nav?.classList.remove('is-open');
        toggle?.setAttribute('aria-expanded', 'false');
        toggle?.setAttribute('aria-label', '打开菜单');
      };
      toggle?.addEventListener('click', () => {
        const isOpen = nav?.classList.toggle('is-open') ?? false;
        toggle.setAttribute('aria-expanded', String(isOpen));
        toggle.setAttribute('aria-label', isOpen ? '关闭菜单' : '打开菜单');
      });
      nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    </script></body>`
  )

await mkdir(outputDir, { recursive: true })
await writeFile(outputFile, html)
console.log(outputFile)

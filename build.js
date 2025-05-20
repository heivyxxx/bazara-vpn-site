const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'src');
const BUILD = path.join(__dirname, 'build');

// Читаем хедер и футер
const header = fs.readFileSync(path.join(SRC, 'header.html'), 'utf8');
const footer = fs.readFileSync(path.join(SRC, 'footer.html'), 'utf8');

// Копируем ассеты
function copyRecursiveSync(src, dest) {
  if (fs.existsSync(src) && fs.lstatSync(src).isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest);
    fs.readdirSync(src).forEach(child => {
      copyRecursiveSync(path.join(src, child), path.join(dest, child));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Чистим build
if (fs.existsSync(BUILD)) {
  fs.rmSync(BUILD, { recursive: true, force: true });
}
fs.mkdirSync(BUILD);

// Копируем static
copyRecursiveSync(path.join(SRC, 'static'), path.join(BUILD, 'static'));
// Копируем assets
copyRecursiveSync(path.join(SRC, 'assets'), path.join(BUILD, 'assets'));

// Рекурсивная функция для обработки include-директив
function processIncludes(content, baseDir) {
  return content.replace(/<!--#include file="([^"]+)" -->/g, (match, includePath) => {
    const absPath = path.join(baseDir, includePath);
    if (!fs.existsSync(absPath)) return `<!-- include not found: ${includePath} -->`;
    const includeContent = fs.readFileSync(absPath, 'utf8');
    // Рекурсивно обрабатываем вложенные include'ы
    return processIncludes(includeContent, path.dirname(absPath));
  });
}

// Собираем страницы
fs.readdirSync(SRC).forEach(file => {
  if (file.endsWith('.html') && file !== 'header.html' && file !== 'footer.html') {
    let html = fs.readFileSync(path.join(SRC, file), 'utf8');
    html = processIncludes(html, SRC);
    html = html.replace(/<!--#include file="header.html" -->/g, header);
    html = html.replace(/<!--#include file="footer.html" -->/g, footer);
    fs.writeFileSync(path.join(BUILD, file), html, 'utf8');
  }
});

// Копируем все файлы из src (не папки) в build
fs.readdirSync(SRC).forEach(file => {
  const srcPath = path.join(SRC, file);
  const destPath = path.join(BUILD, file);
  if (fs.lstatSync(srcPath).isFile() && !file.endsWith('.html') && file !== 'build.js') {
    fs.copyFileSync(srcPath, destPath);
  }
});

console.log('Сборка завершена! Готовые файлы в папке build.'); 
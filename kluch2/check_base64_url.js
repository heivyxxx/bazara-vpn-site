const https = require('https');

function checkBase64Url(url) {
  https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      if (res.statusCode === 401) {
        console.log('❌ Ошибка 401: доступ запрещён');
        return;
      }
      if (!res.headers['content-type'] || !res.headers['content-type'].includes('text/plain')) {
        console.log(`❌ Не тот формат: content-type = ${res.headers['content-type']}`);
        return;
      }
      if (/<html|<head|<body|<div|<span|<script/i.test(data)) {
        console.log('❌ В теле HTML, а не base64');
        return;
      }
      if (!/^[A-Za-z0-9+/=\n\r]+$/.test(data) || data.length < 100) {
        console.log('❌ Похоже, это не base64 или слишком коротко');
        return;
      }
      console.log('✅ Всё заебок, ссылка подходит для Hiddify!');
      console.log('Первые 100 символов base64:');
      console.log(data.slice(0, 100));
    });
  }).on('error', (e) => {
    console.log('❌ Ошибка запроса:', e.message);
  });
}

// Пример вызова:
checkBase64Url('https://kluch2.vercel.app/base64.txt'); 
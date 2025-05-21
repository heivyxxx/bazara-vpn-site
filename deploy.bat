@echo off
:: Устанавливаем локальную переменную со временем
set hour=%time:~0,2%
if "%hour:~0,1%"==" " set hour=0%hour:~1,1%
set now=%date% %hour%:%time:~3,2%:%time:~6,2%

:: Генерим короткий ID для коммита
set /a rid=%random%%%1000

echo =============================
echo Commit: [%now%] #%rid%
echo =============================

:: Git операции
git add .
git commit -m "Авто-коммит %now% | #%rid%"
git push origin main

:: Вызов Vercel хука
curl -X POST https://api.vercel.com/v1/integrations/deploy/prj_z9oW4x5HbFu4V4BBZK4KMzXHGttv/AR6roVwh8G

echo =============================
echo ✅ Всё залито и деплой вызван!
pause

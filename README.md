# Epic Music Project - Медиа Портал

Полнофункциональный медиа-портал с Django backend и React frontend.

## Технологии

- **Backend**: Django 6.0.4 + Django REST Framework
- **Frontend**: React 19 + TypeScript + Vite 8
- **База данных**: SQLite3

## Запуск проекта

### Backend (Django)

```bash
cd backend
python manage.py runserver
```

Сервер запустится на `http://127.0.0.1:8000`

### Frontend (React + Vite)

```bash
cd vite-project
npm install  # Только при первом запуске
npm run dev
```

Приложение откроется на `http://localhost:5173`

## Функционал

✅ **Избранное** - отображение избранных медиа-элементов  
✅ **Поиск** - поиск по названию медиа-файлов  
✅ **Рекомендации** - отображение рекомендованных элементов  
✅ **Загрузка файлов** - загрузка новых медиа-файлов с описанием  
✅ **Обработка ошибок** - корректная обработка ошибок сети  
✅ **Состояния загрузки** - индикаторы загрузки для всех операций

## API Endpoints

**Медиа-контент:**
- `GET /api/featured/` - получить избранные элементы
- `GET /api/recommended/` - получить рекомендованные элементы
- `GET /api/recent/` - получить последние загруженные треки (свежак)
- `GET /api/search/?q=query` - поиск по названию
- `POST /api/upload/` - загрузить новый файл

**Аутентификация:**
- `POST /api/auth/login/` - вход в систему
- `POST /api/auth/logout/` - выход из системы
- `POST /api/auth/register/` - регистрация нового пользователя
- `GET /api/auth/user/` - получить текущего пользователя

## Админ-панель Django

Доступна по адресу: `http://127.0.0.1:8000/admin/`

Для создания суперпользователя:
```bash
cd backend
python manage.py createsuperuser
```

## Последние улучшения

- ✅ **Централизованная конфигурация API** - создан `config.ts` для управления URL и настройками
- ✅ **Валидация файлов** - проверка формата (mp3, wav, ogg, flac, m4a) и размера (до 100MB)
- ✅ **Секция "Свежак"** - отображение последних 20 загруженных треков в Explore
- ✅ **Готовность к портированию** - легко менять API URL для APK/Electron версий

## Исправленные проблемы

- ✅ Удалена случайная строка 'sd' из settings.py
- ✅ Добавлен DEFAULT_AUTO_FIELD в настройки Django
- ✅ Настроена раздача медиа-файлов в development режиме
- ✅ Реализованы все API endpoints (featured, recommended, recent, search, upload)
- ✅ Подключена форма загрузки к backend
- ✅ Добавлена обработка ошибок во frontend
- ✅ Добавлены состояния загрузки для всех операций
- ✅ Удален неиспользуемый файл Submit.tsx
- ✅ Интерфейс переведен на русский язык
- ✅ Все API URL вынесены в константы для удобной смены на production

## Конфигурация для production

Для смены API URL на production сервер, отредактируйте `vite-project/src/config.ts`:

```typescript
// Для разработки
export const API_BASE_URL = 'http://127.0.0.1:8000';

// Для production
export const API_BASE_URL = 'https://your-production-server.com';
```

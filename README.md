# AlexGroup Catalog

Fullstack веб-приложение для каталога объектов недвижимости, разработанное на базе Next.js, Prisma и PostgreSQL.

---

## О проекте

Приложение представляет собой каталог домов с возможностью:

- просмотра списка объектов
- фильтрации и сортировки
- просмотра детальной страницы
- сравнения объектов
- отправки заявок

В ходе разработки был выполнен переход от CMS (Strapi) к собственной fullstack-архитектуре.

---

## Функциональность

### Каталог объектов

- отображение списка объектов
- карточки с изображениями и характеристиками
- пагинация

---

### Фильтрация

- поиск по названию
- фильтрация по цене (от / до)
- фильтрация по площади
- фильтрация по спальням
- фильтрация по комнатам
- фильтрация по этажам

---

### Сортировка

- сначала новые
- по цене
- по площади

---

### Страница объекта

- галерея изображений
- основные характеристики
- описание
- кнопка отправки заявки

---

### Сравнение объектов

- добавление объектов в сравнение
- хранение в localStorage
- таблица сравнения
- подсветка лучших значений

---

### Заявки

- форма отправки заявки
- сохранение в базе данных
- страница управления заявками
- изменение статуса заявки
- удаление заявки

---

## Технологии

- Next.js (App Router)
- React
- TypeScript
- Prisma ORM
- PostgreSQL
- Fetch API

---

## Архитектура

Проект реализован как fullstack-приложение внутри Next.js.

---

### Клиентская часть

- страницы каталога
- фильтры и сортировка
- карточки объектов
- сравнение
- формы

---

### Серверная часть

- API Routes (`/app/api`)
- обработка запросов
- работа с базой данных

---

### База данных

Используется PostgreSQL.

Основные сущности:

#### Object

- title
- slug
- price
- area
- floors
- bedrooms
- rooms
- material
- description
- image1 – image5

---

#### Lead

- name
- phone
- message
- status
- objectId
- createdAt

---

## Запуск проекта

### Требования
* Node.js 18+
* PostgreSQL

---

### Установка зависимостей
```
cd apps/frontend
npm install
```
---
### Настройка переменных окружения

#### Создайте файл .env:
```
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DB_NAME"
```
---
### Настройка базы данных
```
npx prisma db push
npx prisma generate
```
---
### Запуск
```
npm run dev
```
---
### Открыть:
```
http://localhost:3000
```
### Работа с Prisma

#### После изменения схемы:
```
npx prisma db push
npx prisma generate
```
---
## Что было изучено
### Next.js
* App Router
* Server Components
* Client Components
* API Routes
* динамические маршруты

[Документация 1](https://nextjs.org/docs) и [Документация 2](https://nextjs.org/docs/app)
---

### React
* useState
* useEffect
* управление состоянием
* формы

[Документация](https://react.dev)
---
### Prisma
* схема базы данных
* миграции
* CRUD операции

[Документация](https://www.prisma.io/docs)
---

### PostgreSQL
* работа с базой данных
* структура таблиц

[Документация](https://www.postgresql.org/docs/)

### Fullstack разработка
* отказ от CMS
* построение backend внутри Next.js
* организация API

##Гайды, которые помогали:

###[Инструкция по построению fullstck приложения на next.js с использованием App Router ](https://www.nextsaaspilot.com/blogs/nextjs-tutorial)
###[Гайд по построению fullstck приложения с использованием Next.js, Prisma, and Postgres ](https://vercel.com/guides/nextjs-prisma-postgres)
###[Гайды по призме](https://www.prisma.io/docs/guides/nextjs)
### Видео-гайды, они на английском, но если прогнать через нейронку, то норм
*[Видео для новичков в использовании Next.js](https://www.youtube.com/watch?v=E5navVnmHJE)
*[Видео по призме](https://www.youtube.com/watch?v=QXxy8Uv1LnQ)

---


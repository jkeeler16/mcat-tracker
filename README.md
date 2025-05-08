# MCAT Accountability Tracker

A lightweight web application that helps track MCAT study progress, allowing students to log their daily study activities and share progress with family members.

## Features

- Daily check-in form to record:
  - Questions completed
  - Questions reviewed
  - Key learning takeaways
- Dashboard to view progress over time
- Visual chart of study activity
- Simple, responsive interface

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Recharts
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM

## Local Development Setup

### Prerequisites

- Node.js (14.x or newer)
- Yarn package manager
- Docker and Docker Compose (for local database)

### Quick Setup

For a quick setup with automated database initialization:

1. Clone this repository
2. Install dependencies:
   ```
   yarn install
   ```
3. Run the setup script which creates Docker files, starts the database and runs migrations:
   ```
   yarn setup-db
   ```
4. Start the development server:
   ```
   yarn dev
   ```
5. Visit `http://localhost:3000` in your browser

### Manual Database Setup with Docker

If you prefer to set up the database manually:

1. Make sure Docker and Docker Compose are installed on your system
2. Create a `docker-compose.yml` file in the project root with the following content:
   ```yaml
   version: '3.8'

   services:
     postgres:
       image: postgres:15
       container_name: mcat-tracker-db
       restart: always
       ports:
         - "5432:5432"
       environment:
         POSTGRES_USER: postgres
         POSTGRES_PASSWORD: postgres
         POSTGRES_DB: mcat_tracker
       volumes:
         - mcat_tracker_data:/var/lib/postgresql/data

   volumes:
     mcat_tracker_data:
       driver: local
   ```
3. Start the database container:
   ```
   yarn docker:up
   ```
4. The PostgreSQL server will be available at `localhost:5432`

### Application Setup

1. Create a `.env` file in the project root with your database connection string:
   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mcat_tracker?schema=public"
   ```
2. Initialize the database:
   ```
   yarn prisma:migrate
   ```
3. Generate Prisma client:
   ```
   yarn prisma:generate
   ```
4. Start the development server:
   ```
   yarn dev
   ```
5. Visit `http://localhost:3000` in your browser

## Production Deployment

### Server Setup (Ubuntu VPS example)

1. Set up a VPS with Ubuntu
2. Install Node.js, PostgreSQL, Nginx, and PM2
3. Clone the repository and install dependencies
4. Build the application:
   ```
   yarn build
   ```
5. Set up Nginx as a reverse proxy to the Next.js app
6. Configure PM2 to manage the Node.js process:
   ```
   pm2 start yarn --name "mcat-tracker" -- start
   ```
7. Set up SSL with Let's Encrypt/Certbot

## Database Management

- Access Prisma Studio for database management:
  ```
  yarn prisma:studio
  ```
- Run migrations after schema changes:
  ```
  yarn prisma:migrate
  ```
- To stop the Docker database:
  ```
  yarn docker:down
  ```
- To start it again:
  ```
  yarn docker:up
  ```

## License

MIT 
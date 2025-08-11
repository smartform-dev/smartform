# SmartForm 📝

SmartForm is a modern, AI-powered platform for creating, managing, and embedding intelligent forms into your web applications. It's built with a cutting-edge tech stack to provide a seamless experience for both developers and end-users.

## 🚀 About The Project

This project allows users to sign up, define their company's context, and generate intelligent forms that can be embedded anywhere. The forms leverage AI to have conversations with users, capture data effectively, and provide analytics on submissions.

### ✨ Key Features

*   **AI-Powered Form Generation**: Automatically create forms based on user-defined prompts and company data.
*   **Intuitive Form Builder & Editor**: A user-friendly interface to customize form fields and styling.
*   **AI Chat Interaction**: Forms can engage users in a conversation to gather information.
*   **Embeddable Forms**: Easily generate and embed forms into any website with a simple script.
*   **User & Company Management**: Supports multi-user authentication and company-specific data context.
*   **Response Analytics**: (Future) Dashboard to view form views, submission rates, and other key metrics.
*   **Customizable Styling**: Adapt the look and feel of forms to match your brand.

---

## 🛠️ Tech Stack

This project is built with a modern, type-safe, and scalable technology stack.

| Category          | Technology                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------ |
| **Framework**     | [Next.js](https://nextjs.org/) (v15)                                                                   |
| **Language**      | [TypeScript](https://www.typescriptlang.org/)                                                          |
| **Styling**       | [Tailwind CSS](https://tailwindcss.com/)                                                               |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/)                                                                    |
| **Database**      | [PostgreSQL](https://www.postgresql.org/) (via [Neon](https://neon.tech/))                             |
| **ORM**           | [Prisma](https://www.prisma.io/)                                                                       |
| **Authentication**| [Clerk](https://clerk.com/)                                                                            |
| **AI**            | [OpenAI API](https://platform.openai.com/) (via [Vercel AI SDK](https://sdk.vercel.ai/))                 |
| **Package Manager**| `pnpm`                                                                                                |

---

## 🎨 Styling & Theming

The project uses **Tailwind CSS** for utility-first styling and **shadcn/ui** for its component library. The primary color theme is inspired by Supabase's green, creating a clean and professional look.

### Color Palette

The main colors are defined in `tailwind.config.ts`.

| Name      | HSL Value                          | Hex Value (Default) | Description                               |
| --------- | ---------------------------------- | ------------------- | ----------------------------------------- |
| `primary` | -                                  | `#1a5d3a`           | The main brand color, a dark green.       |
| `secondary`| `hsl(var(--secondary))`            | -                   | Used for secondary elements and accents.  |
| `background`| `hsl(var(--background))`         | -                   | The default page background color.        |
| `foreground`| `hsl(var(--foreground))`         | -                   | The default text color.                   |
| `border`  | `hsl(var(--border))`               | -                   | Used for component borders.               |
| `input`   | `hsl(var(--input))`                | -                   | Background color for input fields.        |
| `ring`    | `hsl(var(--ring))`                 | -                   | Color for focus rings on interactive elements. |
| `destructive`| `hsl(var(--destructive))`       | -                   | Used for destructive actions (e.g., delete). |
| `accent`  | `hsl(var(--accent))`               | -                   | Used for highlighting active or selected items. |
| `muted`   | `hsl(var(--muted))`                | -                   | For muted text and decorative elements.   |

**Primary Color Shades:**
- `50`: `#ecfdf5`
- `100`: `#d1fae5`
- `200`: `#a7f3d0`
- `300`: `#6ee7b7`
- `400`: `#34d399`
- `500`: `#10b981`
- `600`: `#059669`
- `700`: `#047857`
- `800`: `#1a5d3a` (Default)
- `900`: `#14532d`

---

## 🗄️ Database

**Prisma** is used as the ORM to interact with the **PostgreSQL** database.

*   **Schema**: The database schema is defined in `prisma/schema.prisma`. It includes models for `Users`, `Company`, `Form`, `FormSubmission`, and more.
*   **Migrations**: To apply schema changes to your database, run `pnpm prisma migrate dev`. This will create and apply a new SQL migration file in the `prisma/migrations` directory.

---

## ⚙️ Getting Started

Follow these steps to get a local development environment running.

### Prerequisites

*   [Node.js](https://nodejs.org/en) (v18 or later)
*   [pnpm](https://pnpm.io/installation) package manager (`npm install -g pnpm`)
*   A [Neon](https://neon.tech) account for the PostgreSQL database.
*   An [OpenAI](https://platform.openai.com/) account for an API key.
*   A [Clerk](https://clerk.com/) account for authentication.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd smartform
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**
    Copy the example environment file and fill in your credentials.
    ```bash
    cp example.env .env
    ```
    See the **Environment Variables** section below for details on what to fill in.

4.  **Run database migrations:**
    This will sync the Prisma schema with your Neon database.
    ```bash
    pnpm prisma migrate dev
    ```

5.  **Run the development server:**
    ```bash
    pnpm dev
    ```

The application should now be running on [http://localhost:3000](http://localhost:3000).

---

### 🔑 Environment Variables

You need to set the following variables in your `.env` file:

| Variable                          | Description                                                                 | Example                                            |
| --------------------------------- | --------------------------------------------------------------------------- | -------------------------------------------------- |
| `DATABASE_URL`                    | **Required.** Connection string for your Neon PostgreSQL database.          | `postgresql://user:pass@host:5432/dbname`          |
| `OPENAI_API_KEY`                  | **Required.** Your secret API key from OpenAI.                              | `sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx`                 |
| `NEXT_PUBLIC_APP_URL`             | **Required.** The base URL of your application.                             | `http://localhost:3000`                            |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`| **Required.** Your publishable key from the Clerk dashboard.               | `pk_test_xxxxxxxxxxxxxxxxxxxxxxxx`                 |
| `CLERK_SECRET_KEY`                | **Required.** Your secret key from the Clerk dashboard.                     | `sk_test_xxxxxxxxxxxxxxxxxxxxxxxx`                 |

---

## 📁 Project Structure

A brief overview of the key directories in the project:

*   `.`
*   `├── app/`: The core of the Next.js application, using the App Router.
*   │   `├── api/`: Backend API routes.
*   │   `├── (dashboard)/`: Main application routes protected by authentication.
*   │   `└── page.tsx`: The main landing page.
*   `├── components/`: Shared React components.
*   │   `└── ui/`: Components from shadcn/ui.
*   `├── lib/`: Utility functions, database client, and other shared logic.
*   `├── prisma/`: Contains the database schema (`schema.prisma`) and migrations.
*   `├── public/`: Static assets like images and fonts.
*   `└── styles/`: Global CSS styles.

---

## 🚀 Deployment

The recommended platform for deploying this application is **Vercel**.

1.  Push your code to a Git repository (e.g., GitHub).
2.  Import the project into your Vercel dashboard.
3.  Vercel will automatically detect that it's a Next.js project.
4.  Add your environment variables from your `.env` file to the Vercel project settings.
5.  Deploy!

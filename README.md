# Basketball Shirts Shop 🏀

A full-stack e-commerce platform for basketball jersey enthusiasts. Browse, filter, and purchase authentic basketball shirts with a seamless shopping experience. Features include product filtering, shopping cart management, user authentication, and secure checkout.

![Basketball Shop Demo](./screenshots/demo.gif)

## ✨ Features

- 🏀 **Product Catalog** - Browse extensive collection of basketball jerseys
- 🔍 **Advanced Filtering** - Filter by team, player, size, and price
- 🛒 **Shopping Cart** - Add, remove, and manage cart items
- 🔐 **Better Auth** - Modern authentication with email/password and Google OAuth
- 📧 **Email Notifications** - Order confirmations and updates via Nodemailer
- 📱 **Responsive Design** - Optimized for mobile and desktop
- 🎨 **Modern UI** - Clean and intuitive interface

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **Next.js** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library for smooth transitions

### Backend & Database
- **Next.js API Routes** - Serverless backend
- **PostgreSQL (Neon)** - Serverless PostgreSQL database
- **Prisma** - Type-safe ORM for database operations
- **Better Auth** - Modern authentication library
- **Nodemailer** - Email service for notifications

### Authentication
- **Better Auth** - Email/password and Google OAuth
- **JWT** - Token-based session management
- **Google OAuth** - Social login integration

### Services
- **Neon Database** - Serverless PostgreSQL hosting
- **Gmail SMTP** - Email delivery
- **Google OAuth** - Social authentication

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Neon Database account
- Google OAuth credentials
- Gmail account (for emails)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/manosnik5/Basketball_shirts_shop.git
cd Basketball_shirts_shop
```

2. **Install dependencies**
```bash
npm install
```

3. **Database Setup (Neon + Prisma)**

- Go to [neon.tech](https://neon.tech)
- Create a new project
- Copy the connection string

Set up Prisma:
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database (optional)
npx prisma db seed
```

4. **Google OAuth Setup**

- Go to [Google Cloud Console](https://console.cloud.google.com)
- Create a new project or select existing
- Enable Google+ API
- Go to Credentials → Create OAuth 2.0 Client ID
- Add authorized redirect URIs:
  - `http://localhost:3000/api/auth/callback/google` (development)
  - `https://yourdomain.com/api/auth/callback/google` (production)
- Copy Client ID and Client Secret

5. **Gmail App Password**

- Go to [Google Account Security](https://myaccount.google.com/security)
- Enable 2-Factor Authentication
- Go to App Passwords
- Generate password for "Mail" app
- Copy the 16-character password

6. **Environment Variables**

Create `.env.local` in the root directory:
```env
# Better Auth
BETTER_AUTH_SECRET=your_random_secret_key_min_32_chars
BETTER_AUTH_URL=http://localhost:3000

# Next.js
NEXT_PUBLIC_API_URL=http://localhost:3000

# Database (Neon)
DATABASE_URL=postgresql://neondb_owner:password@host.neon.tech/neondb?sslmode=require

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret

# Nodemailer (Gmail)
NODEMAILER_USER=your_email@gmail.com
NODEMAILER_APP_PASSWORD=your_16_char_app_password

# JWT
ACCESS_TOKEN_SECRET=your_access_token_secret_min_32_chars
```

7. **Run the application**
```bash
# Development mode
npm run dev
# or
yarn dev

# Production build
npm run build
npm start
```

## 🛒 Shopping Flow

1. **Browse Products** - View catalog with filters
2. **Add to Cart** - Select size and add items
3. **Review Cart** - Adjust quantities or remove items
4. **Checkout** - Enter shipping and payment details
5. **Order Confirmation** - Receive email confirmation

## 🔮 Future Enhancements

- [ ] Product reviews and ratings
- [ ] Discount codes and promotions
- [ ] Admin dashboard with analytics

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Manos Nikolaou**
- GitHub: [@manosnik5](https://github.com/manosnik5)



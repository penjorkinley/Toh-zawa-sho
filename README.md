# Digital Restaurant Menu Management System (Toh Zawa Sho) - Frontend

## Overview
The frontend of **Toh Zawa Sho** is built using **Next.js** and **ShadCN** to provide a seamless, responsive, and user-friendly digital restaurant menu management system. This project enables customers to scan QR codes, browse digital menus, place orders, and enhance their dining experience. It also helps restaurant owners manage orders efficiently and gain valuable insights.

## Features
- **QR Code-Based Menu Access**: Customers can scan a QR code to view the menu.
- **Visual Representation of Dishes**: High-quality images and descriptions for menu items.
- **Order Placement**: Users can add items to a shared table cart and place orders.
- **Order Summary**: Customers can review their orders before confirming.
- **Real-Time Order Management**: Owners and kitchen staff receive orders digitally.
- **Analytics Dashboard**: Restaurant owners can track sales, peak hours, and best-selling dishes.
- **ShadCN UI Components**: Provides a modern, accessible, and well-designed UI.

---

## Tech Stack
### **Frontend**
- **Next.js** - React framework for server-side rendering and static site generation.
- **ShadCN** - UI component library for styling and layout.
- **Tailwind CSS** - Utility-first CSS framework for responsive design.
- **React Query / SWR** - For data fetching and caching.
- **Zustand / Redux** - For state management (choose based on implementation).
- **Axios** - For API requests.
- **Framer Motion** - For smooth animations.

---

## Installation & Setup

### Prerequisites
Ensure you have the following installed:
- **Node.js** (>=18.0.0)
- **npm** or **yarn**
- **Git**

### Steps to Run the Project
```sh
# Clone the repository
git clone https://github.com/nabatech-bt/toh-zawa-sho-frontend.git
cd toh-zawa-sho-frontend

# Install dependencies
npm install  # or yarn install

# Start the development server
npm run dev  # or yarn dev
```

The application will run on `http://localhost:3000`.

---

## Project Structure
```bash
📂 digital-restaurant-menu-frontend
 ┣ 📂 components       # Reusable UI components
 ┣ 📂 pages            # Next.js pages and routing
 ┣ 📂 styles           # Global styles
 ┣ 📂 hooks            # Custom React hooks
 ┣ 📂 utils            # Helper functions
 ┣ 📂 public           # Static assets (images, icons, etc.)
 ┣ 📂 state            # Global state management (Zustand/Redux)
 ┣ 📜 .env             # Environment variables
 ┣ 📜 next.config.js   # Next.js configuration
 ┣ 📜 tailwind.config.js # Tailwind CSS configuration
 ┣ 📜 package.json     # Project dependencies
 ┗ 📜 README.md        # Documentation
```

---

## API Integration
The frontend interacts with the backend using RESTful APIs or GraphQL (based on backend implementation). Ensure that API endpoints are correctly configured in the `.env` file.

```sh
NEXT_PUBLIC_API_BASE_URL=http://your-api-url.com
```

---

## Contribution Guidelines
1. Fork the repository and create a new branch.
2. Commit your changes with descriptive messages.
3. Push the branch and create a pull request.
4. Follow code formatting rules and linting guidelines.

---

## Future Enhancements
- **Payment Gateway Integration** (Stripe, Razorpay, etc.)
- **Multi-language Support**
- **Dark Mode Toggle**
- **PWA Support for Offline Access**
- **Live Inventory Tracking**

---

## License
This project is licensed under the MIT License. Feel free to modify and distribute it.

---

## Contact
For questions or support, reach out via email: `your-email@example.com` or open an issue on GitHub.

Happy coding! 🚀

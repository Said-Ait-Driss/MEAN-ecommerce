src/app/
│
├─ app.config.ts # global providers & routing setup
├─ app.routes.ts # main routes
├─ app.component.ts # root component
├─ app.component.html # root template (shell layout)
│
├─ core/ # Core (singleton services, global features)
│ ├─ guards/ # route guards (auth, admin)
│ ├─ interceptors/ # HTTP interceptors (auth token, errors)
│ ├─ services/ # global services (auth, api)
│ └─ core.config.ts # core setup if needed
│
├─ features/ # Feature modules/components
│ ├─ auth/ # Login, Register, Profile
│ │ ├─ login/
│ │ ├─ register/
│ │ └─ auth.service.ts
│ │
│ ├─ products/ # Product listing & detail
│ │ ├─ product-list/
│ │ ├─ product-detail/
│ │ └─ products.service.ts
│ │
│ ├─ cart/ # Shopping cart
│ │ ├─ cart.component.ts
│ │ └─ cart.service.ts
│ │
│ ├─ checkout/ # Checkout & orders
│ │ ├─ checkout.component.ts
│ │ └─ orders.service.ts
│ │
│ └─ admin/ # (optional) admin dashboard
│ ├─ products-admin/
│ ├─ orders-admin/
│ └─ users-admin/
│
├─ shared/ # Shared UI elements (reusable across features)
│ ├─ components/ # buttons, navbar, footer, product-card
│ ├─ directives/ # custom directives
│ └─ pipes/ # custom pipes (currency, filters)
│
├─ assets/ # images, icons, product placeholders
├─ environments/ # environment.ts (dev/prod API URLs)
└─ styles.css # global Tailwind styles

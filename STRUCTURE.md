src/
├── main/                    # Backend (Electron Main Process)
│   ├── lib/                 # Backend utilities
│   │   ├── main-utils.ts   # File, system, security utils
│   │   └── index.ts
│   ├── use-cases/           # Backend use cases
│   │   ├── system/          # System management
│   │   ├── file-management/ # File I/O operations
│   │   ├── security/        # Encryption, hashing
│   │   ├── performance/     # Monitoring
│   │   └── index.ts
│   ├── ipc/                 # IPC handlers
│   ├── windows/             # Window management
│   ├── config/              # App configuration
│   └── main.ts              # Entry point
│
├── renderer/                # Frontend (Electron Renderer Process)
│   ├── lib/                 # Frontend utilities
│   │   ├── renderer-utils.ts # DOM, browser utils
│   │   └── index.ts
│   ├── use-cases/           # Frontend use cases
│   │   ├── electron-*/      # Feature use cases
│   │   └── index.ts
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI
│   │   └── features/       # Feature components
│   ├── assets/              # Static assets
│   │   ├── images/
│   │   ├── icons/
│   │   └── styles/
│   ├── hooks/               # Custom React hooks
│   ├── store/               # State management
│   ├── types/               # Frontend types
│   └── main.tsx             # React entry
│
├── preload/                 # Preload scripts
└── shared/                  # Truly shared code
    ├── constants/
    └── types/

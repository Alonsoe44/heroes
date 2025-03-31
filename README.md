# Heroes - Frontend Demo

## Quick Start 🚀

### Installation

```bash
npm i
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Environment Setup

Create a `.env` file in the root directory:

```env
VITE_API_URL=your_api_url    # Example: http://localhost:3000/api
VITE_TOKEN=your_auth_token   # Your authentication token
```

That's it! Your hero arena is ready for battle. 🦸‍♂️

## Technical Architecture Overview 🏗️

### Core Architecture Decisions

1. **Feature-Based Modular Architecture**

```typescript
src/
├── features/
│   ├── heroes/           # Domain-specific feature
│   │   ├── components/   # UI components
│   │   ├── composables/  # Business logic
│   │   ├── store/       # State management
│   │   └── types/       # Type definitions
│   └── notifications/    # Cross-cutting concern
└── shared/
    ├── services/        # Core services
    └── utils/           # Shared utilities
```

Rationale: Enables independent feature development and clear boundaries for team scalability.

### Type Safety & Data Validation

1. **Runtime Validation Strategy**

```typescript
// Schema definition with business rules
const HeroSchema = z.object({
  name: z.string({ invalid_type_error: "Every hero needs a name" }).min(1),
  attributes: z.object({
    strength: z
      .number()
      .min(0, "Strength cannot be negative")
      .max(10, "Strength cannot exceed 10"),
  }),
});

// Type inference from schema
type Hero = z.infer<typeof HeroSchema>;
```

Benefit: Ensures data integrity between frontend and backend systems.

2. **API Type Safety**

```typescript
const useCreateHero = (): {
  createHero: (newHero: NewHero) => Promise<Hero | null>;
  loading: Ref<boolean>;
  error: Ref<string | null>;
} => {
  // Implementation
};
```

Benefit: Prevents runtime errors and improves maintainability.

### State Management Architecture

```typescript
// Centralized store with type-safe actions
const useHeroStore = defineStore("hero", () => {
  const heroes = ref<Hero[]>([]);

  // Atomic state updates
  const updateHero = (heroId: string, hero: Hero) => {
    const index = heroes.value.findIndex((h) => h.id === heroId);
    if (index !== -1) {
      heroes.value[index] = hero;
    }
  };

  return { heroes, updateHero };
});
```

### Error Handling Strategy

```typescript
// Centralized error dictionary for consistent messaging
const errorDictionary: Record<string, string> = {
  "Preventing creation of hero because a security prevention rule was triggered":
    "That hero name is already taken.",
};

// Error handling utility
export function getFriendlyError(message: string): string {
  return errorDictionary[message] || "Something went wrong. Please try again.";
}
```

## Scalability Patterns 📈

### 1. Composable Logic Extraction

```typescript
// Reusable business logic
export function useFetchHeroes() {
  const store = useHeroStore();
  const loading = ref(false);

  const fetchHeroes = async () => {
    // Implementation
  };

  return { loading, heroes: computed(() => store.heroes) };
}
```

### 2. Cross-Cutting Concerns

```typescript
// Notification system that can scale across the application
const useNotificationStore = defineStore("notification", () => {
  const notifications = ref<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, "id">) => {
    // Implementation with auto-cleanup
  };

  return { notifications, addNotification };
});
```

## Testing Strategy 🧪

```typescript
// Example of a testable component
const useCreateHero = () => {
  // Dependencies are injectable for testing
  const store = useHeroStore();
  const notifications = useNotificationStore();

  return {
    createHero: async (hero: NewHero) => {
      // Implementation
    },
  };
};
```

## CI/CD Integration 🔄

- TypeScript strict mode enabled
- ESLint configuration for code quality
- Automated testing setup

## Custom-Built Design System & Components 🎨

Unlike many applications that rely on UI libraries like Material-UI, Vuetify, or Element Plus, this project features a completely custom-built design system. Every single component was designed from scratch in Figma and implemented using only Vue 3 and Tailwind CSS.

### Why Custom Components?

- **Unique Identity**: Instead of looking like "just another Material design app", our interface stands out with its distinctive personality
- **Zero UI Library Dependencies**: No external component libraries were used - every button, modal, card, and interaction was crafted by hand
- **Complete Creative Control**: From the subtle hover states to complex battle animations, every interaction was purposefully designed
- **Performance First**: Without the bloat of component libraries, our bundle stays lean and fast

### Design Process

1. **Figma Prototyping**: Each component begins its life in Figma, where we iterate on design, spacing, and interactions
2. **Custom Implementation**: Components are then hand-coded using Vue 3 and styled with Tailwind CSS
3. **Animation Design**: Custom animations are crafted to provide meaningful feedback and delight users

### User Experience Philosophy

By crafting each element ourselves, we've created an interface that is:

- Distinctively original while maintaining professional standards
- Perfectly tailored to our specific use cases
- Free from the constraints and overhead of third-party UI libraries

## Future Improvements 🛣️

### High Priority

- Add unit and integration tests with Vitest
- Complete Arena page battle mechanics
- Animation the penthatlon competition and display a nice winscreen with a podium
- Add the Update feature to the hero cards

### Nice to Have

- Add Storybook for component documentation
- Enhance mobile responsiveness
- Add keyboard navigation

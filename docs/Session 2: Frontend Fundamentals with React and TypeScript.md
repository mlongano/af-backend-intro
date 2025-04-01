# Session 2: Frontend Fundamentals with React and TypeScript

**Topics:**

- React component architecture
- TypeScript basics for React
- Project structure and organization
- Styling approaches (Tailwind CSS)

**Activities:**

1. Demo: Setting up a React+TypeScript project (30 min)
2. Walkthrough: Creating React components with TypeScript (40 min)
3. Workshop: Implementing UI components using Tailwind CSS (40 min)
4. Team work: Planning component hierarchy for the project (30 min)

**Homework:**

- Implement initial UI components for the project
- Set up routing with React Router
- Configure Tailwind CSS in the project

Each section will build on the knowledge from the previous one.

## Overview

In this session, we'll explore the essentials of building modern frontend applications using React and TypeScript. We'll cover component architecture, TypeScript integration, project organization, and styling with Tailwind CSS.

## Learning Objectives

By the end of this session, you will be able to:

- Create and structure React components using TypeScript
- Implement proper typing for props and state
- Organize a React project following best practices
- Apply styling using Tailwind CSS
- Design a component hierarchy for your project

---

## Part 1: React Component Architecture (30 minutes)

### Key Concepts

#### Components as Building Blocks

React applications are built using components - reusable, self-contained pieces of code that return markup. Think of components as LEGO blocks that you can combine to build complex UIs.

#### Types of Components

1. **Function Components (Preferred)**

   ```tsx
   function Welcome(props: { name: string }) {
     return <h1>Hello, {props.name}</h1>;
   }
   ```

2. **Class Components (Legacy)**
   ```tsx
   class Welcome extends React.Component<{ name: string }> {
     render() {
       return <h1>Hello, {this.props.name}</h1>;
     }
   }
   ```

#### Component Communication

1. **Props**: Pass data from parent to child components

   ```tsx
   function ParentComponent() {
     return <ChildComponent message="Hello from parent" />;
   }

   function ChildComponent({ message }: { message: string }) {
     return <p>{message}</p>;
   }
   ```

2. **State**: Internal component data that changes over time

   ```tsx
   function Counter() {
     const [count, setCount] = useState(0);

     return (
       <div>
         <p>Count: {count}</p>
         <button onClick={() => setCount(count + 1)}>Increment</button>
       </div>
     );
   }
   ```

3. **Context**: Share data across components without prop drilling

   ```tsx
   // Create context
   const ThemeContext = React.createContext("light");

   // Provider
   function App() {
     return (
       <ThemeContext.Provider value="dark">
         <ThemedButton />
       </ThemeContext.Provider>
     );
   }

   // Consumer
   function ThemedButton() {
     const theme = useContext(ThemeContext);
     return <button className={theme}>Themed Button</button>;
   }
   ```

#### Component Lifecycle

Function components use hooks to handle lifecycle events:

```tsx
function ProfilePage({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);

  // Similar to componentDidMount and componentDidUpdate
  useEffect(() => {
    fetchUser(userId).then((data) => setUser(data));

    // Cleanup (similar to componentWillUnmount)
    return () => {
      // Cleanup code here
    };
  }, [userId]); // Only re-run if userId changes

  if (!user) return <div>Loading...</div>;

  return <div>{user.name}</div>;
}
```

#### Thinking in Components

When building React applications, think in terms of:

1. **Component Composition**: Build complex UIs by combining smaller components
2. **Single Responsibility**: Each component should do one thing well
3. **Reusability**: Design components to be reused across your application
4. **Separation of Concerns**: Separate logic from presentation where possible

---

## Part 2: TypeScript Basics for React (30 minutes)

### Key Concepts

#### Why TypeScript with React?

- Catch errors during development instead of runtime
- Better IDE support with autocompletion and documentation
- Improved code maintainability and readability
- Self-documenting code

#### Basic Types for React Components

```tsx
// Basic prop types
type ButtonProps = {
  text: string;
  onClick: () => void;
  disabled?: boolean; // Optional prop
  variant: "primary" | "secondary" | "tertiary"; // Union type
};

function Button({ text, onClick, disabled = false, variant }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {text}
    </button>
  );
}
```

#### Typing Component State

```tsx
// For primitive types
const [count, setCount] = useState<number>(0);

// For complex types
type User = {
  id: string;
  name: string;
  email: string;
};

const [user, setUser] = useState<User | null>(null);
```

#### Typing Event Handlers

```tsx
// Input change event
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setName(e.target.value);
};

// Form submission
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  // Form submission logic
};

// Button click
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  // Click logic
};
```

#### Typing Custom Hooks

```tsx
function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

// Usage
const [theme, setTheme] = useLocalStorage<"light" | "dark">("theme", "light");
```

#### Type vs Interface

```tsx
// Interface
interface User {
  id: string;
  name: string;
}

// Type
type User = {
  id: string;
  name: string;
};

// When to use each:
// - Interface: For object shapes that might be extended
// - Type: For unions, intersections, and when you don't need extension
```

#### Generic Components

```tsx
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// Usage
<List
  items={["Apple", "Banana", "Orange"]}
  renderItem={(item) => <span>{item}</span>}
/>;
```

---

## Part 3: Project Structure and Organization (30 minutes)

### Recommended Project Structure

```
src/
├── assets/         # Static assets like images, fonts
├── components/     # Reusable components
│   ├── ui/         # Basic UI components (Button, Input, etc.)
│   ├── layout/     # Layout components (Header, Footer, etc.)
│   └── features/   # Feature-specific components
├── hooks/          # Custom hooks
├── pages/          # Page components for routing
├── services/       # API services and external integrations
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
├── App.tsx         # Main app component
└── main.tsx        # Entry point
```

### Component Organization Patterns

#### Atomic Design Methodology

Organize components based on complexity:

1. **Atoms**: Basic building blocks (Button, Input, Text)
2. **Molecules**: Simple component combinations (SearchBar, Card)
3. **Organisms**: Complex, self-contained sections (Header, UserProfile)
4. **Templates**: Page layouts without specific content
5. **Pages**: Complete pages with actual content

#### Feature-Based Organization

Group components by feature rather than type:

```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   ├── dashboard/
│   ├── settings/
│   └── ...
```

### Component File Structure

For each component, consider creating a dedicated folder:

```
Button/
├── Button.tsx       # Component implementation
├── Button.test.tsx  # Tests
├── Button.css       # Styles (if not using Tailwind)
└── index.ts         # Re-export for cleaner imports
```

This enables importing with `import { Button } from '@/components/ui/Button'` instead of the full path.

### Import Aliases

Configure import aliases in `tsconfig.json` for cleaner imports:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### State Management Patterns

For small to medium projects:

- Local component state with `useState`
- Context API for shared state
- Custom hooks to encapsulate logic

For larger projects:

- Consider libraries like Redux Toolkit, Zustand, or Jotai

### Environment Variables

Store environment-specific configuration in `.env` files:

```
.env                # Default values
.env.local          # Local overrides (not committed)
.env.development    # Development environment
.env.production     # Production environment
```

Access with `import.meta.env.VITE_API_URL` (for Vite projects)

---

## Part 4: Styling with Tailwind CSS (30 minutes)

### Introduction to Tailwind CSS

Tailwind is a utility-first CSS framework that allows you to build designs directly in your markup:

```tsx
// Traditional CSS
<button className="button">Click me</button>

/* In your CSS file */
.button {
  padding: 0.5rem 1rem;
  background-color: blue;
  color: white;
  border-radius: 0.25rem;
}

// With Tailwind
<button className="px-4 py-2 bg-blue-500 text-white rounded">
  Click me
</button>
```

### Key Benefits

1. **No context switching** between HTML and CSS files
2. **Consistent design constraints** from a predefined design system
3. **Highly customizable** through configuration
4. **Small production bundle** size due to PurgeCSS
5. **Responsive design** made easy with built-in breakpoint prefixes

### Common Utility Classes

#### Layout

```tsx
<div className="container mx-auto px-4">
  {/* Centered container with horizontal padding */}
</div>

<div className="flex items-center justify-between">
  {/* Flexbox with aligned items and space between */}
</div>

<div className="grid grid-cols-3 gap-4">
  {/* 3-column grid with gaps */}
</div>
```

#### Typography

```tsx
<h1 className="text-3xl font-bold text-gray-800">
  Large Bold Heading
</h1>

<p className="text-base text-gray-600 leading-relaxed">
  Regular paragraph text with comfortable line height
</p>
```

#### Spacing

```tsx
<div className="p-4">
  {/* Padding on all sides */}
</div>

<div className="mt-6 mb-4">
  {/* Margin top and bottom */}
</div>

<div className="space-y-4">
  {/* Vertical spacing between children */}
</div>
```

#### Colors

```tsx
<div className="bg-blue-500 text-white">
  {/* Blue background with white text */}
</div>

<div className="border border-gray-200">
  {/* Gray border */}
</div>
```

#### Responsiveness

```tsx
<div className="flex flex-col md:flex-row">
  {/* Column on mobile, row on medium screens and up */}
</div>

<div className="hidden md:block">
  {/* Hidden on mobile, visible on medium screens and up */}
</div>
```

### Handling Component Variants with Tailwind

```tsx
type ButtonProps = {
  variant: "primary" | "secondary" | "danger";
  size: "sm" | "md" | "lg";
  children: React.ReactNode;
};

function Button({ variant, size, children }: ButtonProps) {
  const baseClasses = "font-medium rounded focus:outline-none";

  const variantClasses = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    danger: "bg-red-500 hover:bg-red-600 text-white",
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`;

  return <button className={classes}>{children}</button>;
}
```

### Tailwind with Custom CSS

For cases where you need custom CSS, you can use Tailwind's `@apply` directive:

```css
/* In your CSS file */
.custom-button {
  @apply px-4 py-2 bg-blue-500 text-white rounded;
  /* Custom CSS that can't be done with utilities */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

### Styling Best Practices

1. **Prefer composition over inheritance**
2. **Create component abstractions** for repeated patterns
3. **Use consistent spacing and sizing scales**
4. **Extract complex utility combinations** into reusable components
5. **Consider a component library** like Shadcn UI which uses Tailwind

---

## Activities & Workshops

### Activity 1: Demo - Setting up a React+TypeScript project (30 min)

**Step 1: Create a new project with Vite**

```bash
npm create vite@latest my-project -- --template react-ts
cd my-project
npm install
```

**Step 2: Add essential dependencies**

```bash
npm install react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Step 3: Configure Tailwind CSS**

Edit `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

**Step 4: Add Tailwind directives to CSS**

Edit `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Step 5: Setup folder structure**

```bash
mkdir -p src/{components,pages,hooks,types,utils,services}
mkdir -p src/components/{ui,layout,features}
```

**Step 6: Create basic components**

Create a simple component in `src/components/ui/Button.tsx`:

```tsx
type ButtonProps = {
  text: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
};

export function Button({ text, onClick, variant = "primary" }: ButtonProps) {
  const baseClasses = "px-4 py-2 rounded font-medium";
  const variantClasses =
    variant === "primary"
      ? "bg-blue-500 text-white hover:bg-blue-600"
      : "bg-gray-200 text-gray-800 hover:bg-gray-300";

  return (
    <button className={`${baseClasses} ${variantClasses}`} onClick={onClick}>
      {text}
    </button>
  );
}
```

**Step 7: Set up basic routing**

In `src/App.tsx`:

```tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
```

Create page components in `src/pages/Home.tsx` and `src/pages/About.tsx`.

**Step 8: Run the development server**

```bash
npm run dev
```

### Activity 2: Walkthrough - Creating React components with TypeScript (40 min)

In this activity, we'll build a TodoList application with proper TypeScript typing.

**Step 1: Define Types**

Create `src/types/todo.ts`:

```tsx
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export type TodoFilter = "all" | "active" | "completed";
```

**Step 2: Create UI Components**

Create `src/components/ui/TodoItem.tsx`:

```tsx
import { Todo } from "../../types/todo";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <li className="flex items-center justify-between p-3 border-b">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="mr-2"
        />
        <span className={todo.completed ? "line-through text-gray-500" : ""}>
          {todo.text}
        </span>
      </div>
      <button
        onClick={() => onDelete(todo.id)}
        className="text-red-500 hover:text-red-700"
      >
        Delete
      </button>
    </li>
  );
}
```

Create `src/components/ui/TodoFilter.tsx`:

```tsx
import { TodoFilter as FilterType } from "../../types/todo";

interface TodoFilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export function TodoFilter({ currentFilter, onFilterChange }: TodoFilterProps) {
  return (
    <div className="flex space-x-4 mt-4">
      <button
        className={`px-2 py-1 rounded ${currentFilter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        onClick={() => onFilterChange("all")}
      >
        All
      </button>
      <button
        className={`px-2 py-1 rounded ${currentFilter === "active" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        onClick={() => onFilterChange("active")}
      >
        Active
      </button>
      <button
        className={`px-2 py-1 rounded ${currentFilter === "completed" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        onClick={() => onFilterChange("completed")}
      >
        Completed
      </button>
    </div>
  );
}
```

**Step 3: Create a Custom Hook**

Create `src/hooks/useTodos.ts`:

```tsx
import { useState, useCallback } from "react";
import { Todo, TodoFilter } from "../types/todo";

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>("all");

  const addTodo = useCallback((text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
    };
    setTodos((prevTodos) => [...prevTodos, newTodo]);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  }, []);

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return {
    todos: filteredTodos,
    filter,
    addTodo,
    toggleTodo,
    deleteTodo,
    setFilter,
  };
}
```

**Step 4: Create the TodoList Component**

Create `src/components/features/TodoList.tsx`:

```tsx
import { useState } from "react";
import { TodoItem } from "../ui/TodoItem";
import { TodoFilter } from "../ui/TodoFilter";
import { useTodos } from "../../hooks/useTodos";

export function TodoList() {
  const { todos, filter, addTodo, toggleTodo, deleteTodo, setFilter } =
    useTodos();
  const [newTodoText, setNewTodoText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      addTodo(newTodoText.trim());
      setNewTodoText("");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>

      <form onSubmit={handleSubmit} className="flex mb-4">
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          className="flex-grow p-2 border rounded-l"
          placeholder="Add a new todo"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r"
        >
          Add
        </button>
      </form>

      <TodoFilter currentFilter={filter} onFilterChange={setFilter} />

      <ul className="mt-4 border-t">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          ))
        ) : (
          <li className="p-3 text-center text-gray-500">No todos found</li>
        )}
      </ul>
    </div>
  );
}
```

**Step 5: Add the TodoList to a Page**

Update `src/pages/Home.tsx`:

```tsx
import { TodoList } from "../components/features/TodoList";

function Home() {
  return (
    <div className="container mx-auto p-4">
      <TodoList />
    </div>
  );
}

export default Home;
```

### Activity 3: Workshop - Implementing UI Components with Tailwind CSS (40 min)

In this workshop, we'll implement a set of reusable UI components using Tailwind CSS.

**Component 1: Card Component**

Create `src/components/ui/Card.tsx`:

```tsx
interface CardProps {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function Card({ title, children, footer, className = "" }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
      {title && (
        <div className="border-b px-4 py-3">
          <h3 className="font-medium">{title}</h3>
        </div>
      )}
      <div className="p-4">{children}</div>
      {footer && <div className="bg-gray-50 px-4 py-3 border-t">{footer}</div>}
    </div>
  );
}
```

**Component 2: Badge Component**

Create `src/components/ui/Badge.tsx`:

```tsx
type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";

interface BadgeProps {
  text: string;
  variant?: BadgeVariant;
}

export function Badge({ text, variant = "default" }: BadgeProps) {
  const variantClasses: Record<BadgeVariant, string> = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
  };

  return (
    <span
      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${variantClasses[variant]}`}
    >
      {text}
    </span>
  );
}
```

**Component 3: Alert Component**

Create `src/components/ui/Alert.tsx`:

```tsx
type AlertType = "info" | "success" | "warning" | "error";

interface AlertProps {
  type: AlertType;
  title: string;
  message?: string;
  onClose?: () => void;
}

export function Alert({ type, title, message, onClose }: AlertProps) {
  const typeClasses: Record<
    AlertType,
    { bg: string; text: string; border: string }
  > = {
    info: {
      bg: "bg-blue-50",
      text: "text-blue-800",
      border: "border-blue-200",
    },
    success: {
      bg: "bg-green-50",
      text: "text-green-800",
      border: "border-green-200",
    },
    warning: {
      bg: "bg-yellow-50",
      text: "text-yellow-800",
      border: "border-yellow-200",
    },
    error: {
      bg: "bg-red-50",
      text: "text-red-800",
      border: "border-red-200",
    },
  };

  const { bg, text, border } = typeClasses[type];

  return (
    <div className={`${bg} ${border} border-l-4 p-4 rounded`}>
      <div className="flex items-start">
        <div className="flex-grow">
          <p className={`font-medium ${text}`}>{title}</p>
          {message && <p className={`mt-1 ${text} opacity-90`}>{message}</p>}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`${text} hover:bg-opacity-20 hover:bg-gray-900 p-1 rounded`}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
```

**Component 4: Modal Component**

Create `src/components/ui/Modal.tsx`:

```tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal content */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative z-10">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-medium">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="p-4">{children}</div>

          {/* Footer */}
          {footer && <div className="p-4 border-t bg-gray-50">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
```

**Usage Example: Create a Component Showcase**

Create `src/pages/Components.tsx`:

```tsx
import { useState } from "react";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Alert } from "../components/ui/Alert";
import { Modal } from "../components/ui/Modal";
import { Button } from "../components/ui/Button";

function Components() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Component Showcase</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cards Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Cards</h2>
          <div className="space-y-4">
            <Card title="Basic Card">
              <p>This is a basic card component with a title.</p>
            </Card>

            <Card
              title="Card with Footer"
              footer={
                <div className="text-right">
                  <Button text="Action" variant="secondary" />
                </div>
              }
            >
              <p>This card has a footer with an action button.</p>
            </Card>
          </div>
        </div>

        {/* Badges Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Badges</h2>
          <div className="space-x-2">
            <Badge text="Default" />
            <Badge text="Success" variant="success" />
            <Badge text="Warning" variant="warning" />
            <Badge text="Danger" variant="danger" />
            <Badge text="Info" variant="info" />
          </div>
        </div>

        {/* Alerts Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Alerts</h2>
          <div className="space-y-4">
            {showAlert && (
              <Alert
                type="info"
                title="Information"
                message="This is an informational alert."
                onClose={() => setShowAlert(false)}
              />
            )}
            <Alert
              type="success"
              title="Success"
              message="Operation completed successfully."
            />
            <Alert
              type="warning"
              title="Warning"
              message="This action cannot be undone."
            />
            <Alert
              type="error"
              title="Error"
              message="Something went wrong. Please try again."
            />
          </div>
        </div>

        {/* Modal Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Modal</h2>
          <Button text="Open Modal" onClick={() => setIsModalOpen(true)} />

          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Sample Modal"
            footer={
              <div className="flex justify-end space-x-2">
                <Button
                  text="Cancel"
                  variant="secondary"
                  onClick={() => setIsModalOpen(false)}
                />
                <Button text="Confirm" onClick={() => setIsModalOpen(false)} />
              </div>
            }
          >
            <p>This is a modal dialog with a customizable footer.</p>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default Components;
```

Update `src/App.tsx` to include the new page:

```tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Components from "./pages/Components";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/components" element={<Components />} />
      </Routes>
    </Router>
  );
}

export default App;
```

### Activity 4: Team Work - Planning Component Hierarchy for the Project (30 min)

In this activity, your team will create a component hierarchy for your URL shortener project. Let's first define the core features of the application:

1. User authentication (signup, login, profile)
2. URL shortening functionality
3. Dashboard with URL management (create, view, edit, delete)
4. Analytics for shortened URLs

#### Steps

1. **Identify the pages needed in your application**

   - Home page
   - Login/Signup page
   - Dashboard page
   - URL details/analytics page
   - User profile page

2. **Break down each page into components**

   - Example of a dashboard page breakdown:
     - Header (with navigation and user menu)
     - URL creation form
     - URL list/table
     - Pagination controls
     - Filter/search controls

3. **Identify reusable components across pages**

   - Form elements (inputs, buttons, etc.)
   - Card components
   - Modal dialogs
   - Alert/notification components
   - Layout components (header, footer, etc.)

4. **Create a visual representation of your component hierarchy**
   - Use a tool like Figma, Miro, or even pen and paper
   - Identify parent-child relationships
   - Note which components are stateful vs. presentational

#### Example Component Hierarchy

```
App
├── Layout
│   ├── Header
│   │   ├── Logo
│   │   ├── Navigation
│   │   └── UserMenu
│   └── Footer
├── Pages
│   ├── HomePage
│   │   ├── HeroSection
│   │   ├── FeaturesSection
│   │   └── ShortenUrlForm
│   ├── AuthPage
│   │   ├── LoginForm
│   │   └── SignupForm
│   ├── DashboardPage
│   │   ├── CreateUrlForm
│   │   ├── UrlList
│   │   │   └── UrlItem
│   │   └── Pagination
│   ├── UrlDetailsPage
│   │   ├── UrlInfo
│   │   ├── QRCodeDisplay
│   │   └── AnalyticsGraph
│   └── ProfilePage
│       ├── UserInfo
│       └── SettingsForm
└── Components
    ├── UI
    │   ├── Button
    │   ├── Input
    │   ├── Card
    │   ├── Modal
    │   ├── Alert
    │   └── Badge
    └── Features
        ├── Auth
        │   ├── AuthForm
        │   └── ProtectedRoute
        └── Url
            ├── ShortenForm
            └── AnalyticsDisplay
```

#### Deliverable

By the end of this activity, your team should have:

1. A visual representation of your component hierarchy
2. A list of reusable UI components to implement
3. A brief description of the responsibilities of each major component
4. Initial thoughts on state management strategy (where state will live)

## Homework

### Task 1: Implement Initial UI Components for the Project

Based on the component hierarchy you developed in the workshop, implement 5-7 core UI components for your project. These should include:

1. **Layout components**:

   - Header with navigation
   - Footer

2. **Form components**:

   - Input fields (with validation)
   - Button variants

3. **Feature components**:
   - URL shortening form
   - URL display card/item

### Task 2: Set up Routing with React Router

Implement the basic routing structure for your application:

1. Create page components for each main route
2. Set up the router in App.tsx
3. Implement a protected route for the dashboard
4. Add navigation between pages

Example structure:

```tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import UrlDetails from "./pages/UrlDetails";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Protected route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [isAuthenticated] = useState(false); // Replace with actual auth check

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="urls/:id"
            element={
              <ProtectedRoute>
                <UrlDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

### Task 3: Configure Tailwind CSS in the Project

1. Install and configure Tailwind CSS if not done in class
2. Create a customized theme for your project
3. Implement a dark mode toggle

Example Tailwind configuration with customization:

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        secondary: {
          // Your secondary color palette
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
      },
      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.375rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
      },
    },
  },
  plugins: [],
};
```

## Resources

### Official Documentation

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Router Documentation](https://reactrouter.com/en/main)

### Recommended Reading

- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Atomic Design Methodology](https://bradfrost.com/blog/post/atomic-web-design/)
- [A Guide to Component Driven Development](https://www.componentdriven.org/)

### Tools

- [Vite](https://vitejs.dev/) - Fast build tool and development server
- [TypeScript ESLint](https://typescript-eslint.io/) - TypeScript specific linting
- [Prettier](https://prettier.io/) - Code formatter
- [Storybook](https://storybook.js.org/) - Component development environment

## Conclusion

In this session, we've covered the fundamental concepts and practices for building modern frontend applications with React and TypeScript. We've explored component architecture, TypeScript integration, project organization, and styling with Tailwind CSS.

By completing the activities and homework, you'll have a solid foundation for your URL shortener project. The next session will build upon these foundations to implement more advanced features and connect to backend services.

Remember, the best way to learn is by doing, so don't hesitate to experiment and iterate on the components you've built today.

## Tailwind CSS v4 Changes

Update the Tailwind CSS configuration and examples to use Tailwind CSS v4, which has several important changes from v3.

Here's how to modify our code to work with Tailwind CSS v4:

### 1. Installation and Configuration

```bash
npm install -D tailwindcss@latest
npx tailwindcss init
```

### 2. Updated `tailwind.config.js`

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  // Tailwind v4 uses 'darkMode: 'selector'' instead of 'class'
  darkMode: "selector",
  theme: {
    extend: {
      // Color definitions now use CSS color functions
      colors: {
        primary: {
          // In v4, you can use oklch, hsl, rgb, etc. directly
          50: "oklch(0.97 0.02 240)",
          100: "oklch(0.95 0.03 240)",
          200: "oklch(0.90 0.05 240)",
          300: "oklch(0.85 0.08 240)",
          400: "oklch(0.75 0.12 240)",
          500: "oklch(0.65 0.15 240)",
          600: "oklch(0.55 0.15 240)",
          700: "oklch(0.45 0.12 240)",
          800: "oklch(0.35 0.10 240)",
          900: "oklch(0.25 0.08 240)",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
```

### 3. CSS Setup

```css
/* index.css - Tailwind v4 directives */
@import "tailwindcss";

/* In v4, you use @theme instead of @tailwind */
@theme base;
@theme components;
@theme utilities;

/* Optional: Custom theme variables can be defined inline */
@theme inline {
  --color-accent: oklch(0.6 0.24 296);
  --font-size-base: 16px;
}
```

### 4. Utility Class Changes

Several class names have changed in Tailwind v4. Here are the key updates we need to make to our components:

#### Button Component

```tsx
function Button({ text, onClick, variant = "primary" }: ButtonProps) {
  // In v4, spacing utilities (padding) have changed
  const baseClasses = "px-4 py-2 rounded font-medium";

  // In v4, bg- colors now use logical names
  const variantClasses =
    variant === "primary"
      ? "bg-primary-500 text-white hover:bg-primary-600"
      : "bg-gray-200 text-gray-800 hover:bg-gray-300";

  return (
    <button className={`${baseClasses} ${variantClasses}`} onClick={onClick}>
      {text}
    </button>
  );
}
```

#### Card Component

```tsx
export function Card({ title, children, footer, className = "" }: CardProps) {
  // In v4, shadow is now a logical property
  return (
    <div
      className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}
    >
      {title && (
        <div className="border-b px-4 py-3">
          <h3 className="font-medium">{title}</h3>
        </div>
      )}
      <div className="p-4">{children}</div>
      {footer && <div className="bg-gray-50 px-4 py-3 border-t">{footer}</div>}
    </div>
  );
}
```

#### Alert Component

```tsx
export function Alert({ type, title, message, onClose }: AlertProps) {
  // In v4, you can use the theme colors directly
  const typeClasses: Record<
    AlertType,
    { bg: string; text: string; border: string }
  > = {
    info: {
      bg: "bg-blue-50",
      text: "text-blue-800",
      border: "border-blue-200",
    },
    success: {
      bg: "bg-green-50",
      text: "text-green-800",
      border: "border-green-200",
    },
    warning: {
      bg: "bg-yellow-50",
      text: "text-yellow-800",
      border: "border-yellow-200",
    },
    error: {
      bg: "bg-red-50",
      text: "text-red-800",
      border: "border-red-200",
    },
  };

  const { bg, text, border } = typeClasses[type];

  // In v4, you can use data attributes for hover states
  return (
    <div className={`${bg} ${border} border-l-4 p-4 rounded`}>
      <div className="flex items-start">
        <div className="flex-grow">
          <p className={`font-medium ${text}`}>{title}</p>
          {message && <p className={`mt-1 ${text} opacity-90`}>{message}</p>}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            // V4 hover changes
            data-hover="bg-opacity-20 bg-gray-900"
            className={`${text} p-1 rounded`}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
```

### 5. Handling Dark Mode

In Tailwind v4, dark mode uses the `selector` strategy by default instead of `class`. This means we need to update our dark mode toggle:

```tsx
// Dark mode toggle with Tailwind v4
export function ModeToggle() {
  const [isDark, setIsDark] = useState(false);

  const toggleDarkMode = () => {
    // In v4, we toggle the 'dark' class on the document element
    if (isDark) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
    setIsDark(!isDark);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full bg-gray-100 dark:bg-gray-800"
    >
      {isDark ? (
        <span className="text-yellow-400">☀️</span>
      ) : (
        <span className="text-gray-700">🌙</span>
      )}
    </button>
  );
}
```

### 6. Dark Mode Implementation

In Tailwind v4, apply dark mode styles using the `dark:` prefix as before, but the mechanism is different:

```tsx
function DarkModeExample() {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 rounded">
      <h2 className="text-xl font-bold">Dark Mode Support</h2>
      <p className="mt-2">This component supports dark mode in Tailwind v4.</p>
      <button className="mt-4 bg-primary-500 dark:bg-primary-600 text-white px-4 py-2 rounded">
        Button
      </button>
    </div>
  );
}
```

### 7. New Features in Tailwind v4

Let's take advantage of some new features in Tailwind v4:

#### Using CSS Variables for Theme

```tsx
// In your theme configuration
import { theme } from "@/lib/theme";

// Theme utility
function createTheme() {
  return {
    colors: {
      primary: {
        DEFAULT: "oklch(0.65 0.15 240)",
        light: "oklch(0.85 0.08 240)",
        dark: "oklch(0.45 0.12 240)",
      },
      // Other colors...
    },
  };
}

// Using theme values in components
function ThemedButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="bg-primary text-white dark:bg-primary-dark px-4 py-2 rounded">
      {children}
    </button>
  );
}
```

#### Using the New Data Attributes for States

Tailwind v4 introduces a new approach for handling hover, focus, and other states using data attributes:

```tsx
function InteractiveButton({ text }: { text: string }) {
  return (
    <button
      className="px-4 py-2 rounded bg-primary-500 text-white"
      data-hover="bg-primary-600"
      data-focus="ring-2 ring-primary-300"
      data-active="bg-primary-700"
    >
      {text}
    </button>
  );
}
```

#### Using the New Arbitrary Properties

Tailwind v4 makes it easier to use arbitrary CSS properties:

```tsx
function CustomComponent() {
  return (
    <div className="[--my-variable:20px] [transform:rotate(10deg)] [mask-image:linear-gradient(to_bottom,transparent,black)]">
      Custom styled content
    </div>
  );
}
```

### Summary of Key Changes for Tailwind v4

1. **CSS Directives**: Changed from `@tailwind` to `@theme`
2. **Dark Mode**: Uses `selector` strategy instead of `class`
3. **Colors**: Support for modern color formats like `oklch`, `hsl`, etc.
4. **State Modifiers**: New data attributes approach for states like hover, focus
5. **Theme Configuration**: More streamlined approach with CSS variables
6. **Spacing Utilities**: Updated syntax for consistency
7. **Arbitrary Properties**: Enhanced support for custom CSS properties

These changes will help you use the latest features of Tailwind CSS v4 while building your React components with TypeScript.

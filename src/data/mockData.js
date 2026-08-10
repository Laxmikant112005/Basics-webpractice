export const mockDesigns = [
  {
    id: 1,
    title: "Modern Glass Villa",
    description: "A stunning modern villa with floor-to-ceiling glass walls, open-plan living, and an infinity pool.",
    bedrooms: 4,
    floors: 2,
    kitchen: 1,
    parking: 2,
    budget: 500000,
    location: "Malibu, CA",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800",
    engineerId: 101,
    tags: ["Modern", "Glass", "Luxury"]
  },
  {
    id: 2,
    title: "Scandinavian Minimalist",
    description: "Clean lines, natural wood, and cozy spaces define this Scandinavian-inspired home.",
    bedrooms: 3,
    floors: 1,
    kitchen: 1,
    parking: 1,
    budget: 300000,
    location: "Oslo, Norway",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800",
    engineerId: 102,
    tags: ["Scandi", "Minimalist", "Wood"]
  },
  {
    id: 3,
    title: "Contemporary Urban Loft",
    description: "An industrial-style loft with exposed brick, high ceilings, and smart home features.",
    bedrooms: 2,
    floors: 3,
    kitchen: 1,
    parking: 0,
    budget: 450000,
    location: "New York, NY",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
    engineerId: 101,
    tags: ["Urban", "Industrial", "Loft"]
  },
  {
    id: 4,
    title: "Mediterranean Retreat",
    description: "Terracotta tiles, white-washed walls, and lush gardens make this a perfect getaway.",
    bedrooms: 5,
    floors: 2,
    kitchen: 2,
    parking: 3,
    budget: 750000,
    location: "Santorini, Greece",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800",
    engineerId: 103,
    tags: ["Mediterranean", "Classic", "Resort"]
  },
  {
    id: 5,
    title: "Mountain Cabin",
    description: "A cozy A-frame cabin built with sustainable cedar, featuring a massive stone fireplace.",
    bedrooms: 2,
    floors: 2,
    kitchen: 1,
    parking: 1,
    budget: 250000,
    location: "Aspen, CO",
    image: "https://images.unsplash.com/photo-1542718610-a1af47864f1d?auto=format&fit=crop&q=80&w=800",
    engineerId: 102,
    tags: ["Cabin", "Rustic", "Sustainable"]
  }
];

export const mockEngineers = [
  {
    id: 101,
    name: "John Smith",
    specialization: "Modern Architecture",
    rating: 4.9,
    location: "California, USA",
    avatar: "https://i.pravatar.cc/150?u=john",
    bio: "Passionate about sustainable and glass-based designs."
  },
  {
    id: 102,
    name: "Jane Doe",
    specialization: "Minimalist & Scandinavian",
    rating: 4.8,
    location: "Oslo, Norway",
    avatar: "https://i.pravatar.cc/150?u=jane",
    bio: "Focusing on functional and aesthetic living spaces."
  },
  {
    id: 103,
    name: "Michael Chen",
    specialization: "Mediterranean Luxury",
    rating: 5.0,
    location: "Athens, Greece",
    avatar: "https://i.pravatar.cc/150?u=michael",
    bio: "Specializing in high-end resort style villas."
  }
];

export const mockUsers = [
  { 
    id: 1, 
    name: "Alice User", 
    email: "user@test.com", 
    role: "user", 
    password: "password",
    avatar: "https://i.pravatar.cc/150?u=alice"
  },
  { 
    id: 2, 
    name: "Bob Engineer", 
    email: "engineer@test.com", 
    role: "engineer", 
    password: "password",
    avatar: "https://i.pravatar.cc/150?u=bob",
    specialization: "Structural Engineering",
    rating: 4.7,
    location: "New York, NY",
    bio: "Experienced civil engineer specializing in residential projects."
  },
  { 
    id: 3, 
    name: "Charlie Admin", 
    email: "admin@test.com", 
    role: "admin", 
    password: "password",
    avatar: "https://i.pravatar.cc/150?u=charlie"
  }
];

// Export for services (already used by notification/feedback services internally)
export const mockNotifications = []; // Managed by notificationService
export const mockFeedbacks = []; // Managed by feedbackService

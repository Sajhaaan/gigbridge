// Sample user data for testing
const MOCK_USERS = [
  {
    id: '1',
    email: 'worker@example.com',
    password: 'password123',
    fullName: 'John Worker',
    userType: 'worker',
  },
  {
    id: '2',
    email: 'business@example.com',
    password: 'password123',
    fullName: 'Business Owner',
    userType: 'business',
  },
];

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate a simple token without using btoa (which may not be available in React Native)
const generateToken = (id: string) => {
  const timestamp = Date.now().toString();
  const randomPart = Math.random().toString(36).substring(2, 10);
  return `user-${id}-${timestamp}-${randomPart}`;
};

export const mockApi = {
  login: async (email: string, password: string) => {
    // Simulate network delay
    await delay(1000);
    
    const user = MOCK_USERS.find(u => u.email === email);
    
    if (!user || user.password !== password) {
      throw new Error('Invalid email or password');
    }
    
    // Create a simple token
    const token = generateToken(user.id);
    
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      success: true,
      message: 'Login successful',
      user: userWithoutPassword,
      token,
    };
  },
  
  register: async (fullName: string, email: string, password: string, userType: 'worker' | 'business') => {
    // Simulate network delay
    await delay(1000);
    
    // Check if user already exists
    if (MOCK_USERS.some(u => u.email === email)) {
      throw new Error('User with this email already exists');
    }
    
    // Create new user
    const newUser = {
      id: String(MOCK_USERS.length + 1),
      email,
      password,
      fullName,
      userType,
    };
    
    // Add to mock database (this won't persist between app reloads)
    MOCK_USERS.push(newUser);
    
    // Create a simple token
    const token = generateToken(newUser.id);
    
    const { password: _, ...userWithoutPassword } = newUser;
    
    return {
      success: true,
      message: 'Registration successful',
      user: userWithoutPassword,
      token,
    };
  },
  
  logout: async () => {
    // Simulate network delay
    await delay(500);
    
    return {
      success: true,
      message: 'Logged out successfully',
    };
  },
}; 
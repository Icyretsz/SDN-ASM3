export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface User {
  _id: string,
  name: string,
  email: string,
  yob: string,
  gender: 'male' | 'female',
  isAdmin: boolean,
  createdAt: string,
  updatedAt: string,
}

export interface Brand {
  _id: string;
  brandName: string;
  createdAt: string,
  updatedAt: string,
}

export interface Comment {
  _id: string;
  rating: number;
  content: string;
  author: User
}

export interface Perfume {
   _id: string;
  perfumeName: string;
  uri: string;
  price: number;
  concentration: string;
  description: string;
  ingredients: string;
  volume: number;
  targetAudience: 'male' | 'female' | 'unisex';
  comments: Comment,
  brand: Brand,
}


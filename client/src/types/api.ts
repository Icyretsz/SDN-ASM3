export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  _id: string,
  name: string,
  email: string,
  yob: string,
  gender: 'male' | 'female',
  isAdmin: boolean,
}

export interface LoginDataResponse {
  accessToken: string,
  user: User,
}

export interface Brand {
  _id: string;
  brandName: string;
  createdAt: string,
  updatedAt: string,
}

export interface CommentType {
  _id: string;
  rating: number;
  content: string;
  author: User;
  createdAt: string;
  updatedAt: string;
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
  comments: CommentType[],
  brand: Brand,
}

export interface UserCommentType extends CommentType {
  perfume: {
    _id: string;
    perfumeName: string;
    uri: string;
    brand: Brand;
  };
}


export interface User {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirm_password: string;
  phone: string;
}
export interface IUser {
  token: any;
  name: string;
  email: string;
  role: string;
  _id: string;
  __v: number;
}
export interface FoodItem {
  supplier_data: {
    supplier_id: number,
    supplier_name: string,
    delivery_price: number,
  },
  product: Product;
  options: Option[];
  quantity: number;
  total: number;
  unitePrice: number;
}

export interface Option {
  id: number;
  name: string;
  price: number;
  type: string;
  description: string | null;
  checked: boolean;
}

export type MenuData = {
  id: number;
  name: string;
  description: string;
  position: number;
  image: string;
  price: number;
  products: Array<{
    id: number;
    name: string;
    description: string;
    price: number;
    image: any;
  }>;
};
export interface IGenericResponse {
  status: string;
  message: string;
}

export type Position = {
  coords: {
    latitude: number;
    longitude: number;
    label: string | null;
  };
};

export interface Product {
  id: number;
  available: number;
  description: string;
  discount_price: number;
  discount_source: string;
  discount_type: string;
  discount_value: number;
  image: [{
    id: number;
    created_at: string | null;
    deleted_at: string | null;
    updated_at: string | null;
    name: string;
    path: string;
    user_id: number
  }];
  is_popular: number;
  name: string;
  options: Option[]
  options_max: [{
    id: number;
    max: number;
    type_option: string;
  }];
  position: number;
  price: number;
  quantity?: number;
}

export interface Restaurant {
  cashout: string;
  children_cat: never[]; // or unknown[]
  city: string;
  closetime: string;
  commission: number;
  created_at: string;
  deleted_at: string | null;
  delivery: number;
  delivery_price: string;
  discount_priority: string;
  discount_title: string;
  distance: number;
  firstName: string;
  forced_status: string;
  forced_status_at: string | null;
  forced_status_hours: number;
  id: number;
  images: {
    [key: string]: string;
  }[];
  is_discount: string;
  lastName: string;
  lat: number;
  long: number;
  medium_time: number;
  min_cost: number;
  name: string;
  on_site: number;
  online: number;
  parents_cat: {
    [key: string]: string;
  }[];
  postcode: string;
  qantityVente: number;
  region: string;
  region_id: number;
  service_price: number;
  soscloseat: string | null;
  sosopenat: string | null;
  star: number;
  starttime: string;
  status: number;
  street: string;
  take_away: number;
  updated_at: string;
  description: string;
  priceRange: number;
  rating: number;
  plates: string[];
  favor?: boolean;
}

export interface Message {
  id?: number;
  clinet_id?: number;
  send?: number;
  created_at?: string;
  updated_at?: string;
  date?: string;
  deleted_at?: string;
  read_at?: string;
  displayDate?: boolean;
  message: string;
}
export interface User {
  firstname: string;
  lastname: string;
  email: string;
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
  id: number;
  name: string;
  price: number;
  image: any;
  supplier_id: any;
  quantity: number;
  obligatoryOptions: Option[];
  optionalOptions: Option[];
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
}

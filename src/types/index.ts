export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  measurements: Measurements;
  createdAt: Date;
}

export interface Measurements {
  chest?: number;
  waist?: number;
  hips?: number;
  shoulders?: number;
  sleeveLength?: number;
  inseam?: number;
  outseam?: number;
  neck?: number;
  notes?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  description: string;
  garmentType: GarmentType;
  status: OrderStatus;
  price: number;
  deposit: number;
  dueDate: Date;
  createdAt: Date;
  notes?: string;
}

export type GarmentType = 
  | 'suit'
  | 'shirt'
  | 'trousers'
  | 'dress'
  | 'coat'
  | 'vest'
  | 'alteration'
  | 'embroidery_logo'
  | 'embroidery_monogram'
  | 'embroidery_custom'
  | 'embroidery_patch'
  | 'uniform'
  | 'curtains'
  | 'other';

export type OrderStatus = 
  | 'pending'
  | 'measuring'
  | 'cutting'
  | 'sewing'
  | 'fitting'
  | 'finishing'
  | 'ready'
  | 'delivered';

export interface DashboardStats {
  totalOrders: number;
  activeOrders: number;
  totalCustomers: number;
  monthlyRevenue: number;
  pendingDeliveries: number;
}

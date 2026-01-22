import { Customer, Order, DashboardStats } from '@/types';

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'James Whitmore',
    email: 'james.whitmore@email.com',
    phone: '+1 (555) 123-4567',
    measurements: {
      chest: 42,
      waist: 34,
      shoulders: 18,
      sleeveLength: 25,
      neck: 16,
      notes: 'Prefers slim fit'
    },
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Elizabeth Grant',
    email: 'e.grant@email.com',
    phone: '+1 (555) 234-5678',
    measurements: {
      chest: 36,
      waist: 28,
      hips: 38,
      shoulders: 15,
      notes: 'Prefers classic silhouettes'
    },
    createdAt: new Date('2024-02-20')
  },
  {
    id: '3',
    name: 'Robert Chen',
    email: 'robert.chen@email.com',
    phone: '+1 (555) 345-6789',
    measurements: {
      chest: 40,
      waist: 32,
      shoulders: 17.5,
      sleeveLength: 24,
      inseam: 32,
      neck: 15.5,
    },
    createdAt: new Date('2024-03-10')
  },
  {
    id: '4',
    name: 'Victoria Palmer',
    email: 'v.palmer@email.com',
    phone: '+1 (555) 456-7890',
    measurements: {
      chest: 34,
      waist: 26,
      hips: 36,
      notes: 'Wedding dress alterations specialist client'
    },
    createdAt: new Date('2024-04-05')
  }
];

export const mockOrders: Order[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'James Whitmore',
    description: 'Custom embroidered logo on uniforms',
    garmentType: 'embroidery_logo',
    status: 'sewing',
    price: 2800,
    deposit: 1400,
    dueDate: new Date('2025-02-15'),
    createdAt: new Date('2025-01-10'),
    notes: 'Company logo placement on left chest'
  },
  {
    id: '2',
    customerId: '2',
    customerName: 'Elizabeth Grant',
    description: 'Evening gown - emerald silk',
    garmentType: 'dress',
    status: 'fitting',
    price: 3500,
    deposit: 1750,
    dueDate: new Date('2025-02-01'),
    createdAt: new Date('2024-12-20')
  },
  {
    id: '3',
    customerId: '3',
    customerName: 'Robert Chen',
    description: 'Cotton dress shirts (x4)',
    garmentType: 'shirt',
    status: 'measuring',
    price: 800,
    deposit: 400,
    dueDate: new Date('2025-02-28'),
    createdAt: new Date('2025-01-18')
  },
  {
    id: '4',
    customerId: '4',
    customerName: 'Victoria Palmer',
    description: 'Wedding dress alterations',
    garmentType: 'alteration',
    status: 'ready',
    price: 450,
    deposit: 450,
    dueDate: new Date('2025-01-25'),
    createdAt: new Date('2025-01-05')
  },
  {
    id: '5',
    customerId: '1',
    customerName: 'James Whitmore',
    description: 'Monogram embroidery on shirts',
    garmentType: 'embroidery_monogram',
    status: 'pending',
    price: 2200,
    deposit: 1100,
    dueDate: new Date('2025-03-15'),
    createdAt: new Date('2025-01-20')
  }
];

export const mockStats: DashboardStats = {
  totalOrders: 47,
  activeOrders: 12,
  totalCustomers: 34,
  monthlyRevenue: 18500,
  pendingDeliveries: 4
};

import { MainLayout } from '@/components/layout/MainLayout';
import { mockCustomers } from '@/data/mockData';
import { Ruler } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function Measurements() {
  return (
    <MainLayout 
      title="Measurements" 
      subtitle="Client measurement records"
    >
      {/* Measurements Table */}
      <div className="bg-card rounded-xl border border-border shadow-soft overflow-hidden animate-fade-in">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50">
              <TableHead className="font-semibold">Customer</TableHead>
              <TableHead className="font-semibold text-center">Chest</TableHead>
              <TableHead className="font-semibold text-center">Waist</TableHead>
              <TableHead className="font-semibold text-center">Hips</TableHead>
              <TableHead className="font-semibold text-center">Shoulders</TableHead>
              <TableHead className="font-semibold text-center">Sleeve</TableHead>
              <TableHead className="font-semibold text-center">Neck</TableHead>
              <TableHead className="font-semibold text-center">Inseam</TableHead>
              <TableHead className="font-semibold">Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockCustomers.map((customer) => (
              <TableRow 
                key={customer.id} 
                className="hover:bg-secondary/30 transition-colors"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-foreground font-medium text-xs">
                      {customer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="font-medium text-foreground">{customer.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center text-muted-foreground">
                  {customer.measurements.chest ? `${customer.measurements.chest}"` : '—'}
                </TableCell>
                <TableCell className="text-center text-muted-foreground">
                  {customer.measurements.waist ? `${customer.measurements.waist}"` : '—'}
                </TableCell>
                <TableCell className="text-center text-muted-foreground">
                  {customer.measurements.hips ? `${customer.measurements.hips}"` : '—'}
                </TableCell>
                <TableCell className="text-center text-muted-foreground">
                  {customer.measurements.shoulders ? `${customer.measurements.shoulders}"` : '—'}
                </TableCell>
                <TableCell className="text-center text-muted-foreground">
                  {customer.measurements.sleeveLength ? `${customer.measurements.sleeveLength}"` : '—'}
                </TableCell>
                <TableCell className="text-center text-muted-foreground">
                  {customer.measurements.neck ? `${customer.measurements.neck}"` : '—'}
                </TableCell>
                <TableCell className="text-center text-muted-foreground">
                  {customer.measurements.inseam ? `${customer.measurements.inseam}"` : '—'}
                </TableCell>
                <TableCell className="max-w-[200px]">
                  <p className="text-sm text-muted-foreground truncate">
                    {customer.measurements.notes || '—'}
                  </p>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Ruler className="w-4 h-4" />
        <span>All measurements are in inches</span>
      </div>
    </MainLayout>
  );
}

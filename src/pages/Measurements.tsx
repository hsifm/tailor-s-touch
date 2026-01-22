import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useCustomers, CustomerData } from '@/hooks/useCustomers';
import { Ruler, Pencil, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import type { Json } from '@/integrations/supabase/types';

interface MeasurementData {
  chest?: number;
  waist?: number;
  hips?: number;
  shoulders?: number;
  sleeveLength?: number;
  neck?: number;
  inseam?: number;
  notes?: string;
}

function getMeasurements(customer: CustomerData): MeasurementData {
  if (!customer.measurements || typeof customer.measurements !== 'object' || Array.isArray(customer.measurements)) {
    return {};
  }
  return customer.measurements as MeasurementData;
}

export default function Measurements() {
  const { customers, isLoading } = useCustomers();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<MeasurementData>({});
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const startEditing = (customer: CustomerData) => {
    setEditingId(customer.id);
    setEditData(getMeasurements(customer));
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveMeasurements = async (customerId: string) => {
    const { error } = await supabase
      .from('customers')
      .update({ measurements: editData as Json })
      .eq('id', customerId);

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Saved',
        description: 'Measurements updated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    }
    setEditingId(null);
    setEditData({});
  };

  const handleChange = (field: keyof MeasurementData, value: string) => {
    if (field === 'notes') {
      setEditData({ ...editData, notes: value });
    } else {
      const numValue = value === '' ? undefined : parseFloat(value);
      setEditData({ ...editData, [field]: numValue });
    }
  };

  return (
    <MainLayout 
      title="Measurements" 
      subtitle="Client measurement records"
    >
      {/* Loading State */}
      {isLoading && (
        <div className="bg-card rounded-xl border border-border shadow-soft overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50">
                <TableHead>Customer</TableHead>
                <TableHead className="text-center">Chest</TableHead>
                <TableHead className="text-center">Waist</TableHead>
                <TableHead className="text-center">Hips</TableHead>
                <TableHead className="text-center">Shoulders</TableHead>
                <TableHead className="text-center">Sleeve</TableHead>
                <TableHead className="text-center">Neck</TableHead>
                <TableHead className="text-center">Inseam</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3].map((i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  {[...Array(8)].map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-5 w-12 mx-auto" /></TableCell>
                  ))}
                  <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && customers.length === 0 && (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <Ruler className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No customers yet. Add customers first to record their measurements.</p>
        </div>
      )}

      {/* Measurements Table */}
      {!isLoading && customers.length > 0 && (
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
                <TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => {
                const measurements = getMeasurements(customer);
                const isEditing = editingId === customer.id;

                return (
                  <TableRow 
                    key={customer.id} 
                    className="hover:bg-secondary/30 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-foreground font-medium text-xs">
                          {customer.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-medium text-foreground">{customer.name}</span>
                      </div>
                    </TableCell>
                    {isEditing ? (
                      <>
                        <TableCell>
                          <Input
                            type="number"
                            className="w-16 h-8 text-center mx-auto"
                            value={editData.chest ?? ''}
                            onChange={(e) => handleChange('chest', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            className="w-16 h-8 text-center mx-auto"
                            value={editData.waist ?? ''}
                            onChange={(e) => handleChange('waist', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            className="w-16 h-8 text-center mx-auto"
                            value={editData.hips ?? ''}
                            onChange={(e) => handleChange('hips', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            className="w-16 h-8 text-center mx-auto"
                            value={editData.shoulders ?? ''}
                            onChange={(e) => handleChange('shoulders', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            className="w-16 h-8 text-center mx-auto"
                            value={editData.sleeveLength ?? ''}
                            onChange={(e) => handleChange('sleeveLength', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            className="w-16 h-8 text-center mx-auto"
                            value={editData.neck ?? ''}
                            onChange={(e) => handleChange('neck', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            className="w-16 h-8 text-center mx-auto"
                            value={editData.inseam ?? ''}
                            onChange={(e) => handleChange('inseam', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            className="w-full h-8"
                            value={editData.notes ?? ''}
                            onChange={(e) => handleChange('notes', e.target.value)}
                            placeholder="Notes..."
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-primary hover:text-primary"
                              onClick={() => saveMeasurements(customer.id)}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={cancelEditing}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="text-center text-muted-foreground">
                          {measurements.chest ? `${measurements.chest}"` : '—'}
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          {measurements.waist ? `${measurements.waist}"` : '—'}
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          {measurements.hips ? `${measurements.hips}"` : '—'}
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          {measurements.shoulders ? `${measurements.shoulders}"` : '—'}
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          {measurements.sleeveLength ? `${measurements.sleeveLength}"` : '—'}
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          {measurements.neck ? `${measurements.neck}"` : '—'}
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          {measurements.inseam ? `${measurements.inseam}"` : '—'}
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          <p className="text-sm text-muted-foreground truncate">
                            {measurements.notes || '—'}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => startEditing(customer)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Ruler className="w-4 h-4" />
        <span>All measurements are in inches. Click the pencil icon to edit.</span>
      </div>
    </MainLayout>
  );
}

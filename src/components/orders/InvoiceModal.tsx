import { useRef } from 'react';
import { format } from 'date-fns';
import { Printer, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatCurrency } from '@/lib/currency';
import { OrderData } from '@/hooks/useOrders';
import { usePayments } from '@/hooks/usePayments';

interface InvoiceModalProps {
  order: OrderData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GARMENT_LABELS: Record<string, string> = {
  thobe: 'Thobe',
  kandura: 'Kandura',
  abaya: 'Abaya',
  jalabiya: 'Jalabiya',
  suit: 'Suit',
  shirt: 'Shirt',
  pants: 'Pants',
  dress: 'Dress',
  other: 'Other',
};

export function InvoiceModal({ order, open, onOpenChange }: InvoiceModalProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const { payments } = usePayments(order?.id);

  if (!order) return null;

  const totalPaid = order.deposit + payments.reduce((sum, p) => sum + p.amount, 0);
  const balance = order.price - totalPaid;

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${order.customer_name}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              padding: 40px;
              color: #1a1a1a;
              background: white;
            }
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 2px solid #e5e5e5;
            }
            .company-name {
              font-size: 28px;
              font-weight: 700;
              color: #1a1a1a;
            }
            .company-tagline {
              font-size: 14px;
              color: #666;
              margin-top: 4px;
            }
            .invoice-title {
              text-align: right;
            }
            .invoice-title h1 {
              font-size: 24px;
              font-weight: 600;
              color: #1a1a1a;
            }
            .invoice-number {
              font-size: 14px;
              color: #666;
              margin-top: 4px;
            }
            .details-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 40px;
              margin-bottom: 40px;
            }
            .detail-section h3 {
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              color: #666;
              margin-bottom: 8px;
            }
            .detail-section p {
              font-size: 14px;
              line-height: 1.6;
            }
            .detail-section .name {
              font-weight: 600;
              font-size: 16px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            th {
              text-align: left;
              padding: 12px;
              background: #f5f5f5;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              color: #666;
              border-bottom: 1px solid #e5e5e5;
            }
            th:last-child {
              text-align: right;
            }
            td {
              padding: 12px;
              font-size: 14px;
              border-bottom: 1px solid #e5e5e5;
            }
            td:last-child {
              text-align: right;
            }
            .totals {
              margin-left: auto;
              width: 280px;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              font-size: 14px;
            }
            .total-row.final {
              border-top: 2px solid #1a1a1a;
              margin-top: 8px;
              padding-top: 16px;
              font-size: 18px;
              font-weight: 700;
            }
            .total-row.balance {
              color: ${balance > 0 ? '#dc2626' : '#16a34a'};
            }
            .payment-history {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e5e5e5;
            }
            .payment-history h3 {
              font-size: 14px;
              font-weight: 600;
              margin-bottom: 12px;
            }
            .payment-item {
              display: flex;
              justify-content: space-between;
              font-size: 13px;
              padding: 6px 0;
              color: #666;
            }
            .footer {
              margin-top: 60px;
              padding-top: 20px;
              border-top: 1px solid #e5e5e5;
              text-align: center;
              font-size: 12px;
              color: #999;
            }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="font-serif">Invoice Preview</DialogTitle>
          <div className="flex gap-2">
            <Button onClick={handlePrint} className="gap-2">
              <Printer className="w-4 h-4" />
              Print Invoice
            </Button>
          </div>
        </DialogHeader>

        {/* Invoice Content */}
        <div ref={printRef} className="invoice-container">
          {/* Header */}
          <div className="header flex justify-between items-start mb-8 pb-4 border-b-2 border-border">
            <div>
              <div className="company-name text-2xl font-serif font-bold text-foreground">
                Tailor Shop
              </div>
              <div className="company-tagline text-sm text-muted-foreground mt-1">
                Quality Custom Tailoring
              </div>
            </div>
            <div className="invoice-title text-right">
              <h1 className="text-xl font-semibold text-foreground">INVOICE</h1>
              <div className="invoice-number text-sm text-muted-foreground mt-1">
                #{order.id.slice(0, 8).toUpperCase()}
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="details-grid grid grid-cols-2 gap-8 mb-8">
            <div className="detail-section">
              <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                Bill To
              </h3>
              <p className="name font-semibold text-foreground">{order.customer_name}</p>
            </div>
            <div className="detail-section text-right">
              <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                Invoice Details
              </h3>
              <p className="text-sm text-foreground">
                Date: {format(new Date(order.created_at), 'MMMM d, yyyy')}
              </p>
              {order.due_date && (
                <p className="text-sm text-foreground">
                  Due: {format(new Date(order.due_date), 'MMMM d, yyyy')}
                </p>
              )}
              <p className="text-sm text-foreground capitalize">
                Status: {order.status}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full mb-6">
            <thead>
              <tr className="bg-secondary/50">
                <th className="text-left p-3 text-xs uppercase tracking-wide text-muted-foreground">
                  Description
                </th>
                <th className="text-left p-3 text-xs uppercase tracking-wide text-muted-foreground">
                  Type
                </th>
                <th className="text-right p-3 text-xs uppercase tracking-wide text-muted-foreground">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="p-3 text-sm text-foreground">
                  {order.description || 'Custom tailoring service'}
                </td>
                <td className="p-3 text-sm text-muted-foreground">
                  {GARMENT_LABELS[order.garment_type] || order.garment_type}
                </td>
                <td className="p-3 text-sm text-foreground text-right font-medium">
                  {formatCurrency(order.price)}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Totals */}
          <div className="totals ml-auto w-72">
            <div className="total-row flex justify-between py-2 text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">{formatCurrency(order.price)}</span>
            </div>
            <div className="total-row flex justify-between py-2 text-sm">
              <span className="text-muted-foreground">Initial Deposit</span>
              <span className="text-primary">-{formatCurrency(order.deposit)}</span>
            </div>
            {payments.map((payment) => (
              <div key={payment.id} className="total-row flex justify-between py-2 text-sm">
                <span className="text-muted-foreground">
                  Payment ({format(new Date(payment.transaction_date), 'MMM d')})
                </span>
                <span className="text-primary">-{formatCurrency(payment.amount)}</span>
              </div>
            ))}
            <div className="total-row final flex justify-between py-4 mt-2 border-t-2 border-foreground text-lg font-bold">
              <span>Balance Due</span>
              <span className={balance > 0 ? 'text-destructive' : 'text-primary'}>
                {formatCurrency(balance)}
              </span>
            </div>
          </div>

          {/* Payment History Summary */}
          {(order.deposit > 0 || payments.length > 0) && (
            <div className="payment-history mt-8 pt-4 border-t border-border">
              <h3 className="text-sm font-semibold text-foreground mb-3">Payment Summary</h3>
              <div className="space-y-1">
                {order.deposit > 0 && (
                  <div className="payment-item flex justify-between text-sm text-muted-foreground">
                    <span>Initial Deposit</span>
                    <span>{formatCurrency(order.deposit)}</span>
                  </div>
                )}
                {payments.map((payment) => (
                  <div key={payment.id} className="payment-item flex justify-between text-sm text-muted-foreground">
                    <span>
                      {format(new Date(payment.transaction_date), 'MMM d, yyyy')} 
                      {payment.payment_method && ` (${payment.payment_method})`}
                    </span>
                    <span>{formatCurrency(payment.amount)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-medium text-foreground pt-2 border-t border-border">
                  <span>Total Paid</span>
                  <span>{formatCurrency(totalPaid)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {order.notes && (
            <div className="mt-6 p-4 bg-secondary/30 rounded-lg">
              <h3 className="text-sm font-semibold text-foreground mb-1">Notes</h3>
              <p className="text-sm text-muted-foreground">{order.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="footer mt-12 pt-4 border-t border-border text-center text-xs text-muted-foreground">
            <p>Thank you for your business!</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

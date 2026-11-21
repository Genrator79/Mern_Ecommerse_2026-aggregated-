import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCustomerCartAndCheckoutStore } from "@/features/customer/cart-and-checkout/store";
import { formatPrice } from "@/lib/utils";
import { CheckCircle2, CreditCard, Loader2, XCircle } from "lucide-react";

export default function CustomerPaymentSimulationDialog() {
  const { simulation, setSimulationOpen, processSimulatedPayment, checkoutLoading } =
    useCustomerCartAndCheckoutStore();

  return (
    <Dialog open={simulation.isOpen} onOpenChange={setSimulationOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <CreditCard className="h-6 w-6" />
          </div>
          <DialogTitle className="text-xl font-bold">
            Simulated Payment Gateway
          </DialogTitle>
          <DialogDescription className="text-xs">
            Test mode enabled. Select an outcome below to test the end-to-end checkout flow.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="rounded-xl border border-border/80 bg-muted/40 p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-mono font-medium text-foreground">{simulation.orderId.slice(-8)}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Items</span>
              <span className="font-medium text-foreground">{simulation.totalItems} item{simulation.totalItems !== 1 ? "s" : ""}</span>
            </div>
            {simulation.deliveryName ? (
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Deliver to</span>
                <span className="font-medium text-foreground">{simulation.deliveryName}</span>
              </div>
            ) : null}
            <div className="border-t border-border/60 pt-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Total Payable</span>
              <span className="text-lg font-bold text-primary">{formatPrice(simulation.amount)}</span>
            </div>
          </div>

          <div className="space-y-2.5">
            <Button
              type="button"
              className="w-full h-11 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              disabled={checkoutLoading}
              onClick={() => void processSimulatedPayment("success")}
            >
              {checkoutLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              Simulate Successful Payment
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full h-11 gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
              disabled={checkoutLoading}
              onClick={() => void processSimulatedPayment("failure")}
            >
              <XCircle className="h-4 w-4" />
              Simulate Payment Failure / Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

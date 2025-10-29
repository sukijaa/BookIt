'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  IndianRupee,
  Loader2,
  Lock,
  ArrowLeft,
  AlertCircle,
  Ticket,
  X,
} from 'lucide-react';
import { EXPERIENCES_QUERY_KEY } from '../page';
import { ClientOnly } from '@/components/ClientOnly';

// --- THIS IS THE FIX ---
// We define 'terms' as a simple boolean, and move the
// 'default(false)' to the useForm hook, which solves the conflict.
const formSchema = z
  .object({
    promoCode: z.string().optional(),
    terms: z.boolean(), // <-- REMOVED .default(false)
  })
  .refine((data) => data.terms === true, {
    // This refinement now works correctly
    message: 'You must accept the terms and policies.',
    path: ['terms'], // Tell Zod which field this error belongs to
  });
// --- END OF FIX ---

type PromoCode = {
  id: string;
  code_text: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
};

// This is the internal component that has access to search params
function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { user } = useUser(); // <-- FIXED: Removed extra '}'

  // --- 1. Read data from URL (Unchanged) ---
  const experienceId = searchParams.get('experienceId');
  const title = searchParams.get('title') || 'Experience';
  const price = parseFloat(searchParams.get('price') || '0');
  const slotId = searchParams.get('slotId');
  const startTime = searchParams.get('startTime') || '';
  const date = searchParams.get('date') || '';
  const quantity = parseInt(searchParams.get('quantity') || '1');

  // --- 2. Price & Promo State (Unchanged) ---
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const taxes = 59;
  const subtotal = price * quantity;

  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.discount_type === 'percentage') {
      discount = (subtotal * appliedPromo.discount_value) / 100;
    } else {
      discount = Math.min(appliedPromo.discount_value, subtotal + taxes);
    }
  }
  const total = subtotal + taxes - discount;

  // --- 3. Setup React Hook Form (Unchanged) ---
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      promoCode: '',
      terms: false, // The default value is set HERE
    },
  });

  // --- 4. Promo Code Mutation (Unchanged) ---
  const { mutate: validatePromo, isPending: isCheckingPromo } = useMutation({
    mutationFn: (code: string) => axios.post('/api/promo/validate', { code }),
    onSuccess: (response) => {
      const promoData = response.data as PromoCode;
      setAppliedPromo(promoData);
      toast.success('Promo applied!', {
        description: `${promoData.code_text} gave you a discount.`,
      });
    },
    onError: (error) => {
      setAppliedPromo(null);
      let errorMessage = 'Invalid or expired promo code.';
      if (error instanceof AxiosError && error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      toast.error(errorMessage);
    },
  });

  // --- 5. Booking Mutation (Unchanged) ---
  const { mutate: createBooking, isPending: isBooking } = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return axios.post('/api/bookings', {
        slotId: slotId,
        quantity: quantity,
        price: total,
      });
    },
    onSuccess: (response) => {
      const { booking_ref } = response.data;
      queryClient.invalidateQueries({ queryKey: ['experience', experienceId] });
      queryClient.invalidateQueries({ queryKey: [EXPERIENCES_QUERY_KEY] });
      toast.success('Booking Confirmed!', {
        description: `Your reference is: ${booking_ref}`,
      });
      router.push(`/booking-result?status=success&ref=${booking_ref}`);
    },
    onError: (error) => {
      let errorMessage = 'Booking failed. Please try again.';
      if (error instanceof AxiosError && error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      toast.error('Booking Error', { description: errorMessage });
    },
  });

  // --- 6. Form Handlers (Unchanged) ---
  function onSubmit(values: z.infer<typeof formSchema>) {
    createBooking(values);
  }

  function onApplyPromo() {
    const code = form.getValues('promoCode');
    if (code) validatePromo(code);
    else toast.error('Please enter a promo code.');
  }

  function onRemovePromo() {
    setAppliedPromo(null);
    form.setValue('promoCode', '');
    toast.info('Promo code removed.');
  }

  // --- 7. JSX (Error boundary unchanged) ---
  if (!experienceId || !slotId) {
    return (
      <div className="container mx-auto flex h-[60vh] flex-col items-center justify-center px-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h2 className="mt-4 text-xl font-semibold text-red-600">
          Invalid Booking Request
        </h2>
        <p className="mt-2 text-gray-500">
          No experience or slot was selected.
        </p>
        <Button onClick={() => router.push('/')} className="mt-6">
          Back to Home
        </Button>
      </div>
    );
  }

  // --- JSX (Main Form - Unchanged) ---
  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Form */}
        <div>
          <h1 className="text-2xl font-bold mb-6">Confirm your details</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <div className="space-y-4">
                  <div className="space-y-2 rounded-lg bg-gray-100 p-4">
                    <p className="text-sm font-medium text-gray-600">
                      Booking as
                    </p>
                    <p className="text-base font-semibold text-black">
                      {user?.fullName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {user?.emailAddresses[0].emailAddress}
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="promoCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Promo code</FormLabel>
                        <div className="flex space-x-2">
                          <FormControl>
                            <Input
                              placeholder="SAVE10"
                              {...field}
                              className={
                                appliedPromo
                                  ? 'border-green-500 focus-visible:ring-green-500'
                                  : ''
                              }
                              disabled={!!appliedPromo}
                            />
                          </FormControl>
                          {!appliedPromo ? (
                            <Button
                              type="button"
                              variant="secondary"
                              className="shrink-0"
                              onClick={onApplyPromo}
                              disabled={isCheckingPromo}
                            >
                              {isCheckingPromo ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                'Apply'
                              )}
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="shrink-0"
                              onClick={onRemovePromo}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        {!appliedPromo && (
                          <FormDescription className="text-xs">
                            Available codes: SAVE10, FLAT100
                          </FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="terms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I agree to the terms and safety policy
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full bg-yellow-400 text-black font-semibold text-base hover:bg-yellow-500"
                disabled={isBooking}
              >
                {isBooking ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Lock className="mr-2 h-4 w-4" />
                )}
                Pay and Confirm
              </Button>
            </form>
          </Form>
        </div>

        {/* --- RIGHT: PRICE SUMMARY (Unchanged) --- */}
        <div className="mt-16">
          <div className="rounded-xl border bg-white p-6 shadow-md">
            <h2 className="text-lg font-semibold mb-4">Price Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Experience</span>
                <span className="font-medium text-right">{title}</span>
              </div>
              <ClientOnly>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium">
                    {new Date(date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time</span>
                  <span className="font-medium">
                    {new Date(startTime).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </span>
                </div>
              </ClientOnly>
              <div className="flex justify-between">
                <span className="text-gray-600">Guests</span>
                <span className="font-medium">
                  {`₹${price.toFixed(2)} x ${quantity}`}
                </span>
              </div>
              <div className="border-t my-2"></div>
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  <IndianRupee className="inline h-3.5 w-3.5 -mt-1" />
                  {subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taxes</span>
                <span className="font-medium">
                  <IndianRupee className="inline h-3.5 w-3.5 -mt-1" />
                  {taxes.toFixed(2)}
                </span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between text-green-600">
                  <span className="flex items-center">
                    <Ticket className="h-4 w-4 mr-1.5" />
                    Promo '{appliedPromo.code_text}'
                  </span>
                  <span className="font-medium">
                    - <IndianRupee className="inline h-3.5 w-3.5 -mt-1" />
                    {discount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="border-t my-2"></div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>
                  <IndianRupee className="inline h-4 w-4 -mt-1" />
                  {total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Suspense and Skeleton are unchanged
export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <CheckoutForm />
    </Suspense>
  );
}
function CheckoutSkeleton() {
  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <Skeleton className="h-10 w-28 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <Skeleton className="h-8 w-1/3 mb-6" />
          <Skeleton className="h-96 w-full" />
        </div>
        <div className="mt-16">
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, X, Shield, CheckCircle2, Loader2, Heart, Lock } from 'lucide-react';

// Stripe test publishable key — replace with your real key in production
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            fontSize: '18px',
            fontFamily: "'Fredoka', sans-serif",
            fontWeight: '600',
            color: '#008303',
            '::placeholder': {
                color: '#33ad33',
            },
            iconColor: '#008303',
        },
        invalid: {
            color: '#dc2626',
            iconColor: '#dc2626',
        },
    },
};

function CheckoutForm({ amount, driveName, onSuccess, onCancel }) {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [succeeded, setSucceeded] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setProcessing(true);
        setError(null);

        const cardElement = elements.getElement(CardElement);

        // Create a payment method using the card element
        const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (pmError) {
            setError(pmError.message);
            setProcessing(false);
            return;
        }

        // In production, you would send paymentMethod.id to your backend
        // to create a PaymentIntent and confirm the payment.
        // For this demo, we simulate a successful payment after a short delay.
        setTimeout(() => {
            setProcessing(false);
            setSucceeded(true);
            setTimeout(() => {
                onSuccess({
                    paymentMethodId: paymentMethod.id,
                    amount,
                    last4: paymentMethod.card.last4,
                    brand: paymentMethod.card.brand,
                });
            }, 2000);
        }, 2000);
    };

    if (succeeded) {
        return (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#008303] border-4 border-[#005202] shadow-[4px_4px_0px_#005202] flex items-center justify-center">
                    <CheckCircle2 size={40} className="text-white" />
                </div>
                <h3 className="text-3xl font-black text-[#008303] font-[var(--font-display)] mb-2">PAYMENT SUCCESSFUL!</h3>
                <p className="text-lg font-bold text-[#005202]">₹{amount.toLocaleString()} donated to {driveName}</p>
                <p className="text-sm text-[#005202]/70 mt-2">Thank you for your generosity 💚</p>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            {/* Amount display */}
            <div className="text-center mb-8">
                <div className="text-sm font-black text-[#005202] uppercase tracking-widest mb-2">DONATING TO</div>
                <div className="text-xl font-black text-[#008303] font-[var(--font-display)] mb-4 leading-tight">{driveName}</div>
                <div className="inline-block bg-[#008303] border-4 border-[#005202] shadow-[4px_4px_0px_#005202] rounded-2xl px-8 py-4">
                    <span className="text-4xl font-black text-white font-[var(--font-display)]">₹{amount.toLocaleString()}</span>
                </div>
            </div>

            {/* Card Element */}
            <div className="mb-6">
                <label className="block text-sm font-black text-[#005202] uppercase tracking-wider mb-3">
                    <CreditCard size={16} className="inline mr-2" />
                    CARD DETAILS
                </label>
                <div className="bg-white border-4 border-[#005202] shadow-[4px_4px_0px_#005202] rounded-xl p-5 transition-all focus-within:shadow-[6px_6px_0px_#005202] focus-within:-translate-x-1 focus-within:-translate-y-1">
                    <CardElement options={CARD_ELEMENT_OPTIONS} />
                </div>
                <p className="text-xs text-[#005202]/60 mt-2 flex items-center gap-1">
                    <Lock size={12} /> Secured by Stripe. Your card details never touch our servers.
                </p>
            </div>

            {/* Error */}
            {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-3 bg-red-50 border-2 border-red-300 rounded-xl text-red-600 text-sm font-bold">
                    ⚠️ {error}
                </motion.div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-4 bg-white border-4 border-[#005202] shadow-[4px_4px_0px_#005202] rounded-xl font-black text-[#008303] text-lg uppercase hover:-translate-y-1 hover:shadow-[6px_6px_0px_#005202] active:translate-y-1 active:shadow-none transition-all"
                >
                    CANCEL
                </button>
                <button
                    type="submit"
                    disabled={!stripe || processing}
                    className="flex-[2] py-4 bg-[#008303] border-4 border-[#005202] shadow-[4px_4px_0px_#005202] rounded-xl font-black text-white text-lg uppercase hover:-translate-y-1 hover:shadow-[6px_6px_0px_#005202] active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                    {processing ? (
                        <>
                            <Loader2 size={20} className="animate-spin" /> PROCESSING...
                        </>
                    ) : (
                        <>
                            <Heart size={20} /> PAY ₹{amount.toLocaleString()}
                        </>
                    )}
                </button>
            </div>

            {/* Trust badges */}
            <div className="mt-6 flex items-center justify-center gap-4 text-xs font-bold text-[#005202]/50 uppercase tracking-wider">
                <span className="flex items-center gap-1"><Shield size={12} /> SSL ENCRYPTED</span>
                <span>•</span>
                <span className="flex items-center gap-1"><CreditCard size={12} /> STRIPE SECURE</span>
                <span>•</span>
                <span>PCI COMPLIANT</span>
            </div>
        </form>
    );
}

export default function StripePaymentModal({ isOpen, onClose, amount, driveName, onPaymentSuccess }) {
    if (!isOpen) return null;

    const handleSuccess = (paymentData) => {
        onPaymentSuccess(paymentData);
        setTimeout(() => onClose(), 500);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25 }}
                        className="relative w-full max-w-lg bg-white border-4 border-[#005202] shadow-[8px_8px_0px_#005202] rounded-2xl overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-[#008303] border-b-4 border-[#005202] p-5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-xl border-2 border-[#005202] shadow-[2px_2px_0px_#005202] flex items-center justify-center">
                                    <CreditCard size={20} className="text-[#008303]" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-white font-[var(--font-display)] uppercase">STRIPE CHECKOUT</h2>
                                    <p className="text-xs font-bold text-white/80">SECURE PAYMENT</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                                <X size={18} className="text-white" />
                            </button>
                        </div>

                        {/* Body with Stripe Elements */}
                        <div className="p-8">
                            <Elements stripe={stripePromise}>
                                <CheckoutForm
                                    amount={amount}
                                    driveName={driveName}
                                    onSuccess={handleSuccess}
                                    onCancel={onClose}
                                />
                            </Elements>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

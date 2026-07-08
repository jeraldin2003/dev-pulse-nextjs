"use client";
import { useState } from 'react';
import {
    Send,
    Mail,
    User,
    MessageSquare,
    FileText,
    CheckCircle,
    ArrowLeft,
    AlertCircle,
    Activity,
    Sun,
    Moon,
} from 'lucide-react';
import Link from 'next/link';
import { useForm } from '@/hooks/useForm';
import { sendContactEmail } from './_api/sendContactEmail';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

const validate = (v) => {
    const e = {};
    if (!v.name.trim()) e.name = 'Name is required.';
    if (!v.email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = 'Invalid email.';
    if (!v.message.trim()) e.message = 'Message is required.';
    else if (v.message.trim().length < 20) e.message = 'Min 20 characters.';
    return e;
};

const cx = (err, isTA) =>
    `w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition focus:ring-2 ${isTA ? 'resize-none' : ''} ${err ? 'border-rose-400 bg-rose-50/40 focus:ring-rose-300' : 'border-slate-200 bg-white/70 focus:ring-blue-400/40'}`;

const FIELDS = [
    {
        id: 'name',
        label: 'Full Name',
        icon: User,
        type: 'text',
        autoComplete: 'name',
        placeholder: 'Jane Smith',
    },
    {
        id: 'email',
        label: 'Email',
        icon: Mail,
        type: 'email',
        autoComplete: 'email',
        placeholder: 'jane@example.com',
    },
    {
        id: 'subject',
        label: 'Subject (optional)',
        icon: FileText,
        type: 'text',
        placeholder: "What's this about?",
    },
    {
        id: 'message',
        label: 'Message',
        icon: MessageSquare,
        as: 'textarea',
        rows: 5,
        placeholder: 'Min 20 characters…',
    },
];

export default function ContactPage() {
    const { isAuthenticated } = useAuth();
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState('');
    const [doneEmail, setDoneEmail] = useState('');
    const { values, errors, touched, handleChange, handleBlur, handleSubmit, reset } = useForm(
        { name: '', email: '', subject: '', message: '' },
        validate
    );
    const { toggleTheme, theme } = useTheme();
    const onSubmit = async (data) => {
        setSubmitting(true);
        setServerError('');
        try {
            await sendContactEmail(data);
            setDoneEmail(data.email);
            reset();
        } catch (e) {
            setServerError(e.message || 'Something went wrong.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6 py-12">
            <div className="w-full max-w-lg">
                <button
                    type="button"
                    onClick={toggleTheme}
                    className="absolute top-4 right-4 z-50 p-2 rounded-xl bg-white/80 backdrop-blur-md border border-slate-200/80 text-slate-600 hover:bg-slate-100 transition-all duration-150 cursor-pointer shadow-sm"
                    title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
                    aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
                >
                    {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                </button>
                {/* Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-4">
                        <Activity size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Contact Us</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Have a question? We'd love to hear from you.
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/40 rounded-3xl p-8 shadow-xl dark:shadow-black/20">
                    {doneEmail ? (
                        <div className="flex flex-col items-center text-center gap-4 py-6">
                            <CheckCircle size={48} className="text-emerald-500" strokeWidth={1.5} />
                            <p className="text-slate-600 text-sm">
                                Confirmation sent to <strong>{doneEmail}</strong>.
                            </p>
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl"
                            >
                                <ArrowLeft size={14} /> Back to Dashboard
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
                            {serverError && (
                                <div
                                    role="alert"
                                    className="flex gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 text-rose-700 dark:text-rose-400 text-sm"
                                >
                                    <AlertCircle size={16} className="shrink-0 mt-0.5" /> {serverError}
                                </div>
                            )}

                            {FIELDS.map(({ id, label, icon: Icon, as: Tag = 'input', ...rest }) => {
                                const hasErr = errors[id] && touched[id];
                                return (
                                    <div key={id} className="flex flex-col gap-1">
                                        <label
                                            htmlFor={id}
                                            className="flex items-center gap-1.5 text-sm font-semibold text-slate-700"
                                        >
                                            <Icon size={13} className="text-slate-400" /> {label}
                                        </label>
                                        <Tag
                                            id={id}
                                            name={id}
                                            value={values[id]}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            aria-invalid={!!hasErr}
                                            className={cx(hasErr, Tag === 'textarea')}
                                            {...rest}
                                        />
                                        {hasErr && (
                                            <span role="alert" className="text-xs text-rose-600">
                                                {errors[id]}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold text-sm rounded-xl transition"
                            >
                                {submitting ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{' '}
                                        Sending…
                                    </>
                                ) : (
                                    <>
                                        <Send size={14} /> Send Message
                                    </>
                                )}
                            </button>

                            <p className="text-center text-xs text-slate-400">
                                {isAuthenticated ? `` : `Already have an account?`}{' '}
                                <Link href="/dashboard" className="text-blue-600 hover:underline font-medium">
                                    {isAuthenticated ? `Back to Dashboard` : `Sign in`}
                                </Link>
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

"use client";
import { useState, useTransition } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { createSignup } from "@/app/lib/actions/signup";

interface SignUpProps {
    onSuccess?: () => void;
}

export default function SignUp({ onSuccess }: SignUpProps) {
    const [step, setStep] = useState(0);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [success, setSuccess] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const services = [
        "🎉 Boutique Party Supplies",
        "🚐 Flexible Event Rentals",
        "🌟 Customizable Event Spaces",
        "🎨 Creative Event Styling",
        "📋 Full-Service Event Planning"
    ];

    const handleNext = () => {
        if (step === 0 && !email) {
            setError("Email is required");
            return;
        }
        setError(null);
        setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 0) setStep(step - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        startTransition(async () => {
            const result = await createSignup({ email, name, phone });
            if (result.success) {
                setSuccess(true);
                onSuccess?.();
            } else {
                setError(result.error || "Failed to sign up");
            }
        });
    };

    if (success) {
        return (
            <div className="text-green-500 text-center font-semibold mt-4">
                Thank you for signing up!
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <h1 className="text-3xl font-bold text-center mb-6" style={{ color: "#e0c97f" }}>
                COMING SOON
            </h1>
            <div className="flex flex-col items-center justify-center w-full h-screen max-h-screen p-4 overflow-hidden">
                <div className="w-full max-w-md">
                    <div className="mb-4 flex justify-center">
                        <Image
                            src="/images/logo/chameleonLogo.PNG"
                            alt="Chameleon Collective Logo"
                            width={300}
                            height={150}
                            className="object-contain"
                        />
                    </div>

                    <div
                        className="w-full rounded-2xl p-6"
                        style={{
                            background: "rgba(20,20,20,0.95)",
                            border: "2px solid #e0c97f",
                            boxShadow: "0 4px 32px 0 rgba(0,0,0,0.25)",
                        }}
                    >
                        {/* Services List */}
                        <div className="mb-4">
                            <h2 className="text-xl font-bold text-center mb-2" style={{ color: "#e0c97f" }}>
                                Our Services
                            </h2>
                            <ul className="space-y-1 text-center">
                                {services.map((service, index) => (
                                    <li
                                        key={index}
                                        className="text-white text-sm flex justify-center items-center"
                                    >
                                        <span>{service}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3">
                            {step === 0 && (
                                <div>
                                    <label
                                        className="block mb-2 font-bold text-center"
                                        style={{ color: "#e0c97f", fontSize: "1.25rem" }}
                                    >
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                        placeholder="Enter your email"
                                        className="w-full text-white placeholder:text-gray-400 bg-black border border-[#e0c97f]"
                                    />
                                </div>
                            )}

                            {step === 1 && (
                                <div>
                                    <label className="block mb-2 font-medium text-white text-lg text-center">Name</label>
                                    <Input
                                        type="text"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        placeholder="Enter your name (optional)"
                                        className="w-full text-white placeholder:text-gray-400 bg-black border border-[#e0c97f]"
                                    />
                                </div>
                            )}

                            {step === 2 && (
                                <div>
                                    <label className="block mb-2 font-medium text-white text-lg text-center">Phone</label>
                                    <Input
                                        type="tel"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        placeholder="Enter your phone (optional)"
                                        className="w-full text-white placeholder:text-gray-400 bg-black border border-[#e0c97f]"
                                    />
                                </div>
                            )}

                            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                            <div className="flex justify-center space-x-4 mt-4">
                                {step > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600 border border-[#e0c97f]"
                                    >
                                        Back
                                    </button>
                                )}
                                {step < 2 && (
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="px-4 py-2 rounded bg-[#e0c97f] text-black font-bold hover:bg-[#cbb76a]"
                                    >
                                        Next
                                    </button>
                                )}
                                {step === 2 && (
                                    <button
                                        type="submit"
                                        className="px-4 py-2 rounded bg-[#e0c97f] text-black font-bold hover:bg-[#cbb76a]"
                                        disabled={isPending}
                                    >
                                        {isPending ? "Submitting..." : "Submit"}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

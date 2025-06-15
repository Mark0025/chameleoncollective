'use client';

import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { updateBrandConfigInDB } from '@/app/lib/brand/service';
import type { BrandConfigDB } from '@/app/lib/brand/service';

export default function AdminSettingsClient({ config: initialConfig, isAdmin }: { config: BrandConfigDB, isAdmin: boolean }) {
    const [config, setConfig] = useState<BrandConfigDB>(initialConfig);
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (field: keyof BrandConfigDB, value: string) => {
        setConfig(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateBrandConfigInDB(config);
            toast({ title: 'Settings saved', description: 'Your brand config has been updated.' });
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to save settings.', variant: 'destructive' });
        } finally {
            setIsSaving(false);
        }
    };

    if (!config) return <div>Loading...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Business Settings</h1>
                {isAdmin && (
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                )}
            </div>
            <div className="space-y-6">
                {/* Brand Information */}
                <section className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Brand Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Business Name</label>
                            <input type="text" value={config.name} onChange={e => handleChange('name', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" readOnly={!isAdmin} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Slogan</label>
                            <input type="text" value={config.slogan} onChange={e => handleChange('slogan', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" readOnly={!isAdmin} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone (Primary)</label>
                            <input type="text" value={config.phone_primary} onChange={e => handleChange('phone_primary', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" readOnly={!isAdmin} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone (Secondary)</label>
                            <input type="text" value={config.phone_secondary} onChange={e => handleChange('phone_secondary', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" readOnly={!isAdmin} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="text" value={config.email} onChange={e => handleChange('email', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" readOnly={!isAdmin} />
                        </div>
                    </div>
                </section>
                {/* Address */}
                <section className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Address</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Street</label>
                            <input type="text" value={config.address_street} onChange={e => handleChange('address_street', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" readOnly={!isAdmin} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">City</label>
                            <input type="text" value={config.address_city} onChange={e => handleChange('address_city', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" readOnly={!isAdmin} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">State</label>
                            <input type="text" value={config.address_state} onChange={e => handleChange('address_state', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" readOnly={!isAdmin} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Zip</label>
                            <input type="text" value={config.address_zip} onChange={e => handleChange('address_zip', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" readOnly={!isAdmin} />
                        </div>
                    </div>
                </section>
                {/* Hours */}
                <section className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Business Hours</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Weekday</label>
                            <input type="text" value={config.hours_weekday} onChange={e => handleChange('hours_weekday', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" readOnly={!isAdmin} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Saturday</label>
                            <input type="text" value={config.hours_saturday} onChange={e => handleChange('hours_saturday', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" readOnly={!isAdmin} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Sunday</label>
                            <input type="text" value={config.hours_sunday} onChange={e => handleChange('hours_sunday', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" readOnly={!isAdmin} />
                        </div>
                    </div>
                </section>
                {/* Colors */}
                <section className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Brand Colors</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Primary</label>
                            <input type="color" value={config.color_primary} onChange={e => handleChange('color_primary', e.target.value)} className="mt-1 block w-16 h-10 rounded" disabled={!isAdmin} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Secondary</label>
                            <input type="color" value={config.color_secondary} onChange={e => handleChange('color_secondary', e.target.value)} className="mt-1 block w-16 h-10 rounded" disabled={!isAdmin} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Accent</label>
                            <input type="color" value={config.color_accent} onChange={e => handleChange('color_accent', e.target.value)} className="mt-1 block w-16 h-10 rounded" disabled={!isAdmin} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Text</label>
                            <input type="color" value={config.color_text} onChange={e => handleChange('color_text', e.target.value)} className="mt-1 block w-16 h-10 rounded" disabled={!isAdmin} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Background</label>
                            <input type="color" value={config.color_background} onChange={e => handleChange('color_background', e.target.value)} className="mt-1 block w-16 h-10 rounded" disabled={!isAdmin} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Muted</label>
                            <input type="color" value={config.color_muted} onChange={e => handleChange('color_muted', e.target.value)} className="mt-1 block w-16 h-10 rounded" disabled={!isAdmin} />
                        </div>
                    </div>
                </section>
                {/* Socials */}
                <section className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Social Links</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Facebook</label>
                            <input type="text" value={config.social_facebook} onChange={e => handleChange('social_facebook', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" readOnly={!isAdmin} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Instagram</label>
                            <input type="text" value={config.social_instagram} onChange={e => handleChange('social_instagram', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" readOnly={!isAdmin} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Twitter</label>
                            <input type="text" value={config.social_twitter} onChange={e => handleChange('social_twitter', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" readOnly={!isAdmin} />
                        </div>
                    </div>
                </section>
                <div className="text-sm text-gray-500">
                    <p>Note: Only system administrators can edit business details.</p>
                </div>
            </div>
        </div>
    );
} 
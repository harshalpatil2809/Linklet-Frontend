'use client';

import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type ChangeEvent,
} from 'react';
import {
    ArrowLeft,
    Camera,
    Edit2,
    Loader2,
    Save,
    UserRound,
    X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import API from '@/lib/axios';
import { toast } from 'sonner';

interface UserProfile {
    id?: number;
    username: string;
    full_name?: string | null;
    bio?: string | null;
    avatar?: string | null;
}

interface ProfileFormData {
    full_name: string;
    bio: string;
}

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

const BACKEND_URL = (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://linklet-backend-efe3.onrender.com"
).replace(/\/+$/, "");

const getFullImageUrl = (
    path?: string | null
): string | null => {
    if (!path?.trim()) return null;

    const imagePath = path.trim();

    // Cloudinary or another absolute URL
    if (/^https?:\/\//i.test(imagePath)) {
        return imagePath;
    }

    // Protocol-relative URL
    if (imagePath.startsWith("//")) {
        return `https:${imagePath}`;
    }

    // Legacy relative media path
    return `${BACKEND_URL}/${imagePath.replace(/^\/+/, "")}`;
};


export default function MyProfileView() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [formData, setFormData] = useState<ProfileFormData>({
        full_name: '',
        bio: '',
    });

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [avatarFailed, setAvatarFailed] = useState(false);

    const fetchMyData = useCallback(async () => {
        setLoading(true);

        try {
            const response = await API.get<UserProfile>(
                '/api/profiles/me/'
            );

            const data = response.data;

            setProfile(data);
            console.log(data)
            setFormData({
                full_name: data.full_name ?? '',
                bio: data.bio ?? '',
            });
            setPreviewUrl(getFullImageUrl(data.avatar));
            setSelectedFile(null);
            setAvatarFailed(false);
        } catch (error) {
            console.error('Failed to load profile:', error);
            toast.error('Unable to load your profile.');
        } finally {
            setLoading(false);
        }
    }, []);

    

    useEffect(() => {
        let active = true;

        const loadProfile = async () => {
            try {
                const response = await API.get<UserProfile>(
                    '/api/profiles/me/'
                );

                if (!active) return;

                const data = response.data;

                setProfile(data);
                setFormData({
                    full_name: data.full_name ?? '',
                    bio: data.bio ?? '',
                });
                setPreviewUrl(getFullImageUrl(data.avatar));
            } catch (error) {
                if (active) {
                    console.error('Failed to load profile:', error);
                    toast.error('Unable to load your profile.');
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        void loadProfile();

        return () => {
            active = false;
        };
    }, []);

    // Release temporary avatar preview URLs.
    useEffect(() => {
        return () => {
            if (previewUrl?.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleFileChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        // Allow selecting the same file again later.
        event.target.value = '';

        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file.');
            return;
        }

        if (file.size > MAX_AVATAR_SIZE) {
            toast.error('Image size must be 5 MB or less.');
            return;
        }

        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setAvatarFailed(false);
    };

    const handleCancel = () => {
        if (!profile) return;

        setFormData({
            full_name: profile.full_name ?? '',
            bio: profile.bio ?? '',
        });

        setSelectedFile(null);
        setPreviewUrl(getFullImageUrl(profile.avatar));
        setAvatarFailed(false);
        setIsEditing(false);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUpdate = async () => {
        if (!profile || saving) return;

        if (formData.full_name.length > 150) {
            toast.error('Display name must be 150 characters or fewer.');
            return;
        }

        if (formData.bio.length > 500) {
            toast.error('Bio must be 500 characters or fewer.');
            return;
        }

        setSaving(true);



        const data = new FormData();
        data.append('full_name', formData.full_name.trim());
        data.append('bio', formData.bio.trim());

        if (selectedFile) {
            data.append('avatar', selectedFile);
        }

        try {
            const response = await API.patch<UserProfile>(
                '/api/profiles/me/',
                data
            );

            const updatedProfile = response.data;

            setProfile(updatedProfile);
            setFormData({
                full_name: updatedProfile.full_name ?? '',
                bio: updatedProfile.bio ?? '',
            });
            setPreviewUrl(getFullImageUrl(updatedProfile.avatar));
            setSelectedFile(null);
            setAvatarFailed(false);
            setIsEditing(false);

            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Profile update failed:', error);

            const apiError = error as {
                response?: {
                    data?: Record<string, unknown>;
                };
            };

            const errorData = apiError.response?.data;
            const firstError = errorData
                ? Object.values(errorData).flat()[0]
                : null;

            toast.error(
                typeof firstError === 'string'
                    ? firstError
                    : 'Unable to update your profile. Please try again.'
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <Loader2
                    size={28}
                    className="animate-spin text-(--color-primary)"
                />
                <span className="sr-only">Loading profile...</span>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
                <UserRound
                    size={40}
                    className="text-(--color-text-subtle)"
                />

                <h2 className="text-xl font-semibold text-(--color-text)">
                    Profile unavailable
                </h2>

                <p className="text-sm text-(--color-text-muted)">
                    We couldn&apos;t load your profile.
                </p>

                <button
                    type="button"
                    onClick={() => void fetchMyData()}
                    className="rounded-xl bg-(--color-primary) px-5 py-3 text-sm font-semibold text-(--color-primary-text) transition-colors hover:bg-(--color-primary-hover)"
                >
                    Try again
                </button>
            </div>
        );
    }

    const displayName = profile.full_name?.trim() || profile.username;

    return (
        <main className="flex flex-1 items-center justify-center overflow-y-auto p-4 sm:p-8">
            <section className="w-full max-w-2xl overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-(--shadow-card)">
                {/* Header */}
                <header className="flex items-center justify-between border-b border-(--color-border) px-5 py-4 sm:px-8">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        aria-label="Go back"
                        className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-(--color-text-muted) transition-colors hover:bg-(--color-surface-hover) hover:text-(--color-text)"
                    >
                        <ArrowLeft size={18} />
                        <span>Back</span>
                    </button>

                    <span className="text-sm font-medium text-(--color-text-muted)">
                        My Profile
                    </span>
                </header>

                <div className="p-5 sm:p-8 md:p-10">
                    {/* Avatar and identity */}
                    <div className="flex flex-col items-center text-center">
                        <div className="group relative mb-5">
                            <div className="flex size-28 items-center justify-center overflow-hidden rounded-full border border-(--color-border) bg-(--color-input-bg) sm:size-32">
                                {previewUrl && !avatarFailed ? (
                                    <img
                                        key={previewUrl}
                                        src={previewUrl}
                                        alt={`${displayName}'s avatar`}
                                        className="size-full object-cover"
                                        onError={() => setAvatarFailed(true)}
                                    />
                                ) : (
                                    <span className="text-4xl font-semibold text-(--color-primary)">
                                        {profile.username
                                            ?.charAt(0)
                                            .toUpperCase() || (
                                                <UserRound size={42} />
                                            )}
                                    </span>
                                )}
                            </div>

                            {isEditing && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                        aria-label="Change profile photo"
                                        className="absolute bottom-1 right-1 flex size-10 items-center justify-center rounded-full border border-(--color-border) bg-(--color-primary) text-(--color-primary-text) shadow-md transition-transform hover:scale-105"
                                    >
                                        <Camera size={18} />
                                    </button>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        aria-label="Choose profile photo"
                                    />
                                </>
                            )}
                        </div>

                        <h1 className="wrap-break-word text-2xl font-semibold tracking-tight text-(--color-text) sm:text-3xl">
                            {displayName}
                        </h1>

                        <p className="mt-1 text-sm text-(--color-text-muted)">
                            @{profile.username}
                        </p>

                        {isEditing && (
                            <p className="mt-3 text-xs text-(--color-text-subtle)">
                                JPG, PNG, WebP or another supported image · Max 5 MB
                            </p>
                        )}
                    </div>

                    {/* Profile content */}
                    <div className="mt-8 border-t border-(--color-border) pt-7">
                        {isEditing ? (
                            <div className="space-y-5">
                                <div>
                                    <label
                                        htmlFor="full-name"
                                        className="mb-2 block text-sm font-medium text-(--color-text)"
                                    >
                                        Display name
                                    </label>

                                    <input
                                        id="full-name"
                                        type="text"
                                        maxLength={150}
                                        value={formData.full_name}
                                        onChange={(event) =>
                                            setFormData((previous) => ({
                                                ...previous,
                                                full_name: event.target.value,
                                            }))
                                        }
                                        placeholder="Enter your display name"
                                        className="w-full rounded-xl border border-(--color-border) bg-(--color-input-bg) px-4 py-3 text-sm text-(--color-text) outline-none transition-colors placeholder:text-(--color-text-subtle) focus:border-(--color-border-focus)"
                                    />

                                    <p className="mt-1.5 text-right text-xs text-(--color-text-subtle)">
                                        {formData.full_name.length}/150
                                    </p>
                                </div>

                                <div>
                                    <label
                                        htmlFor="bio"
                                        className="mb-2 block text-sm font-medium text-(--color-text)"
                                    >
                                        About you
                                    </label>

                                    <textarea
                                        id="bio"
                                        rows={4}
                                        maxLength={500}
                                        value={formData.bio}
                                        onChange={(event) =>
                                            setFormData((previous) => ({
                                                ...previous,
                                                bio: event.target.value,
                                            }))
                                        }
                                        placeholder="Write a short introduction..."
                                        className="w-full resize-y rounded-xl border border-(--color-border) bg-(--color-input-bg) px-4 py-3 text-sm leading-relaxed text-(--color-text) outline-none transition-colors placeholder:text-(--color-text-subtle) focus:border-(--color-border-focus)"
                                    />

                                    <p className="mt-1.5 text-right text-xs text-(--color-text-subtle)">
                                        {formData.bio.length}/500
                                    </p>
                                </div>

                                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        disabled={saving}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-(--color-border) px-4 py-3 text-sm font-medium text-(--color-text-muted) transition-colors hover:bg-(--color-surface-hover) hover:text-(--color-text) disabled:opacity-50"
                                    >
                                        <X size={17} />
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => void handleUpdate()}
                                        disabled={saving}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-(--color-primary) px-4 py-3 text-sm font-semibold text-(--color-primary-text) transition-colors hover:bg-(--color-primary-hover) disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {saving ? (
                                            <Loader2
                                                size={17}
                                                className="animate-spin"
                                            />
                                        ) : (
                                            <Save size={17} />
                                        )}

                                        {saving
                                            ? 'Saving changes...'
                                            : 'Save changes'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="mb-6">
                                    <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-(--color-text-subtle)">
                                        About
                                    </h2>

                                    <p className="whitespace-pre-wrap wrap-break-word text-sm leading-7 text-(--color-text-muted)">
                                        {profile.bio?.trim() ||
                                            'No introduction added yet.'}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-4 rounded-xl border border-(--color-border) bg-(--color-input-bg) p-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-(--color-text)">
                                            Profile details
                                        </p>
                                        <p className="mt-1 text-xs text-(--color-text-muted)">
                                            Keep your information up to date.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(true)}
                                        className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-(--color-primary) px-5 py-3 text-sm font-semibold text-(--color-primary-text) transition-colors hover:bg-(--color-primary-hover)"
                                    >
                                        <Edit2 size={16} />
                                        Edit profile
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}


'use client';

import { useEffect, useState } from 'react';
import { UserPlus, UserMinus, Loader2, UserRound } from 'lucide-react';
import API from '@/lib/axios';
import { toast } from 'sonner';

interface ProfileUser {
    name?: string | null;
    avatar?: string | null;
}

interface TargetProfileResponse {
    is_following?: boolean;
    bio?: string | null;
}

interface FollowResponse {
    following?: boolean;
    is_following?: boolean;
    message?: string;
}

interface UserProfileViewProps {
    user?: ProfileUser | null;
}

export default function UserProfileView({
    user,
}: UserProfileViewProps) {
    const username = user?.name?.trim() ?? '';
    const avatar = user?.avatar?.trim() ?? '';

    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [bio, setBio] = useState("");

    useEffect(() => {
        let isActive = true;

        const fetchFollowStatus = async () => {
            if (!username) {
                setIsFollowing(false);
                setFetching(false);
                return;
            }

            setFetching(true);

            try {
                const response = await API.get<TargetProfileResponse>(
                    `/api/profiles/target/${encodeURIComponent(username)}/`
                );

                console.log(response)
                setBio(response.data.bio ?? "");
                if (isActive) {
                    setIsFollowing(
                        response.data.is_following ?? false
                    );
                }
            } catch (error) {
                if (isActive) {
                    console.error(
                        'Failed to fetch target profile:',
                        error
                    );
                    toast.error('Unable to load follow status.');
                }
            } finally {
                if (isActive) {
                    setFetching(false);
                }
            }
        };

        void fetchFollowStatus();

        return () => {
            isActive = false;
        };
    }, [username]);

    const handleFollowAction = async () => {
        if (loading || !username) return;

        setLoading(true);

        try {
            const response = await API.post<FollowResponse>(
                `/api/follows/toggle/${encodeURIComponent(username)}/`
            );

            const newStatus =
                response.data.following ??
                response.data.is_following ??
                !isFollowing;


            setIsFollowing(newStatus);

            toast.success(
                response.data.message ||
                (newStatus
                    ? 'You are now following this user.'
                    : 'You unfollowed this user.')
            );
        } catch (error) {
            console.error('Follow action failed:', error);
            toast.error('Unable to update follow status. Try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!username) {
        return (
            <div className="flex flex-1 items-center justify-center p-6">
                <div className="text-center">
                    <UserRound
                        size={36}
                        className="mx-auto mb-3 text-(--color-text-subtle)"
                    />
                    <h2 className="text-lg font-semibold text-(--color-text)">
                        No profile selected
                    </h2>
                    <p className="mt-1 text-sm text-(--color-text-muted)">
                        Select a user to view their profile.
                    </p>
                </div>
            </div>
        );
    }

    if (fetching) {
        return (
            <div
                className="flex flex-1 items-center justify-center"
                role="status"
                aria-label="Loading profile"
            >
                <Loader2
                    size={28}
                    className="animate-spin text-(--color-primary)"
                />
            </div>
        );
    }

    return (
        <main className="flex flex-1 items-center justify-center overflow-y-auto p-4 sm:p-8">
            <section className="w-full max-w-md rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 shadow-lg sm:p-8">
                {/* Profile heading */}
                <div className="flex flex-col items-center text-center">
                    <div className="mb-5 flex size-24 items-center justify-center overflow-hidden rounded-full border border-(--color-border) bg-(--color-input-bg)">
                        {avatar ? (
                            <img
                                src={avatar}
                                alt={`${username}'s avatar`}
                                className="size-full object-cover"
                                onError={(event) => {
                                    event.currentTarget.style.display = 'none';
                                }}
                            />
                        ) : (
                            <span
                                className="text-3xl font-semibold text-(--color-primary)"
                                aria-hidden="true"
                            >
                                {username.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>

                    <h1 className="break-all text-2xl font-semibold tracking-tight text-(--color-text)">
                        {username}
                    </h1>

                    <p className="mt-1 text-sm text-(--color-text-muted)">
                        @{username}
                    </p>

                    <p className="mt-2 text-md text-(--color-text-muted)">
                        {bio}
                    </p>
                </div>

                {/* Follow action */}
                <div className="mt-7">
                    <button
                        type="button"
                        onClick={handleFollowAction}
                        disabled={loading}
                        aria-busy={loading}
                        className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${isFollowing
                            ? 'border border-(--color-border) bg-(--color-input-bg) text-(--color-text) hover:bg-(--color-surface-hover)'
                            : 'bg-(--color-primary) text-(--color-primary-text) hover:bg-(--color-primary-hover)'
                            }`}
                    >
                        {loading ? (
                            <Loader2
                                size={17}
                                className="animate-spin"
                            />
                        ) : isFollowing ? (
                            <UserMinus size={17} />
                        ) : (
                            <UserPlus size={17} />
                        )}

                        {loading
                            ? 'Updating...'
                            : isFollowing
                                ? 'Following'
                                : 'Follow'}
                    </button>
                </div>

                {/* Profile details */}
                <div className="mt-7 border-t border-(--color-border) pt-5">
                    <div className="flex items-center justify-between gap-4 py-2">
                        <span className="text-sm text-(--color-text-muted)">
                            Account
                        </span>

                        <span className="text-sm font-medium text-(--color-text)">
                            Linklet member
                        </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 py-2">
                        <span className="text-sm text-(--color-text-muted)">
                            Username
                        </span>

                        <span className="max-w-[60%] truncate text-sm font-medium text-(--color-text)">
                            @{username}
                        </span>
                    </div>
                </div>
            </section>
        </main>
    );
}

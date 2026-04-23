'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Edit2, Save, X, Camera, Loader2 } from 'lucide-react'
import API from '@/lib/axios'
import { toast } from 'sonner'

const MyProfileView = () => {
    const [profile, setProfile] = useState<any>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    // Form States
    const [formData, setFormData] = useState({ full_name: '', bio: '' })
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)


     const fetchMyData = async () => {
        try {
            const res = await API.get('/api/profiles/me/')
            const data = res.data
            setProfile(data)
            console.log(data)
            // Backend se data sync karein
            setFormData({
                full_name: data.full_name || '',
                bio: data.bio || ''
            })
            setPreviewUrl(data.avatar)
        } catch {
            toast.error("Profile load nahi hui")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMyData()
    }, [])

   

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            setPreviewUrl(URL.createObjectURL(file)) // Local preview
        }
    }

    const handleUpdate = async () => {
        setSaving(true)
        const data = new FormData()

        // Ensure karein ki fields undefined na bheji jayein
        data.append('full_name', formData.full_name || '')
        data.append('bio', formData.bio || '')

        if (selectedFile) {
            data.append('avatar', selectedFile)
        }

        try {
            const res = await API.patch('/api/profiles/me/', data)

            // Response data ko states mein set karein (Isse undefined fix ho jayega)
            const updatedData = res.data
            setProfile(updatedData)
            setFormData({
                full_name: updatedData.full_name || '',
                bio: updatedData.bio || ''
            })
            setPreviewUrl(updatedData.avatar)
            setSelectedFile(null) // Reset file selection
            setIsEditing(false)
            toast.success("Profile updated successfully!")
        } catch (err: any) {
            console.error("Update error details:", err.response?.data)
            toast.error("Update failed. Please check field constraints.")
        } finally {
            setSaving(false)
        }
    }

    if (loading) return (
        <div className='flex-1 flex items-center justify-center'>
            <Loader2 className='animate-spin text-[#BA9EFF]' size={32} />
        </div>
    )

    const getFullImageUrl = (path: string | null) => {
        if (!path) return null;

        if (path.startsWith('http')) return path;
        const backendUrl = "http://127.0.0.1:8000"; 
        return `${backendUrl}${path}`;
    };

    return (
        <div className='flex-1 flex flex-col items-center justify-center p-4 md:p-10 animate-in fade-in duration-500'>
            <div className='w-full max-w-2xl bg-[#131116] border border-white/5 rounded-[3.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl'>

                {/* Header Glow */}
                <div className='absolute top-0 left-0 w-full h-32 bg-linear-to-b from-[#BA9EFF]/10 to-transparent'></div>

                <div className='relative flex flex-col items-center'>
                    {/* Avatar Section */}
                    <div className='relative group mb-8'>
                        <div className='w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#1A161F] border-4 border-[#BA9EFF]/20 overflow-hidden flex items-center justify-center shadow-inner'>
                            {previewUrl ? (
                                <img
                                    src={previewUrl || getFullImageUrl(profile?.avatar) || "https://ui-avatars.com/api/?name=User"}
                                    alt="Avatar"
                                    className='w-full h-full object-cover'
                                    onError={(e: any) => e.target.src = "https://ui-avatars.com/api/?name=" + profile?.username}
                                />
                            ) : (
                                <span className='text-5xl font-black text-[#BA9EFF]'>{profile?.username?.[0].toUpperCase()}</span>
                            )}
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className='hidden'
                            accept="image/*"
                        />

                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className='absolute bottom-2 right-2 p-3 bg-[#BA9EFF] text-black rounded-full shadow-xl hover:scale-110 transition-all active:scale-90'
                        >
                            <Camera size={20} />
                        </button>
                    </div>

                    {isEditing ? (
                        <div className='w-full space-y-4'>
                            <div className='space-y-1'>
                                <label className='text-[10px] uppercase font-bold text-white/30 ml-2 tracking-widest'>Display Name</label>
                                <input
                                    className='w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-[#BA9EFF]/40 text-white placeholder:text-white/10'
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div className='space-y-1'>
                                <label className='text-[10px] uppercase font-bold text-white/30 ml-2 tracking-widest'>Bio</label>
                                <textarea
                                    className='w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-[#BA9EFF]/40 min-h-30 text-white placeholder:text-white/10'
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    placeholder="Tell us about yourself..."
                                />
                            </div>

                            <div className='flex gap-3 pt-2'>
                                <button onClick={handleUpdate} disabled={saving} className='flex-1 bg-[#BA9EFF] text-black py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#a686ff] transition-all disabled:opacity-50'>
                                    {saving ? <Loader2 className='animate-spin' size={20} /> : <><Save size={20} /> Save Changes</>}
                                </button>
                                <button onClick={() => { setIsEditing(false); fetchMyData(); }} className='px-6 bg-white/5 text-white/40 rounded-2xl hover:text-white transition-colors border border-white/5'><X /></button>
                            </div>
                        </div>
                    ) : (
                        <div className='text-center w-full'>
                            <h2 className='text-4xl font-black text-white mb-2 tracking-tight'>
                                {profile?.full_name || profile?.username}
                            </h2>
                            <p className='text-[#BA9EFF] font-bold uppercase tracking-widest text-xs mb-6'>@{profile?.username}</p>

                            <div className='bg-white/5 border border-white/10 p-6 rounded-[2.5rem] mb-8 min-h-[100px] flex items-center justify-center'>
                                <p className='text-white/60 leading-relaxed italic'>
                                    {profile?.bio || "No bio added yet. Click edit to introduce yourself!"}
                                </p>
                            </div>

                            <button
                                onClick={() => setIsEditing(true)}
                                className='flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform shadow-lg'
                            >
                                <Edit2 size={18} /> Edit Profile
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MyProfileView
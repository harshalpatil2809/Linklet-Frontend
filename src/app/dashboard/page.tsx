'use client'
import { Toaster } from "@/components/ui/sonner"
import Sidebar from '@/components/Sidebar/Sidebar'
import Chat from '@/components/Chat/Chat'

const DashboardPage = () => {

  return (
    <div className='bg-[#0F0D11] h-screen w-full text-white flex overflow-hidden font-sans'>
      <Toaster position="top-right" richColors />

      <div className='w-[20%] min-w-[320px] border-r border-white/5'>
        <Sidebar />
      </div>

      <div className='w-[80%] flex flex-col'>
        <Chat />
      </div>
    </div>
  )
}

export default DashboardPage
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { 
  LogOut, 
  Mail, 
  ShieldCheck, 
  Calendar, 
  User as UserIcon, 
  Clock, 
  IdCard 
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // 1. LocalStorage-dan ma'lumotni o'qish
    const savedData = localStorage.getItem("user");
    if (savedData) {
      setUser(JSON.parse(savedData));
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
    router.refresh();
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f1f1f1] p-4 md:p-10 font-mono text-black">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* NAV BAR */}
        <header className="bg-white border-[4px] border-black p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex justify-between items-center">
          <h1 className="text-xl font-black uppercase italic tracking-tighter">
            CRM<span className="text-blue-600">.</span>SYSTEM
          </h1>
          <button 
            onClick={handleLogout}
            className="bg-red-500 text-white border-[3px] border-black px-4 py-2 font-black uppercase text-[10px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            <LogOut size={16} className="inline mr-1" /> Chiqish
          </button>
        </header>

        {/* ASOSIY PROFIL KARTASI */}
        <div className="bg-white border-[4px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          
          {/* Yuqori qism: Rasm va Ism */}
          <div className="bg-yellow-400 border-b-[4px] border-black p-6 md:p-10 flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              {/* Cloudinary-dan kelgan rasm */}
              {user.image ? (
                <img 
                  src={user.image} 
                  alt="Profile" 
                  className="w-32 h-32 object-cover border-[4px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white"
                />
              ) : (
                <div className="w-32 h-32 bg-white border-[4px] border-black flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <UserIcon size={48} />
                </div>
              )}
              {/* Status burchakda */}
              <div className="absolute -bottom-2 -right-2 bg-green-500 text-white border-2 border-black px-2 py-1 text-[10px] font-black uppercase italic">
                {user.status}
              </div>
            </div>

            <div className="text-center md:text-left space-y-2">
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                {user.first_name} <br /> {user.last_name}
              </h2>
              <div className="inline-block bg-black text-white px-4 py-1 font-black uppercase text-xs italic tracking-widest">
                {user.role}
              </div>
            </div>
          </div>

          {/* Ma'lumotlar paneli */}
          <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Email */}
            <div className="border-[3px] border-black p-4 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4">
              <div className="bg-blue-500 p-2 border-2 border-black text-white"><Mail size={20}/></div>
              <div className="overflow-hidden">
                <p className="text-[9px] font-black text-slate-400 uppercase">Elektron pochta</p>
                <p className="font-bold truncate">{user.email}</p>
              </div>
            </div>

            {/* Ish boshlagan sana */}
            <div className="border-[3px] border-black p-4 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4">
              <div className="bg-orange-500 p-2 border-2 border-black text-white"><Calendar size={20}/></div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase">Ish boshlagan vaqti</p>
                <p className="font-bold">{new Date(user.work_date).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Account ID */}
            <div className="border-[3px] border-black p-4 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4">
              <div className="bg-purple-500 p-2 border-2 border-black text-white"><IdCard size={20}/></div>
              <div className="overflow-hidden">
                <p className="text-[9px] font-black text-slate-400 uppercase">Tizim ID raqami</p>
                <code className="text-[10px] font-black">{user._id}</code>
              </div>
            </div>

            {/* Oxirgi yangilanish */}
            <div className="border-[3px] border-black p-4 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4">
              <div className="bg-slate-800 p-2 border-2 border-black text-white"><Clock size={20}/></div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase">Oxirgi faollik</p>
                <p className="font-bold">{new Date(user.updatedAt).toLocaleTimeString()}</p>
              </div>
            </div>

          </div>

          {/* Pastki qism xabari */}
          <div className="p-4 bg-black text-yellow-400 text-center text-[10px] font-black uppercase tracking-[2px]">
            Hozirda tizim manager sifatida boshqarilmoqda
          </div>
        </div>

      </div>
    </div>
  );
}
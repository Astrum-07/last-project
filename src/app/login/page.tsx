"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { FiMail, FiLock, FiArrowRight, FiAlertCircle, FiLoader } from 'react-icons/fi';
import Cookies from 'js-cookie';

const SignIn = () => {
  const router = useRouter();
  
  // Inputlar uchun state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // 1. Sahifa yuklanganda localStorage-dan saqlangan loginni tekshirish
  useEffect(() => {
    setIsMounted(true); // Hydration xatosini oldini olish
    const savedData = localStorage.getItem('rememberedAdmin');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setEmail(parsed.email);
        setPassword(parsed.password);
        setRememberMe(true);
      } catch (e) {
        console.error("LocalStorage o'qishda xato:", e);
      }
    }
  }, []);

  // 2. API-ga so'rov yuborish (Mutation)
  const loginMutation = useMutation({
    mutationFn: async (credentials: any) => {
      // Backend manzili (.env faylidagi NEXT_PUBLIC_BASE_URL)
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://admin-crm.onrender.com';
      
      const response = await fetch(`${baseUrl}/api/auth/sign-in`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json' 
        },
        body: JSON.stringify(credentials),
      });

      const result = await response.json();

      if (!response.ok) {
        // Backenddan kelgan xatolik xabarini chiqarish
        throw new Error(result.message || "Email yoki parol noto'g'ri!");
      }

      return result; // Muvaffaqiyatli bo'lsa JSON qaytadi
    },
    onSuccess: (res) => {
      // Backenddan kelgan JSON ichidan token va user ma'lumotlarini olish
      const token = res?.token || res?.data?.token || res?.accessToken;
      const userData = res?.user || res?.data?.user || res?.data;

      if (token) {
        // "Meni eslab qol" funksiyasi
        if (rememberMe) {
          localStorage.setItem('rememberedAdmin', JSON.stringify({ email, password }));
        } else {
          localStorage.removeItem('rememberedAdmin');
        }

        // 3. TOKEnni Middleware uchun Cookie-da saqlash
        Cookies.set('token', token, { expires: 7 });

        // 4. USER ma'lumotlarini localStorage-ga saqlash
        localStorage.setItem('token', token);
        if (userData) {
          localStorage.setItem('user', JSON.stringify(userData));
        }

        console.log("Muvaffaqiyatli kirildi. User:", userData);

        // 5. Dashboardga yo'naltirish
        setTimeout(() => {
          router.push('/');
          router.refresh(); // Middleware holatini yangilash
        }, 1000);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  // Komponent brauzerda yuklanmaguncha hech nima render qilmaslik (Hydration error fix)
  if (!isMounted) return <div className="min-h-screen bg-[#f1f1f1]" />;

  return (
    <div className="min-h-screen bg-[#f1f1f1] flex items-center justify-center p-4 font-sans text-black">
      <div className="w-full max-w-md bg-white border-[4px] border-black p-8 md:p-10 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
        
        {/* LOGO */}
        <div className="text-center mb-8">
          <div className="inline-block border-[4px] border-black p-3 bg-black">
            <h1 className="text-3xl font-black tracking-tighter uppercase text-white leading-none">
              ADMIN<span className="text-slate-400">.</span>CRM
            </h1>
          </div>
          <p className="mt-4 text-[10px] font-black uppercase tracking-[4px] text-slate-400 italic">Avtorizatsiya</p>
        </div>

        {/* XATOLIK XABARI */}
        {loginMutation.isError && (
          <div className="mb-6 p-4 border-2 border-red-600 bg-red-50 text-red-600 flex items-center space-x-3 font-bold text-xs uppercase tracking-wider animate-pulse">
            <FiAlertCircle size={24} className="flex-shrink-0" />
            <span>{(loginMutation.error as Error).message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email maydoni */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-[2px]">Elektron pochta</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-black transition-colors">
                <FiMail size={20} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@crm.pro"
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-black text-black font-bold focus:outline-none focus:translate-x-1 focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:text-slate-300"
              />
            </div>
          </div>

          {/* Parol maydoni */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-[2px]">Parol</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-black transition-colors">
                <FiLock size={20} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-black text-black font-bold focus:outline-none focus:translate-x-1 focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:text-slate-300"
              />
            </div>
          </div>

          {/* Meni eslab qol */}
          <div className="flex items-center space-x-2 cursor-pointer pt-2">
            <div 
              onClick={() => setRememberMe(!rememberMe)}
              className={`w-5 h-5 border-2 border-black flex items-center justify-center transition-all ${rememberMe ? 'bg-black' : 'bg-white'}`}
            >
              {rememberMe && <div className="w-2 h-2 bg-white rounded-full"></div>}
            </div>
            <span 
              onClick={() => setRememberMe(!rememberMe)}
              className="text-[10px] font-black uppercase tracking-widest select-none cursor-pointer hover:underline"
            >
              Meni eslab qol
            </span>
          </div>

          {/* Kirish tugmasi */}
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-black text-white border-2 border-black py-4 flex items-center justify-center space-x-3 font-black uppercase text-xs tracking-[4px] hover:bg-white hover:text-black transition-all duration-300 active:translate-y-2 disabled:opacity-70 group shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none"
          >
            {loginMutation.isPending ? (
              <FiLoader className="animate-spin text-xl" />
            ) : (
              <>
                <span>Kirish</span>
                <FiArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t-2 border-slate-100 text-center">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            Xavfsizlik tizimi faol <br />
            <span className="text-black font-black">© 2025 CRM SYSTEM</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
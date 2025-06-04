"use client";
import React, { useState } from "react";
import { Check, X, Loader2 } from "lucide-react";
interface AccountToggleProps {
 isActive: boolean;
 onToggle: () => void;
 teacherName: string;
}
export default function AccountToggle({ isActive, onToggle, teacherName }: AccountToggleProps) {
 const [isToggling, setIsToggling] = useState(false);
 const handleToggle = async () => {
   if (isToggling) return;

   const confirmMessage = isActive
     ? `Apakah Anda yakin ingin menonaktifkan akun ${teacherName}? Guru ini tidak akan bisa login ke sistem.`
     : `Apakah Anda yakin ingin mengaktifkan akun ${teacherName}?`;

   if (window.confirm(confirmMessage)) {
     setIsToggling(true);
     try {
       await onToggle();
     } finally {
       setIsToggling(false);
     }
   }
 };
 return (
   <div className="flex items-center justify-center">
     <button
       onClick={handleToggle}
       disabled={isToggling}
       className={`
         relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
         ${isActive
           ? 'bg-gradient-to-r from-green-500 to-green-600 focus:ring-green-500'
           : 'bg-gradient-to-r from-gray-300 to-gray-400 focus:ring-gray-400'
         }
         ${isToggling ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}
       `}
     >
       <span
         className={`
           inline-block h-6 w-6 transform rounded-full bg-white transition-all duration-200 shadow-lg
           ${isActive ? 'translate-x-7' : 'translate-x-1'}
           flex items-center justify-center
         `}
       >
         {isToggling ? (
           <Loader2 className="h-3 w-3 text-gray-400 animate-spin" />
         ) : isActive ? (
           <Check className="h-3 w-3 text-green-600" />
         ) : (
           <X className="h-3 w-3 text-gray-400" />
         )}
       </span>
     </button>

     <div className="ml-3">
       <span className={`text-sm font-medium ${isActive ? 'text-green-600' : 'text-gray-500'}`}>
         {isActive ? 'Aktif' : 'Nonaktif'}
       </span>
       <div className="text-xs text-gray-400">
         {isActive ? 'Dapat login' : 'Tidak dapat login'}
       </div>
     </div>
   </div>
 );
}
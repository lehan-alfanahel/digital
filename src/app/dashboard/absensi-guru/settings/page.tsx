"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Settings, MapPin, Clock, MessageSquare, Save, Loader2, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
interface LocationSettings {
  latitude: number;
  longitude: number;
  radius: number;
}
interface AttendanceTimeSettings {
  checkInStart: string;
  checkInEnd: string;
  checkOutStart: string;
  checkOutEnd: string;
}
interface TelegramSettings {
  token: string;
  chatId: string;
  botUsername: string;
}
export default function TeacherAttendanceSettings() {
  const {
    user,
    userRole,
    schoolId
  } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Settings state
  const [locationSettings, setLocationSettings] = useState<LocationSettings>({
    latitude: 0,
    longitude: 0,
    radius: 100
  });
  const [attendanceTimeSettings, setAttendanceTimeSettings] = useState<AttendanceTimeSettings>({
    checkInStart: "06:00",
    checkInEnd: "08:00",
    checkOutStart: "15:00",
    checkOutEnd: "17:00"
  });
  const [telegramSettings, setTelegramSettings] = useState<TelegramSettings>({
    token: "7702797779:AAELhARB3HkvB9hh5e5D64DCC4faDfcW9IM",
    chatId: "",
    botUsername: "AbsenModernBot"
  });
  const [activeTab, setActiveTab] = useState<'location' | 'time' | 'telegram'>('location');

  // Load settings
  useEffect(() => {
    // Check authorization
    if (userRole !== 'admin') {
      toast.error("Anda tidak memiliki akses ke halaman ini");
      router.push('/dashboard');
      return;
    }
    const loadSettings = async () => {
      if (!schoolId) return;
      try {
        setLoading(true);
        const {
          doc,
          getDoc
        } = await import('firebase/firestore');
        const {
          db
        } = await import('@/lib/firebase');

        // Load location settings - separated by school ID
        const locationDoc = await getDoc(doc(db, `schools/${schoolId}/settings`, "location"));
        if (locationDoc.exists()) {
          const data = locationDoc.data();
          setLocationSettings({
            latitude: data.latitude || 0,
            longitude: data.longitude || 0,
            radius: data.radius || 100
          });
        }

        // Load attendance time settings - separated by school ID
        const timeDoc = await getDoc(doc(db, `schools/${schoolId}/settings`, "attendanceTime"));
        if (timeDoc.exists()) {
          const data = timeDoc.data();
          setAttendanceTimeSettings({
            checkInStart: data.checkInStart || "06:00",
            checkInEnd: data.checkInEnd || "08:00",
            checkOutStart: data.checkOutStart || "15:00",
            checkOutEnd: data.checkOutEnd || "17:00"
          });
        }

        // Load telegram settings - separated by school ID
        const telegramDoc = await getDoc(doc(db, `schools/${schoolId}/settings`, "telegram"));
        if (telegramDoc.exists()) {
          const data = telegramDoc.data();
          setTelegramSettings({
            token: data.token || "7702797779:AAELhARB3HkvB9hh5e5D64DCC4faDfcW9IM",
            chatId: data.chatId || "",
            botUsername: data.botUsername || "AbsenModernBot"
          });
        }
      } catch (error) {
        console.error("Error loading settings:", error);
        toast.error("Gagal memuat pengaturan");
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, [schoolId, userRole, router]);

  // Handle location settings change
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setLocationSettings(prev => ({
      ...prev,
      [name]: name === 'radius' ? parseInt(value) : parseFloat(value)
    }));
  };

  // Handle time settings change
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setAttendanceTimeSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle telegram settings change
  const handleTelegramChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setTelegramSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Get current location - optimized for Vercel build
  const getCurrentLocation = () => {
    // Check if running in browser environment
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      toast.error("Fitur lokasi tidak tersedia di server");
      return;
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        setLocationSettings(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }));
        toast.success("Lokasi saat ini berhasil didapatkan");
      }, error => {
        console.error("Error getting location:", error);
        let errorMessage = "Gagal mendapatkan lokasi. ";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Izin lokasi ditolak.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Informasi lokasi tidak tersedia.";
            break;
          case error.TIMEOUT:
            errorMessage += "Permintaan lokasi timeout.";
            break;
          default:
            errorMessage += "Terjadi kesalahan yang tidak diketahui.";
            break;
        }
        toast.error(errorMessage);
      }, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      });
    } else {
      toast.error("Geolocation tidak didukung oleh browser ini");
    }
  };

  // Test telegram bot - optimized for Vercel build
  const testTelegramBot = async () => {
    try {
      if (!telegramSettings.chatId || !telegramSettings.chatId.trim()) {
        toast.error("ID Chat Telegram tidak boleh kosong");
        return;
      }
      if (!telegramSettings.token || !telegramSettings.token.trim()) {
        toast.error("Token Bot Telegram tidak boleh kosong");
        return;
      }

      // Validate chat ID format (should be numeric or start with -)
      const chatIdPattern = /^-?\d+$/;
      if (!chatIdPattern.test(telegramSettings.chatId.trim())) {
        toast.error("Format ID Chat Telegram tidak valid. Harus berupa angka.");
        return;
      }
      const testMessage = `🔔 Ini adalah pesan uji coba dari Aplikasi Absensi Guru. ID Sekolah : ${schoolId}.\n\nJika Anda menerima pesan ini, berarti konfigurasi bot telegram berhasil untuk Sekolah Anda.`;
      const response = await fetch(`https://api.telegram.org/bot${telegramSettings.token}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: telegramSettings.chatId.trim(),
          text: testMessage,
          parse_mode: 'HTML'
        })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.ok) {
        toast.success("Test Bot berhasil! Pesan terkirim ke Telegram.");
      } else {
        const errorMsg = data.description || "Gagal mengirim pesan";
        toast.error(`Gagal mengirim pesan: ${errorMsg}`);
        console.error("Telegram API error:", data);
      }
    } catch (error) {
      console.error("Error testing Telegram bot:", error);
      let errorMessage = "Gagal menghubungi API Telegram";
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          errorMessage = "Gagal terhubung ke server Telegram. Periksa koneksi internet.";
        } else if (error.message.includes('HTTP error')) {
          errorMessage = "Server Telegram menolak permintaan. Periksa token bot.";
        }
      }
      toast.error(errorMessage);
    }
  };

  // Save all settings
  const saveSettings = async () => {
    if (!schoolId) {
      toast.error("ID sekolah tidak ditemukan");
      return;
    }
    try {
      setSaving(true);
      const {
        doc,
        setDoc,
        serverTimestamp
      } = await import('firebase/firestore');
      const {
        db
      } = await import('@/lib/firebase');

      // Save location settings - separated by school ID
      await setDoc(doc(db, `schools/${schoolId}/settings`, "location"), {
        ...locationSettings,
        schoolId,
        updatedAt: serverTimestamp()
      });

      // Save time settings - separated by school ID
      await setDoc(doc(db, `schools/${schoolId}/settings`, "attendanceTime"), {
        ...attendanceTimeSettings,
        schoolId,
        updatedAt: serverTimestamp()
      });

      // Save telegram settings - separated by school ID
      await setDoc(doc(db, `schools/${schoolId}/settings`, "telegram"), {
        ...telegramSettings,
        schoolId,
        updatedAt: serverTimestamp()
      });
      setSaveSuccess(true);
      toast.success("Pengaturan berhasil disimpan");
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Gagal menyimpan pengaturan");
    } finally {
      setSaving(false);
    }
  };
  return <div className="pb-20 md:pb-6" data-unique-id="50f05aca-8000-4fe7-8492-877a0c792fb1" data-file-name="app/dashboard/absensi-guru/settings/page.tsx" data-dynamic-text="true">
      <div className="flex items-center justify-between mb-6" data-unique-id="150a786a-b54f-45df-b6e2-824d879d07f3" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
        <div className="flex items-center" data-unique-id="14ae8669-4061-435d-8afe-45759d3cee2c" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
          <Link href="/dashboard/absensi-guru" className="p-2 mr-2 hover:bg-gray-100 rounded-full" data-unique-id="5e8dd125-32b7-483c-98b3-216e7715cdd0" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800" data-unique-id="53b85f80-1775-4676-bde1-17ea5c0cbf37" data-file-name="app/dashboard/absensi-guru/settings/page.tsx"><span className="editable-text" data-unique-id="f88ce9e8-7225-43f5-a0da-1a819de08897" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">Pengaturan Absensi Guru</span></h1>
        </div>
      </div>
      
      {loading ? <div className="flex justify-center items-center h-64" data-unique-id="f086c6b7-407a-44f7-8cbe-1066c9483b70" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
        </div> : <div className="bg-white rounded-xl shadow-sm overflow-hidden" data-unique-id="13717399-dc60-416f-bfeb-cf24f38501db" data-file-name="app/dashboard/absensi-guru/settings/page.tsx" data-dynamic-text="true">
          {/* Tabs */}
          <div className="border-b border-gray-200" data-unique-id="7a01d378-3848-4861-ba11-6a5951079365" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
            <div className="flex" data-unique-id="b99352fd-514e-44c3-9733-7ac83a8c0364" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
              <button className={`py-4 px-6 font-medium text-sm border-b-2 ${activeTab === 'location' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('location')} data-unique-id="97d8faa9-d01f-45b8-b516-b8d43a02c880" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                <MapPin size={16} className="inline-block mr-2" /><span className="editable-text" data-unique-id="6ba51494-b6d5-4585-a10a-5eea64f7b9ce" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                Lokasi
              </span></button>
              <button className={`py-4 px-6 font-medium text-sm border-b-2 ${activeTab === 'time' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('time')} data-unique-id="76176624-57c6-49c6-b538-4e90807a3300" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                <Clock size={16} className="inline-block mr-2" /><span className="editable-text" data-unique-id="91b2f270-802d-492c-83ec-214139596f21" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                Jam
              </span></button>
              <button className={`py-4 px-6 font-medium text-sm border-b-2 ${activeTab === 'telegram' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('telegram')} data-unique-id="07e29241-aa0f-4ec0-80f9-bc750309f15f" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                <MessageSquare size={16} className="inline-block mr-2" /><span className="editable-text" data-unique-id="00a4a8cd-51c9-4f6f-b03f-16f14b43a1be" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                Telegram
              </span></button>
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="p-6" data-unique-id="80dd7af9-92d4-4f70-b697-28e36990bc15" data-file-name="app/dashboard/absensi-guru/settings/page.tsx" data-dynamic-text="true">
            {/* Location Settings */}
            {activeTab === 'location' && <div data-unique-id="ee78d3e1-a246-4072-a265-5e06f60d4c3b" data-file-name="app/dashboard/absensi-guru/settings/page.tsx" data-dynamic-text="true">
                <h2 className="text-lg font-semibold mb-6" data-unique-id="f034534c-7a60-43dd-b968-0b2cb5062905" data-file-name="app/dashboard/absensi-guru/settings/page.tsx"><span className="editable-text" data-unique-id="762ff5e0-a6aa-45df-b2a3-6ec7e97842bc" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">Pengaturan Lokasi Sekolah</span></h2>
                
                <div className="mb-6" data-unique-id="da2e9a9d-d209-4d92-8018-3182234df6d2" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                  <p className="text-gray-600 mb-4" data-unique-id="966c5bd4-47cc-484b-a897-e33f8ecee6a8" data-file-name="app/dashboard/absensi-guru/settings/page.tsx"><span className="editable-text" data-unique-id="4dfbc37c-358d-47a6-8d94-049e1daec018" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                    Tentukan lokasi sekolah dan radius (dalam meter) di mana absensi diizinkan.
                    Tenaga kependidikan hanya dapat melakukan absensi jika berada dalam radius yang ditentukan.
                  </span></p>
                  <button onClick={getCurrentLocation} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mb-6" data-unique-id="31315f5b-f1d8-425b-9c14-a0a23419a9f8" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                    <MapPin size={16} className="inline-block mr-2" /><span className="editable-text" data-unique-id="ef36fcda-6fe5-41dc-8d6c-cb556c9f9314" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                    Dapatkan Lokasi Saat Ini
                  </span></button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6" data-unique-id="1b36aa6f-90f3-4483-91ca-60b1ee2874eb" data-file-name="app/dashboard/absensi-guru/settings/page.tsx" data-dynamic-text="true">
                  {/* Latitude */}
                  <div data-unique-id="207bd09e-5a6f-4d34-bd06-065442c8deb6" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                    <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="2d07d887-5c01-44ee-9601-51b9f508f797" data-file-name="app/dashboard/absensi-guru/settings/page.tsx"><span className="editable-text" data-unique-id="fb3a2375-d4b3-4a32-981f-c5adab97cc08" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                      Garis Lintang (Latitude)
                    </span></label>
                    <input type="number" step="0.000001" id="latitude" name="latitude" value={locationSettings.latitude} onChange={handleLocationChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" required data-unique-id="fc96d277-a80f-4921-96d8-aa0d72908445" data-file-name="app/dashboard/absensi-guru/settings/page.tsx" />
                  </div>
                  
                  {/* Longitude */}
                  <div data-unique-id="902c34b2-4c9f-473c-8419-b4aae2503ea6" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                    <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="f0339bd1-29d2-4b82-ab2b-a9d4fb852def" data-file-name="app/dashboard/absensi-guru/settings/page.tsx"><span className="editable-text" data-unique-id="ee57a37d-4cf4-4a35-a411-7b1d81403ccc" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                      Garis Bujur (Longitude)
                    </span></label>
                    <input type="number" step="0.000001" id="longitude" name="longitude" value={locationSettings.longitude} onChange={handleLocationChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" required data-unique-id="9ed41b0a-91f2-410b-91e9-0a266656b134" data-file-name="app/dashboard/absensi-guru/settings/page.tsx" />
                  </div>
                </div>
                
                {/* Radius */}
                <div className="mb-6" data-unique-id="9dea0804-67cc-432e-873c-381dbb9a6130" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                  <label htmlFor="radius" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="69a33d17-0e2c-4a99-b2ef-e061ca7a3248" data-file-name="app/dashboard/absensi-guru/settings/page.tsx"><span className="editable-text" data-unique-id="f85ec9f7-02fe-46d9-9608-faa9903aea2f" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                    Radius Absensi (dalam meter)
                  </span></label>
                  <input type="range" id="radius" name="radius" min="50" max="500" step="10" value={locationSettings.radius} onChange={handleLocationChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" data-unique-id="8bab8e24-a94b-4b09-882e-c6349b537e9b" data-file-name="app/dashboard/absensi-guru/settings/page.tsx" />
                  <div className="flex justify-between mt-2" data-unique-id="4cbff5c7-1101-4106-9488-9047cdd8077b" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                    <span className="text-xs text-gray-500" data-unique-id="fe21f39e-1fdb-4648-a2f8-a092dfefb8ea" data-file-name="app/dashboard/absensi-guru/settings/page.tsx"><span className="editable-text" data-unique-id="4ce86f26-63ee-4d0b-9850-13f0173c4895" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">50m</span></span>
                    <span className="text-sm font-medium" data-unique-id="e32b8bbf-3206-4340-93ef-03b828dbaf17" data-file-name="app/dashboard/absensi-guru/settings/page.tsx" data-dynamic-text="true">{locationSettings.radius}<span className="editable-text" data-unique-id="7fe55186-94b6-4d1f-98ef-22ede807ff2d" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">m</span></span>
                    <span className="text-xs text-gray-500" data-unique-id="3862e053-3a39-40a4-9e97-faa014c896d1" data-file-name="app/dashboard/absensi-guru/settings/page.tsx"><span className="editable-text" data-unique-id="b55b3482-bed9-4e09-ba16-4c69162091e6" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">500m</span></span>
                  </div>
                </div>
                
                <div data-unique-id="e06baa25-8d09-4b05-a179-1852dcb976d9" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                  <h3 className="text-md font-semibold mb-1" data-unique-id="a4ffd22e-bd81-4441-99d6-71f025e4fb18" data-file-name="app/dashboard/absensi-guru/settings/page.tsx"><span className="editable-text" data-unique-id="de0c2cac-507b-4704-af74-666bcf1dbb7c" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">Lokasi yang akan diterapkan:</span></h3>
                  <p className="text-gray-600" data-unique-id="1a18383f-5f4c-4bc8-b8ec-52bbb919c174" data-file-name="app/dashboard/absensi-guru/settings/page.tsx" data-dynamic-text="true">
                    {locationSettings.latitude === 0 && locationSettings.longitude === 0 ? "Lokasi belum diatur" : `${locationSettings.latitude}, ${locationSettings.longitude} (Radius: ${locationSettings.radius}m)`}
                  </p>
                </div>
              </div>}
            
            {/* Time Settings */}
            {activeTab === 'time' && <div data-unique-id="43099d73-d2f2-4274-9e8e-2903b3961261" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                <h2 className="text-lg font-semibold mb-6" data-unique-id="1296696f-a51f-4038-91aa-98769c9f6748" data-file-name="app/dashboard/absensi-guru/settings/page.tsx"><span className="editable-text" data-unique-id="35dbdb45-31de-48cc-8236-3c06003c5780" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">Pengaturan Jam Kerja</span></h2>
                
                <div className="mb-6" data-unique-id="575aebc8-6a0c-4d81-aa48-ea9150087ca0" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                  <p className="text-gray-600 mb-4" data-unique-id="55e1de22-faaf-4d2e-b4d5-c3b137ebb360" data-file-name="app/dashboard/absensi-guru/settings/page.tsx"><span className="editable-text" data-unique-id="a0a68120-480b-48bc-bcf3-fc2b5f435f44" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                    Atur jam absensi masuk dan pulang. Guru dan tenaga kependidikan hanya dapat
                    melakukan absensi dalam rentang waktu yang ditentukan.
                  </span></p>
                </div>
                
                <div className="grid grid-cols-1 gap-6" data-unique-id="cb6dae25-dba7-49e4-a300-3bc2e35aadb3" data-file-name="app/dashboard/absensi-guru/settings/page.tsx" data-dynamic-text="true">
                  {/* Check-in time */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200" data-unique-id="31f90d05-4941-4e59-b0d8-8ce622c2f3d9" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                    <h3 className="text-md font-semibold mb-2" data-unique-id="481e40bf-17a1-4581-b426-43eb93399548" data-file-name="app/dashboard/absensi-guru/settings/page.tsx"><span className="editable-text" data-unique-id="a9b059e1-49c1-4124-85b6-7b469c690399" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">Jam Absensi Masuk</span></h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-unique-id="60072196-f24e-4f1f-aab6-64715b33a61b" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                      <div data-unique-id="33e9265c-2630-48ed-9b48-17f2b08d58ec" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                        <label htmlFor="checkInStart" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="19b9fe75-34ea-451d-a390-030db61f6465" data-file-name="app/dashboard/absensi-guru/settings/page.tsx"><span className="editable-text" data-unique-id="4fa91741-0ec8-4d8e-9244-a982b8fa11c4" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                          Waktu Mulai
                        </span></label>
                        <input type="time" id="checkInStart" name="checkInStart" disabled value={attendanceTimeSettings.checkInStart} onChange={handleTimeChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" data-unique-id="fdc4a0f8-d1e7-4747-852b-17692e8a0723" data-file-name="app/dashboard/absensi-guru/settings/page.tsx" />
                      </div>
                      <div data-unique-id="26d0c9d9-fb20-4456-bea7-032c2f46b839" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                        <label htmlFor="checkInEnd" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="4566af2d-96fe-432e-a73c-bba42f78815b" data-file-name="app/dashboard/absensi-guru/settings/page.tsx"><span className="editable-text" data-unique-id="bb9d6d96-1ef4-4c1e-9321-455093394a5a" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                          Batas Waktu
                        </span></label>
                        <input type="time" id="checkInEnd" name="checkInEnd" disabled value={attendanceTimeSettings.checkInEnd} onChange={handleTimeChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" data-unique-id="1be608dc-84b8-4a6a-aea7-28433b18685c" data-file-name="app/dashboard/absensi-guru/settings/page.tsx" />
                        <p className="text-xs text-gray-500 mt-1" data-unique-id="d4e66c31-8312-482b-98b0-dbd6a59b3150" data-file-name="app/dashboard/absensi-guru/settings/page.tsx"><span className="editable-text" data-unique-id="c9691e9f-4996-4afa-bdea-af1627b130f6" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                          * Absensi setelah waktu ini akan dianggap terlambat
                        </span></p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Check-out time */}
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200" data-unique-id="2e7de559-ad44-46d2-9ee2-211389fc05ca" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                    <h3 className="text-md font-semibold mb-2" data-unique-id="40a31d06-4b0e-46e2-8a97-ec79009648f7" data-file-name="app/dashboard/absensi-guru/settings/page.tsx"><span className="editable-text" data-unique-id="1a81781e-a0fa-4bec-894f-692395fdc0a3" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">Jam Absensi Pulang</span></h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-unique-id="a869dd69-1901-4341-89b4-23b434f335b2" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                      <div data-unique-id="a518d88c-8fd0-42a5-bd5b-e83cbf4db9a5" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                        <label htmlFor="checkOutStart" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="9291c5cb-0ec5-4d92-a88b-4181a73e1de2" data-file-name="app/dashboard/absensi-guru/settings/page.tsx"><span className="editable-text" data-unique-id="cdf43c24-d274-4a8b-96ce-b2d90738ff41" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                          Waktu Mulai
                        </span></label>
                        <input type="time" id="checkOutStart" name="checkOutStart" disabled value={attendanceTimeSettings.checkOutStart} onChange={handleTimeChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" data-unique-id="9fd23055-c8c7-4cde-8fbe-cc315d55d6d7" data-file-name="app/dashboard/absensi-guru/settings/page.tsx" />
                      </div>
                      <div data-unique-id="72055479-4151-40cf-bf46-e3336ec4dc10" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                        <label htmlFor="checkOutEnd" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="cf064746-8f58-4dd3-8fe6-b7da9c425048" data-file-name="app/dashboard/absensi-guru/settings/page.tsx"><span className="editable-text" data-unique-id="9e8dcbe0-0e01-4ef6-aee7-e849dc2e3a0a" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                          Batas Waktu
                        </span></label>
                        <input type="time" id="checkOutEnd" name="checkOutEnd" disabled value={attendanceTimeSettings.checkOutEnd} onChange={handleTimeChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" data-unique-id="e6678fa8-912a-46cc-a4ee-45414dcc2493" data-file-name="app/dashboard/absensi-guru/settings/page.tsx" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>}
            
            {/* Telegram Settings */}
            {activeTab === 'telegram' && <div data-unique-id="5cdae872-6ead-4913-802d-9cafa7ed417e" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                <h2 className="text-lg font-semibold mb-6" data-unique-id="ba87a4f5-ac49-4bb8-a20f-e1cc89275a88" data-file-name="app/dashboard/absensi-guru/settings/page.tsx"><span className="editable-text" data-unique-id="de5d1f5c-47b8-4413-9d94-963fccf9fa92" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">Pengaturan Telegram</span></h2>
                
                <div className="mb-4" data-unique-id="8c00bd5f-1356-45ad-8615-73633d63f0e9" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                  <div className="flex items-start bg-blue-50 p-4 rounded-lg mb-6" data-unique-id="a70b5fb3-32be-4d72-b796-643d8ccea97a" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
            {/*<AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />*/}
                    <div data-unique-id="5edf4510-071c-4254-baae-4b83f15d7def" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                      <h4 className="font-medium text-blue-700" data-unique-id="aff650cc-e14f-41ee-a71e-28dd9d1f42a9" data-file-name="app/dashboard/absensi-guru/settings/page.tsx"><span className="editable-text" data-unique-id="65b91cb3-4492-4c5d-9181-dc8a32163f4e" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">Informasi Bot Telegram</span></h4>
                      <p className="text-sm text-blue-600 mt-1" data-unique-id="1d4744f8-6a4c-4c42-b2f1-a3ca44fce92e" data-file-name="app/dashboard/absensi-guru/settings/page.tsx"><span className="editable-text" data-unique-id="e5579d78-4104-4aad-8f3a-31640f217246" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                        Untuk mendapatkan ID Chat, silakan kirim pesan ke 
                        </span><a href="https://t.me/userinfobot" target="_blank" rel="noopener noreferrer" className="text-blue-700 underline mx-1" data-unique-id="b4a3c910-5415-4c03-9dcb-ac58f71c942f" data-file-name="app/dashboard/absensi-guru/settings/page.tsx"><span className="editable-text" data-unique-id="fc95b12c-730b-4654-82ac-866287521204" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">@userinfobot</span></a><span className="editable-text" data-unique-id="9cf95e31-ac8d-496c-8a24-dc328277bcb1" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                        dan masukkan ID Telegram yang diberikan oleh userinfobot ke dalam ID Chat Telegram di bawah.
                      </span></p>


                      <p className="text-sm text-blue-600 mt-1" data-unique-id="1d4744f8-6a4c-4c42-b2f1-a3ca44fce92e" data-file-name="app/dashboard/absensi-guru/settings/page.tsx"><span className="editable-text" data-unique-id="e5579d78-4104-4aad-8f3a-31640f217246" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                        Untuk mendapatkan ID Chat Grup Telegram agar memudahkan info notifikasi absensi terkirim ke dalam Grup, silahkan hubungi Admin melalui chat 
                        </span><a href="https://wa.me/6281272405881?text=Halo%2C%20saya%20guru%20dari%20sekolah%20yang%20menggunakan%20aplikasi%20Absensi%20Digital.%20Saya%20ingin%20dibuatkan%20Grup%20Telegram%20untuk%20Absensi%20Guru." target="_blank" rel="noopener noreferrer" className="text-blue-700 underline mx-1" data-unique-id="b4a3c910-5415-4c03-9dcb-ac58f71c942f" data-file-name="app/dashboard/absensi-guru/settings/page.tsx"><span className="editable-text" data-unique-id="fc95b12c-730b-4654-82ac-866287521204" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">WhatsApp</span></a><span className="editable-text" data-unique-id="9cf95e31-ac8d-496c-8a24-dc328277bcb1" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                        agar dibuatkan Grup Telegram dan diberikan ID Chat Grup Telegram.
                      </span></p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 mb-6" data-unique-id="b112a79b-c4c4-48d5-9e9a-bcbd61debfeb" data-file-name="app/dashboard/absensi-guru/settings/page.tsx" data-dynamic-text="true">
                    {/* Bot Token */}
                    {/*<div data-unique-id="e18b1369-234a-49cd-ace9-0f064b40c4de" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                      <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="17ecc0ad-51f2-4198-904c-65b060e1b847" data-file-name="app/dashboard/absensi-guru/settings/page.tsx"><span className="editable-text" data-unique-id="a2d0beb2-9a4a-4b14-ad4f-22691af85af5" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                        Token Bot
                      </span></label>
                      <input type="text" id="token" name="token" value={telegramSettings.token} onChange={handleTelegramChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" data-unique-id="00f99ab3-d2d3-4688-951f-b7765c29d754" data-file-name="app/dashboard/absensi-guru/settings/page.tsx" />
                      <p className="text-xs text-gray-500 mt-1" data-unique-id="41d41a39-3f19-4cee-afb7-36493afba541" data-file-name="app/dashboard/absensi-guru/settings/page.tsx"><span className="editable-text" data-unique-id="b2d71279-3714-4616-abcb-a913901541e8" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                        Token default: </span><code data-unique-id="168e9323-f3b9-4f18-b3df-9ac22bc6cff7" data-file-name="app/dashboard/absensi-guru/settings/page.tsx"><span className="editable-text" data-unique-id="00e4a414-bd17-4a1f-97d4-baad0c43c4a0" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">7702797779:AAELhARB3HkvB9hh5e5D64DCC4faDfcW9IM</span></code>
                      </p>
                    </div>*/}
                    
                    {/* Chat ID */}
                    <div data-unique-id="fc60cf19-da7d-4d17-a3de-6a3cc43793b6" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                      <label htmlFor="chatId" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="38325a81-c3c3-45ea-9c38-14d469f08392" data-file-name="app/dashboard/absensi-guru/settings/page.tsx"><span className="editable-text" data-unique-id="6da0f8b3-526d-4adc-ac10-6801d50f3404" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                        ID Chat Grup Telegram
                      </span></label>
                      <input type="text" id="chatId" name="chatId" value={telegramSettings.chatId} onChange={handleTelegramChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" placeholder="Contoh : -123456789" required data-unique-id="927a76e6-9337-42be-954a-3e7b59e5e7a5" data-file-name="app/dashboard/absensi-guru/settings/page.tsx" />
                    </div>
                    
                    {/* Bot Username */}
                    <div data-unique-id="ecb400d0-b81d-45e0-8fee-a7dbf4d68aec" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                      <label htmlFor="botUsername" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="03bc0345-cf47-4e0a-9c32-29db60fdf0b2" data-file-name="app/dashboard/absensi-guru/settings/page.tsx"><span className="editable-text" data-unique-id="d45ecdf5-07b7-4fcc-938d-db44c44fa207" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                        Username Bot
                      </span></label>
                      <div className="relative" data-unique-id="7080039a-89fd-4733-af65-75776d12bd40" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500" data-unique-id="fb7ee14f-309b-4088-a2ba-c4664b2a6394" data-file-name="app/dashboard/absensi-guru/settings/page.tsx"><span className="editable-text" data-unique-id="cd84dedf-8398-4236-a89d-e33372158549" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">@</span></span>
                        <input type="text" id="botUsername" name="botUsername" disabled value={telegramSettings.botUsername} onChange={handleTelegramChange} className="w-full pl-8 px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" data-unique-id="5ee72dec-6b65-49b3-bc3d-2d4a63469594" data-file-name="app/dashboard/absensi-guru/settings/page.tsx" />
                      </div>
                    </div>
                  </div>
                  
                  <button type="button" onClick={testTelegramBot} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-900 active:bg-orange-800 transition-colors" data-unique-id="437bb943-17b6-41da-887d-7f7d5963c091" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                    <MessageSquare size={16} className="inline-block mr-2" /><span className="editable-text" data-unique-id="d8134575-b11c-4571-b5cd-336a79a3e19f" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
                    Kirim Pesan Test ke Telegram
                  </span></button>
                </div>
              </div>}
          </div>
          
          {/* Action buttons */}
          <div className="px-6 py-4 bg-gray-50 flex justify-end" data-unique-id="83d128bc-1b27-45cf-81c7-6cd934a4753f" data-file-name="app/dashboard/absensi-guru/settings/page.tsx">
            <motion.button onClick={saveSettings} disabled={saving || saveSuccess} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-white transition-colors ${saving || saveSuccess ? 'bg-green-600' : 'bg-primary hover:bg-orange-500 active:bg-orange-600'}`} whileTap={{
          scale: 0.95
        }} data-unique-id="c7b2d81d-704f-4a8f-ae39-4157be938e83" data-file-name="app/dashboard/absensi-guru/settings/page.tsx" data-dynamic-text="true">
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : saveSuccess ? <CheckCircle className="h-5 w-5" /> : <Save className="h-5 w-5" />}
              {saving ? "Menyimpan..." : saveSuccess ? "Tersimpan" : "Simpan Pengaturan"}
            </motion.button>
          </div>
        </div>}
    </div>;
}

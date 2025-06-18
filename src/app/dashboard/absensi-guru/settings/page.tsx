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

        // Load location settings with schoolId
        const locationDoc = await getDoc(doc(db, "settings", `location_${schoolId}`));
        if (locationDoc.exists()) {
          const data = locationDoc.data();
          setLocationSettings({
            latitude: data.latitude || 0,
            longitude: data.longitude || 0,
            radius: data.radius || 100
          });
        }

        // Load attendance time settings with schoolId
        const timeDoc = await getDoc(doc(db, "settings", `attendanceTime_${schoolId}`));
        if (timeDoc.exists()) {
          const data = timeDoc.data();
          setAttendanceTimeSettings({
            checkInStart: data.checkInStart || "06:00",
            checkInEnd: data.checkInEnd || "08:00",
            checkOutStart: data.checkOutStart || "15:00",
            checkOutEnd: data.checkOutEnd || "17:00"
          });
        }

        // Load telegram settings with schoolId - PERUBAHAN UTAMA
        const telegramDoc = await getDoc(doc(db, "settings", `telegram_${schoolId}`));
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

  // Get current location
  const getCurrentLocation = () => {
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
        toast.error("Gagal mendapatkan lokasi. Pastikan GPS diaktifkan.");
      });
    } else {
      toast.error("Geolocation tidak didukung oleh browser ini");
    }
  };

  // Test telegram bot
  const testTelegramBot = async () => {
    try {
      if (!telegramSettings.chatId) {
        toast.error("ID Chat Telegram tidak boleh kosong");
        return;
      }
      const response = await fetch(`https://api.telegram.org/bot${telegramSettings.token}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: telegramSettings.chatId,
          text: `🔔 Ini adalah pesan uji coba dari Aplikasi Absensi Guru Sekolah ID: ${schoolId}. Jika Anda menerima pesan ini, berarti konfigurasi bot telegram berhasil.`
        })
      });
      const data = await response.json();
      if (data.ok) {
        toast.success("Test berhasil! Pesan terkirim ke Telegram.");
      } else {
        toast.error(`Gagal mengirim pesan: ${data.description}`);
      }
    } catch (error) {
      console.error("Error testing Telegram bot:", error);
      toast.error("Gagal menghubungi API Telegram");
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

      // Save location settings with schoolId
      await setDoc(doc(db, "settings", `location_${schoolId}`), {
        ...locationSettings,
        schoolId,
        updatedAt: serverTimestamp()
      });

      // Save time settings with schoolId
      await setDoc(doc(db, "settings", `attendanceTime_${schoolId}`), {
        ...attendanceTimeSettings,
        schoolId,
        updatedAt: serverTimestamp()
      });

      // Save telegram settings with schoolId - PERUBAHAN UTAMA
      await setDoc(doc(db, "settings", `telegram_${schoolId}`), {
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

  // ... rest of JSX remains the same
}

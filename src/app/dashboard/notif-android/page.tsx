'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Smartphone, Send, Users, Bell, AlertCircle, CheckCircle, Zap, FileText } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import ConfigFilesList from '@/components/notifications/ConfigFilesList';
interface NotificationHistory {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  recipients: number;
  status: 'success' | 'error';
}
export default function NotifAndroidPage() {
  const [loading, setLoading] = useState(false);
  const [notificationHistory, setNotificationHistory] = useState<NotificationHistory[]>([]);
  const [showConfigFiles, setShowConfigFiles] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    badge: '1',
    url: '',
    targetAudience: 'all',
    scheduled: false,
    scheduleTime: ''
  });

  // OneSignal Configuration with provided credentials
  const ONESIGNAL_APP_ID = 'c8ac779e-241b-4903-8ed4-6766936a4fee';
  const ONESIGNAL_REST_API_KEY = 'os_v2_app_zcwhphredneqhdwum5tjg2sp5zlobxnaq2oegheswznxni45eipldyel2hh5hbjrqctcbv2oy6fjs66u26ywel323msitf4r5l2u2ui';
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value,
      type
    } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  const sendNotification = async () => {
    if (!formData.title || !formData.message) {
      toast.error('Judul dan pesan harus diisi');
      return;
    }
    setLoading(true);
    try {
      const notificationData = {
        app_id: ONESIGNAL_APP_ID,
        headings: {
          en: formData.title,
          id: formData.title
        },
        contents: {
          en: formData.message,
          id: formData.message
        },
        included_segments: ['All'],
        // Android specific settings
        android_accent_color: '0A2472',
        android_led_color: '0A2472',
        android_sound: 'default',
        android_visibility: 1,
        android_group: 'data_aset',
        android_group_message: {
          en: '$[notif_count] notifikasi baru dari Data Aset',
          id: '$[notif_count] notifikasi baru dari Data Aset'
        },
        // Badge count for app icon
        ios_badgeType: 'Increase',
        ios_badgeCount: parseInt(formData.badge),
        // Additional data
        data: {
          badge: formData.badge,
          type: 'android_notification',
          timestamp: new Date().toISOString()
        },
        // URL if provided
        ...(formData.url && {
          url: formData.url,
          web_url: formData.url
        }),
        // Scheduling if enabled
        ...(formData.scheduled && formData.scheduleTime && {
          send_after: new Date(formData.scheduleTime).toISOString()
        })
      };
      const response = await fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${ONESIGNAL_REST_API_KEY}`
        },
        body: JSON.stringify(notificationData)
      });
      if (response.ok) {
        const result = await response.json();

        // Add to notification history
        const historyItem: NotificationHistory = {
          id: result.id || `success_${Date.now()}`,
          title: formData.title,
          message: formData.message,
          timestamp: new Date().toISOString(),
          recipients: result.recipients || 0,
          status: 'success'
        };
        setNotificationHistory(prev => [historyItem, ...prev.slice(0, 9)]);
        toast.success(`Notifikasi berhasil dikirim! Recipients: ${result.recipients || 0}`);

        // Reset form
        setFormData({
          title: '',
          message: '',
          badge: '1',
          url: '',
          targetAudience: 'all',
          scheduled: false,
          scheduleTime: ''
        });
      } else {
        const errorText = await response.text();
        let errorDetails = '';
        try {
          const errorJson = JSON.parse(errorText);
          console.error('OneSignal Error Response:', errorJson);
          if (errorJson.errors && Array.isArray(errorJson.errors)) {
            errorDetails = errorJson.errors.join(', ');
          } else {
            errorDetails = JSON.stringify(errorJson);
          }
        } catch (e) {
          console.error('Raw OneSignal Error:', errorText);
          errorDetails = errorText;
        }
        toast.error(`Gagal mengirim notifikasi: ${errorDetails}`);

        // Add failed notification to history
        const historyItem: NotificationHistory = {
          id: `failed_${Date.now()}`,
          title: formData.title,
          message: formData.message,
          timestamp: new Date().toISOString(),
          recipients: 0,
          status: 'error'
        };
        setNotificationHistory(prev => [historyItem, ...prev.slice(0, 9)]);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Terjadi kesalahan saat mengirim notifikasi');

      // Add failed notification to history
      const historyItem: NotificationHistory = {
        id: `error_${Date.now()}`,
        title: formData.title,
        message: formData.message,
        timestamp: new Date().toISOString(),
        recipients: 0,
        status: 'error'
      };
      setNotificationHistory(prev => [historyItem, ...prev.slice(0, 9)]);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendNotification();
  };
  return <DashboardLayout>
      <Toaster position="top-center" richColors closeButton />
      
      <div className="space-y-6" data-unique-id="69ad4b05-42e9-4f81-9e72-45e910182932" data-file-name="app/notif-android/page.tsx">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 sm:space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl shadow-sm border border-blue-100" data-unique-id="8b73254d-994f-4545-910f-3fd0327c9035" data-file-name="app/notif-android/page.tsx">
          <div className="flex items-center gap-3" data-unique-id="437c533d-cc4f-48b9-b9b2-066ba90d5c27" data-file-name="app/notif-android/page.tsx">
            <div className="p-2 bg-blue-500 rounded-lg" data-unique-id="eae93118-68c1-4268-abe4-c99e4444a964" data-file-name="app/notif-android/page.tsx">
              <Smartphone className="h-6 w-6 text-white" />
            </div>
            <div data-unique-id="5fc3b01c-514a-4d8a-8931-75e8ef9a711b" data-file-name="app/notif-android/page.tsx">
              <h1 className="text-2xl font-bold text-gray-800" data-unique-id="cbe453f4-bd73-455c-bfb8-0b6eadab8205" data-file-name="app/notif-android/page.tsx"><span className="editable-text" data-unique-id="3599a515-2c25-4390-9d33-7ab1f019d55a" data-file-name="app/notif-android/page.tsx">NOTIF-ANDROID</span></h1>
              <p className="text-sm text-gray-600" data-unique-id="a678a72c-6af6-4f74-a2a3-84aca0fab58d" data-file-name="app/notif-android/page.tsx"><span className="editable-text" data-unique-id="f3773b89-5a34-46b8-a8a1-eb7ccce59986" data-file-name="app/notif-android/page.tsx">Dashboard Push Notification untuk Aplikasi Android</span></p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full" data-unique-id="9bdb2786-4966-49d7-9efb-a5cb00f5d5b2" data-file-name="app/notif-android/page.tsx">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-700 font-medium" data-unique-id="e0c8778e-e03d-4e59-b600-09048abbf828" data-file-name="app/notif-android/page.tsx"><span className="editable-text" data-unique-id="41f3fbf7-8257-4383-860d-8a27063202c0" data-file-name="app/notif-android/page.tsx">OneSignal Connected</span></span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" data-unique-id="9bfd790e-d5b5-43bc-8761-6cb46687cb06" data-file-name="app/notif-android/page.tsx" data-dynamic-text="true">
          {/* Main Form */}
          <div className="lg:col-span-2" data-unique-id="c2f46a82-2cb7-428d-a4fe-7d4c77495571" data-file-name="app/notif-android/page.tsx">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" data-unique-id="c94d00ad-4dbb-4ead-86dc-dbdcef38ad77" data-file-name="app/notif-android/page.tsx">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2" data-unique-id="4c742da6-c313-4d60-9af3-66f906eb5836" data-file-name="app/notif-android/page.tsx">
                <Send className="h-5 w-5 text-blue-500" />
                <span data-unique-id="6b9325f6-0980-4e61-9f6b-ead573b73ccd" data-file-name="app/notif-android/page.tsx"><span className="editable-text" data-unique-id="df59fb65-c036-48cc-8eb8-1df36cb21d47" data-file-name="app/notif-android/page.tsx">Kirim Push Notification</span></span>
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6" data-unique-id="143c8059-1029-421a-809e-3c3dc84de984" data-file-name="app/notif-android/page.tsx">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-unique-id="657fbf89-4968-411c-b76b-232a7040e838" data-file-name="app/notif-android/page.tsx">
                  <div className="md:col-span-2" data-unique-id="09ce043a-f769-4ca7-b29b-89f6782b89ef" data-file-name="app/notif-android/page.tsx">
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="title" data-unique-id="1bf931cb-fb82-4601-ba7f-b637dada6e9b" data-file-name="app/notif-android/page.tsx"><span className="editable-text" data-unique-id="503c107d-26ac-4f12-a0c1-318b713d55e4" data-file-name="app/notif-android/page.tsx">
                      Judul Notifikasi *
                    </span></label>
                    <input type="text" id="title" name="title" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" value={formData.title} onChange={handleChange} placeholder="Masukkan judul notifikasi" required maxLength={50} data-unique-id="c5373d12-ebb5-4ff3-ab99-61be97e7dce8" data-file-name="app/notif-android/page.tsx" />
                    <p className="text-xs text-gray-500 mt-1" data-unique-id="bf1ad0a3-27b9-4bef-ad0f-0064a025f2d4" data-file-name="app/notif-android/page.tsx" data-dynamic-text="true">
                      {formData.title.length}<span className="editable-text" data-unique-id="c3fc0dea-3d74-4e76-bb1d-a3e5996d4579" data-file-name="app/notif-android/page.tsx">/50 karakter
                    </span></p>
                  </div>

                  <div className="md:col-span-2" data-unique-id="cdc844b6-8019-45d3-b38f-793dbab1f70a" data-file-name="app/notif-android/page.tsx">
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="message" data-unique-id="88bec7ba-acdf-4bf0-b31a-487126b35f41" data-file-name="app/notif-android/page.tsx"><span className="editable-text" data-unique-id="87e4b632-9970-4a84-bfc2-692822fcb48f" data-file-name="app/notif-android/page.tsx">
                      Pesan Notifikasi *
                    </span></label>
                    <textarea id="message" name="message" rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" value={formData.message} onChange={handleChange} placeholder="Masukkan pesan notifikasi" required maxLength={200} data-unique-id="cee9b317-aa41-4e58-a09f-cf47725468f2" data-file-name="app/notif-android/page.tsx" />
                    <p className="text-xs text-gray-500 mt-1" data-unique-id="769b28b2-8b4b-47bf-a692-a9d8ef8bc1e1" data-file-name="app/notif-android/page.tsx" data-dynamic-text="true">
                      {formData.message.length}<span className="editable-text" data-unique-id="96bd28d1-b129-4f0f-8389-075d670afde9" data-file-name="app/notif-android/page.tsx">/200 karakter
                    </span></p>
                  </div>

                  <div data-unique-id="d36dc280-76fb-4148-85b1-546a9013ee25" data-file-name="app/notif-android/page.tsx">
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="badge" data-unique-id="62800e66-a84f-4f59-bfdc-f6af89470a9e" data-file-name="app/notif-android/page.tsx"><span className="editable-text" data-unique-id="0ed3a69d-7975-4b01-abe9-4827e4fbfb54" data-file-name="app/notif-android/page.tsx">
                      Badge Count (Icon)
                    </span></label>
                    <input type="number" id="badge" name="badge" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" value={formData.badge} onChange={handleChange} min="1" max="99" placeholder="1" data-unique-id="29b29762-92b9-4f96-a60f-74595bf2e247" data-file-name="app/notif-android/page.tsx" />
                    <p className="text-xs text-gray-500 mt-1" data-unique-id="83a4c71d-67d8-4ce8-bd30-28d6cf2a6f90" data-file-name="app/notif-android/page.tsx"><span className="editable-text" data-unique-id="42b3e2c5-1dee-4f14-8cc1-cd650e73d232" data-file-name="app/notif-android/page.tsx">
                      Angka pada icon aplikasi (1-99)
                    </span></p>
                  </div>

                  <div data-unique-id="35697123-f416-4213-b3d2-34bb99ab97f1" data-file-name="app/notif-android/page.tsx">
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="targetAudience" data-unique-id="ff334889-5ab3-4272-a0cc-c83e66c7e627" data-file-name="app/notif-android/page.tsx"><span className="editable-text" data-unique-id="011f307b-e7db-4d09-9eb9-473d5fae69a7" data-file-name="app/notif-android/page.tsx">
                      Target Audiens
                    </span></label>
                    <select id="targetAudience" name="targetAudience" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" value={formData.targetAudience} onChange={handleChange} data-unique-id="ba420b98-e088-49c4-9fa2-68ba635ed4a6" data-file-name="app/notif-android/page.tsx">
                      <option value="all" data-unique-id="9babbe34-7974-48b9-be92-d6993437a4d6" data-file-name="app/notif-android/page.tsx"><span className="editable-text" data-unique-id="65b3bac9-29a6-4e6e-8a92-4c423079e71e" data-file-name="app/notif-android/page.tsx">Semua Pengguna Android</span></option>
                      <option value="active" data-unique-id="40c068b5-5551-432d-a311-968d91ac4e7b" data-file-name="app/notif-android/page.tsx"><span className="editable-text" data-unique-id="28b00cca-d19b-4a7f-bdfd-9350b490bda8" data-file-name="app/notif-android/page.tsx">Pengguna Aktif (7 hari terakhir)</span></option>
                      <option value="inactive" data-unique-id="c1fdbf8d-ae13-48be-a194-8ca211b5ec28" data-file-name="app/notif-android/page.tsx"><span className="editable-text" data-unique-id="ee0c3521-2ccf-46fb-b8b3-3b3412938d68" data-file-name="app/notif-android/page.tsx">Pengguna Tidak Aktif</span></option>
                    </select>
                  </div>

                  <div className="md:col-span-2" data-unique-id="0fe8d3d3-edf9-4edc-b972-ca1a079a406e" data-file-name="app/notif-android/page.tsx">
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="url" data-unique-id="d402eb2d-5578-4a32-bf4b-6de495796544" data-file-name="app/notif-android/page.tsx"><span className="editable-text" data-unique-id="2089105c-9128-4347-a39e-5b6adc02d965" data-file-name="app/notif-android/page.tsx">
                      URL Tujuan (Opsional)
                    </span></label>
                    <input type="url" id="url" name="url" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" value={formData.url} onChange={handleChange} placeholder="https://example.com" data-unique-id="e7811ea8-7071-41f1-aeae-cf0103a20454" data-file-name="app/notif-android/page.tsx" />
                    <p className="text-xs text-gray-500 mt-1" data-unique-id="8982774a-6ae8-41cd-a998-d7ae8ef75072" data-file-name="app/notif-android/page.tsx"><span className="editable-text" data-unique-id="44bf8770-db1c-49ad-b342-1661ce6a1ee6" data-file-name="app/notif-android/page.tsx">
                      URL yang akan dibuka ketika notifikasi diklik
                    </span></p>
                  </div>

                  <div className="md:col-span-2" data-unique-id="a49b289e-fb3f-42b8-a01d-3cd2d91fa643" data-file-name="app/notif-android/page.tsx" data-dynamic-text="true">
                    <div className="flex items-center gap-3" data-unique-id="abf56e50-5c5e-4d17-8b35-22269db3242c" data-file-name="app/notif-android/page.tsx">
                      <input type="checkbox" id="scheduled" name="scheduled" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" checked={formData.scheduled} onChange={handleChange} data-unique-id="dae7ab6e-2322-45f9-83d6-126df7793689" data-file-name="app/notif-android/page.tsx" />
                      <label htmlFor="scheduled" className="text-sm font-medium text-gray-700" data-unique-id="f05ee644-f4e5-473b-bf08-989bec3cbc1a" data-file-name="app/notif-android/page.tsx"><span className="editable-text" data-unique-id="26a9cbd8-0eaf-471a-bad7-e820188e7f64" data-file-name="app/notif-android/page.tsx">
                        Jadwalkan Pengiriman
                      </span></label>
                    </div>
                    
                    {formData.scheduled && <div className="mt-3" data-unique-id="5dbb3b9f-0e6f-424a-be1f-63d0e5e3e7a2" data-file-name="app/notif-android/page.tsx">
                        <input type="datetime-local" id="scheduleTime" name="scheduleTime" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" value={formData.scheduleTime} onChange={handleChange} min={new Date().toISOString().slice(0, 16)} data-unique-id="d267e49c-cc0c-497c-a204-54f47cb1f6ae" data-file-name="app/notif-android/page.tsx" />
                      </div>}
                  </div>
                </div>

                <div className="pt-4" data-unique-id="7b8c0475-afb5-4ac6-9cb0-1995f62f2ba8" data-file-name="app/notif-android/page.tsx">
                  <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]" disabled={loading} data-unique-id="6c54ab11-b43b-413c-adcf-472453f98f79" data-file-name="app/notif-android/page.tsx" data-dynamic-text="true">
                    {loading ? <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" data-unique-id="501792fe-fcf1-4b82-af8a-41e04e6329f7" data-file-name="app/notif-android/page.tsx"></div>
                        <span data-unique-id="4df39a09-23de-4831-a58b-e14b5b9902a7" data-file-name="app/notif-android/page.tsx"><span className="editable-text" data-unique-id="e5db5814-4417-4d8d-bed9-1225227b7e6b" data-file-name="app/notif-android/page.tsx">Mengirim...</span></span>
                      </> : <>
                        <Send size={18} />
                        <span data-unique-id="3e8d3b1d-572a-401b-bb9e-bd2ae6c10426" data-file-name="app/notif-android/page.tsx"><span className="editable-text" data-unique-id="4621615c-56ad-4522-8355-c0ac314e1344" data-file-name="app/notif-android/page.tsx">Kirim Notifikasi ke Android</span></span>
                      </>}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6" data-unique-id="efdd0704-6003-4ee2-bb63-d7a15c76ab14" data-file-name="app/notif-android/page.tsx" data-dynamic-text="true">
            {/* Configuration Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" data-unique-id="5bf1b89e-ea2e-4462-9a19-5b89dfbca38e" data-file-name="app/notif-android/page.tsx">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2" data-unique-id="a276ccf7-e59f-4d95-a195-6c66febd2b03" data-file-name="app/notif-android/page.tsx">
                <Bell className="h-5 w-5 text-orange-500" />
                <span data-unique-id="9c42ff3e-eb13-4aa1-954d-f5fe1e518029" data-file-name="app/notif-android/page.tsx"><span className="editable-text" data-unique-id="8d8ada05-33ef-485e-ae6f-54b9646c0cdc" data-file-name="app/notif-android/page.tsx">Konfigurasi OneSignal</span></span>
              </h3>
              
              <div className="space-y-3" data-unique-id="406af282-5c10-46c0-91c6-f302aac99c52" data-file-name="app/notif-android/page.tsx">
                <div data-unique-id="58f03143-9b7d-4559-aa81-c1b7a673a0af" data-file-name="app/notif-android/page.tsx">
                  <label className="text-sm font-medium text-gray-600" data-unique-id="a73755d8-2e09-4d82-b398-2ffab094f655" data-file-name="app/notif-android/page.tsx"><span className="editable-text" data-unique-id="4dc65ace-adfb-42d1-ba5e-44caa17f5485" data-file-name="app/notif-android/page.tsx">App ID:</span></label>
                  <div className="bg-gray-50 p-3 rounded-lg text-sm font-mono break-all mt-1" data-unique-id="d358b22b-5f26-45bd-8130-a47556ad4750" data-file-name="app/notif-android/page.tsx" data-dynamic-text="true">
                    {ONESIGNAL_APP_ID}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 bg-green-50 p-3 rounded-lg" data-unique-id="1ba76ccb-8ca3-4152-94da-91056a150060" data-file-name="app/notif-android/page.tsx">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-green-700 font-medium" data-unique-id="00708236-8f39-4064-83f7-36a584c8b4df" data-file-name="app/notif-android/page.tsx"><span className="editable-text" data-unique-id="6a5ed785-786e-4c7f-8a98-5a587f56c3d4" data-file-name="app/notif-android/page.tsx">Terhubung dengan OneSignal</span></span>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" data-unique-id="00bc48ab-4482-4e28-bee1-45de131d8a5c" data-file-name="app/notif-android/page.tsx">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2" data-unique-id="311238af-e76f-4c05-9050-c53421de4e9b" data-file-name="app/notif-android/page.tsx">
                <Users className="h-5 w-5 text-blue-500" />
                <span data-unique-id="dca4ed71-5494-4fad-a032-2bd0cddd15bc" data-file-name="app/notif-android/page.tsx"><span className="editable-text" data-unique-id="f6aab518-b628-4d7d-adaf-1541fabfa1ca" data-file-name="app/notif-android/page.tsx">Statistik Pengiriman</span></span>
              </h3>
              
              <div className="space-y-3" data-unique-id="3c15b9f0-0067-4397-a1dc-e845a9acf2a2" data-file-name="app/notif-android/page.tsx">
                <div className="flex justify-between items-center" data-unique-id="696f0a0d-7a5c-4fa7-8cdc-4563f7df0543" data-file-name="app/notif-android/page.tsx">
                  <span className="text-sm text-gray-600" data-unique-id="acc3e10d-d0c6-4f10-abf3-f59c12977a23" data-file-name="app/notif-android/page.tsx"><span className="editable-text" data-unique-id="8267627a-91ee-4461-9421-c5f11c3648fd" data-file-name="app/notif-android/page.tsx">Total Terkirim Hari Ini</span></span>
                  <span className="font-semibold text-gray-800" data-unique-id="0da3326c-5ad4-4e22-9bca-d6581d9847c8" data-file-name="app/notif-android/page.tsx" data-dynamic-text="true">
                    {notificationHistory.filter(n => n.status === 'success' && new Date(n.timestamp).toDateString() === new Date().toDateString()).length}
                  </span>
                </div>
                <div className="flex justify-between items-center" data-unique-id="ef507b9c-0e1e-4440-a908-d7f3568de519" data-file-name="app/notif-android/page.tsx">
                  <span className="text-sm text-gray-600" data-unique-id="3cab9476-4aff-4cef-9438-2135c78dcf2c" data-file-name="app/notif-android/page.tsx"><span className="editable-text" data-unique-id="984ece2c-8287-4431-b1ec-112c3a2856bc" data-file-name="app/notif-android/page.tsx">Gagal Dikirim</span></span>
                  <span className="font-semibold text-red-600" data-unique-id="ed5f275a-422d-49b6-ae96-937090953ab6" data-file-name="app/notif-android/page.tsx" data-dynamic-text="true">
                    {notificationHistory.filter(n => n.status === 'error').length}
                  </span>
                </div>
                <div className="flex justify-between items-center" data-unique-id="bf96b53b-fe0f-4256-bf7e-32600d6ed5d4" data-file-name="app/notif-android/page.tsx">
                  <span className="text-sm text-gray-600" data-unique-id="330720d9-3c6c-4cc7-9ec7-9fd4605753c9" data-file-name="app/notif-android/page.tsx"><span className="editable-text" data-unique-id="8661a8e4-d043-44dc-a6ce-b6aba17975d1" data-file-name="app/notif-android/page.tsx">Total Penerima</span></span>
                  <span className="font-semibold text-green-600" data-unique-id="9a84cdca-4ef2-4129-a692-3dc87bd501ae" data-file-name="app/notif-android/page.tsx" data-dynamic-text="true">
                    {notificationHistory.reduce((sum, n) => sum + n.recipients, 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Notifications */}
            {notificationHistory.length > 0 && <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" data-unique-id="18d989ed-f996-4cca-b01e-0f32f333c574" data-file-name="app/notif-android/page.tsx">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2" data-unique-id="21e6ad79-1c62-4688-b4a4-fafe8d3dcb40" data-file-name="app/notif-android/page.tsx">
                  <AlertCircle className="h-5 w-5 text-purple-500" />
                  <span data-unique-id="1fac759e-2ee0-41a8-8efd-69506d431ada" data-file-name="app/notif-android/page.tsx"><span className="editable-text" data-unique-id="51362b96-cd92-4e50-a351-ffaafda64c98" data-file-name="app/notif-android/page.tsx">Riwayat Terakhir</span></span>
                </h3>
                
                <div className="space-y-3 max-h-60 overflow-y-auto" data-unique-id="de0fbe07-95bc-48bc-a1d1-048c466deb98" data-file-name="app/notif-android/page.tsx" data-dynamic-text="true">
                  {notificationHistory.slice(0, 5).map(item => <div key={item.id} className={`p-3 rounded-lg border-l-4 ${item.status === 'success' ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'}`} data-unique-id="42d29060-488a-421b-a3e0-fbde6fde16a2" data-file-name="app/notif-android/page.tsx">
                      <p className="font-medium text-sm text-gray-800 truncate" data-unique-id="e852d9e1-6c2f-4cad-81d2-ca61f7f04659" data-file-name="app/notif-android/page.tsx" data-dynamic-text="true">{item.title}</p>
                      <p className="text-xs text-gray-600 mt-1" data-unique-id="443292b2-af93-4163-9bc7-d58cc087b65e" data-file-name="app/notif-android/page.tsx" data-dynamic-text="true">
                        {new Date(item.timestamp).toLocaleString('id-ID')}
                      </p>
                      <div className="flex items-center justify-between mt-2" data-unique-id="a26aa20c-96cd-4cd5-a187-e735f9e7d4b9" data-file-name="app/notif-android/page.tsx">
                        <span className={`text-xs px-2 py-1 rounded-full ${item.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`} data-unique-id="768bad41-33ee-494e-84c4-896561789334" data-file-name="app/notif-android/page.tsx" data-dynamic-text="true">
                          {item.status === 'success' ? 'Berhasil' : 'Gagal'}
                        </span>
                        <span className="text-xs text-gray-500" data-unique-id="b46cda96-a3d5-4735-bce9-264d173b6083" data-file-name="app/notif-android/page.tsx" data-dynamic-text="true">
                          {item.recipients}<span className="editable-text" data-unique-id="bd0fb670-c0af-4210-9c9e-5cf8e00733f7" data-file-name="app/notif-android/page.tsx"> penerima
                        </span></span>
                      </div>
                    </div>)}
                </div>
              </div>}

            {/* Tips */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6" data-unique-id="f034511b-5a86-4899-8ea7-4690e6a72091" data-file-name="app/notif-android/page.tsx">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2" data-unique-id="0f92ab9d-5ea1-4d39-8c95-3976639d2e6f" data-file-name="app/notif-android/page.tsx">
                <Zap className="h-5 w-5" />
                <span data-unique-id="7720a1dd-c679-41a2-b5a1-de90b34dc8cc" data-file-name="app/notif-android/page.tsx"><span className="editable-text" data-unique-id="b07d237f-1991-4b91-b074-b602692ef962" data-file-name="app/notif-android/page.tsx">Tips Penggunaan</span></span>
              </h3>
              
              <div className="space-y-2 text-sm text-blue-700" data-unique-id="b393bfc8-4b86-46ac-89ef-3df1beb8767f" data-file-name="app/notif-android/page.tsx">
                <p data-unique-id="afebc789-2923-47b5-9f03-4648e4895f3f" data-file-name="app/notif-android/page.tsx"><span className="editable-text" data-unique-id="0af9ad03-1820-423e-8711-211d0583ecf1" data-file-name="app/notif-android/page.tsx">• Gunakan judul yang menarik perhatian</span></p>
                <p data-unique-id="52aae2eb-5dc6-467a-a147-d253906e697d" data-file-name="app/notif-android/page.tsx"><span className="editable-text" data-unique-id="abbec5f2-37ac-403f-9ca3-1a83f27d8e6c" data-file-name="app/notif-android/page.tsx">• Pesan singkat dan jelas (max 200 karakter)</span></p>
                <p data-unique-id="d8ca0e80-36a0-4b39-8361-2b4cf52b1141" data-file-name="app/notif-android/page.tsx"><span className="editable-text" data-unique-id="b0867c68-076a-47a7-9a17-d8c6b6de6a2f" data-file-name="app/notif-android/page.tsx">• Badge count membantu user melihat notifikasi baru</span></p>
                <p data-unique-id="5193a4c7-c43b-43ac-a12d-5e4e7a6ed6ce" data-file-name="app/notif-android/page.tsx"><span className="editable-text" data-unique-id="ae76e24c-2323-46a8-8146-e6970d64a152" data-file-name="app/notif-android/page.tsx">• URL optional untuk mengarahkan ke halaman tertentu</span></p>
                <p data-unique-id="c47e5e04-0fca-4e0f-8bde-8e818bcd9d1c" data-file-name="app/notif-android/page.tsx"><span className="editable-text" data-unique-id="87de6013-d098-4e5f-a6c0-7451366d1bed" data-file-name="app/notif-android/page.tsx">• Jadwalkan notifikasi untuk waktu optimal</span></p>
                <p data-unique-id="75a5bdc8-459a-4f16-8661-40cc9b51e963" data-file-name="app/notif-android/page.tsx"><span className="editable-text" data-unique-id="ced94c66-8db3-406d-8f8d-66f088becec4" data-file-name="app/notif-android/page.tsx">• Notifikasi akan muncul di semua device Android yang terdaftar</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>;
}
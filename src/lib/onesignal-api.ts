const ONESIGNAL_API_KEY = process.env.NEXT_PUBLIC_ONESIGNAL_API_KEY || "";
const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || "";
export async function sendNotification(
 message: string,
 title: string = "Absensi Digital",
 userIds?: string[],
 tags?: Record<string, string>,
 imageUrl?: string,
 actionButtons?: Array<{id: string, text: string, url?: string}>
) {
 const notification = {
   app_id: ONESIGNAL_APP_ID,
   contents: { en: message, id: message },
   headings: { en: title, id: title },
   ...(userIds && { include_player_ids: userIds }),
   ...(tags && {
     filters: Object.entries(tags).map(([key, value]) => ({
       field: "tag",
       key,
       relation: "=",
       value
     }))
   }),
   ...(imageUrl && {
     big_picture: imageUrl,
     large_icon: imageUrl,
     ios_attachments: { id: imageUrl }
   }),
   ...(actionButtons && {
     web_buttons: actionButtons,
     buttons: actionButtons
   })
 };
 try {
   const response = await fetch('https://onesignal.com/api/v1/notifications', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Basic ${ONESIGNAL_API_KEY}`
     },
     body: JSON.stringify(notification)
   });
   if (!response.ok) {
     throw new Error(`HTTP error! status: ${response.status}`);
   }
   const result = await response.json();
   return result;
 } catch (error) {
   console.error('Error sending OneSignal notification:', error);
   throw error;
 }
}
export async function sendAttendanceNotification(
 studentName: string,
 status: string,
 className: string,
 schoolId: string
) {
 const message = `${studentName} dari kelas ${className} telah melakukan absensi dengan status: ${status}`;
 return sendNotification(
   message,
   "Update Kehadiran Siswa",
   undefined,
   {
     school_id: schoolId,
     user_role: "admin"
   }
 );
}
export async function sendBulkNotification(
 message: string,
 title: string,
 schoolId?: string,
 targetRole?: string
) {
 const tags: Record<string, string> = {};
 if (schoolId) tags.school_id = schoolId;
 if (targetRole) tags.user_role = targetRole;
 return sendNotification(message, title, undefined, Object.keys(tags).length > 0 ? tags : undefined);
}
export async function getNotificationStats() {
 try {
   const response = await fetch(`https://onesignal.com/api/v1/apps/${ONESIGNAL_APP_ID}`, {
     method: 'GET',
     headers: {
       'Authorization': `Basic ${ONESIGNAL_API_KEY}`
     }
   });
   if (!response.ok) {
     throw new Error(`HTTP error! status: ${response.status}`);
   }
   const result = await response.json();
   return result;
 } catch (error) {
   console.error('Error getting OneSignal stats:', error);
   throw error;
 }
}

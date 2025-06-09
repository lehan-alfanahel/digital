import { NextRequest, NextResponse } from 'next/server'
const ONESIGNAL_APP_ID = 'c8ac779e-241b-4903-8ed4-6766936a4fee'
const ONESIGNAL_API_KEY = '•••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'
export async function POST(request: NextRequest) {
 try {
   const body = await request.json()
   const {
     title,
     message,
     imageUrl,
     launchUrl,
     audience,
     targetRole,
     scheduleType,
     scheduledTime
   } = body
   // Validate required fields
   if (!title || !message) {
     return NextResponse.json(
       { success: false, error: 'Title and message are required' },
       { status: 400 }
     )
   }
   // Prepare OneSignal notification payload
   const notificationPayload: any = {
     app_id: ONESIGNAL_APP_ID,
     headings: { en: title },
     contents: { en: message },
     included_segments: audience === 'all' ? ['All'] : undefined,
   }
   // Add image if provided
   if (imageUrl) {
     notificationPayload.big_picture = imageUrl
     notificationPayload.large_icon = imageUrl
   }
   // Add launch URL if provided
   if (launchUrl) {
     notificationPayload.url = launchUrl
   }
   // Handle role-based targeting
   if (audience === 'role' && targetRole) {
     notificationPayload.filters = [
       { field: 'tag', key: 'user_role', relation: '=', value: targetRole }
     ]
     delete notificationPayload.included_segments
   }
   // Handle scheduled delivery
   if (scheduleType === 'scheduled' && scheduledTime) {
     notificationPayload.send_after = scheduledTime
   }
   // Add additional OneSignal options for better delivery
   notificationPayload.android_accent_color = '4C6FFF'
   notificationPayload.android_visibility = 1
   notificationPayload.priority = 10
   notificationPayload.ttl = 259200 // 3 days
   // Send notification via OneSignal API
   const response = await fetch('https://onesignal.com/api/v1/notifications', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Basic ${ONESIGNAL_API_KEY}`,
     },
     body: JSON.stringify(notificationPayload),
   })
   const result = await response.json()
   if (response.ok) {
     return NextResponse.json({
       success: true,
       recipients: result.recipients || 0,
       id: result.id,
       message: 'Notification sent successfully'
     })
   } else {
     console.error('OneSignal API Error:', result)
     return NextResponse.json(
       {
         success: false,
         error: result.errors?.[0] || 'Failed to send notification'
       },
       { status: 400 }
     )
   }
 } catch (error) {
   console.error('Error sending notification:', error)
   return NextResponse.json(
     { success: false, error: 'Internal server error' },
     { status: 500 }
   )
 }
}
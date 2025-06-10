import { NextRequest, NextResponse } from 'next/server';
const ONESIGNAL_APP_ID = 'c8ac779e-241b-4903-8ed4-6766936a4fee';
const ONESIGNAL_API_KEY = 'os_v2_app_zcwhphredneqhdwum5tjg2sp5zlobxnaq2oegheswznxni45eipldyel2hh5hbjrqctcbv2oy6fjs66u26ywel323msitf4r5l2u2ui';
export async function POST(request: NextRequest) {
 try {
   const body = await request.json();
   const {
     title,
     message,
     targetSegment = 'All',
     url = '',
     imageUrl = '',
     actionButtons = [],
     scheduledTime = ''
   } = body;
   // Validate required fields
   if (!title || !message) {
     return NextResponse.json({
       success: false,
       error: 'Title and message are required'
     }, { status: 400 });
   }
   // Prepare notification data
   const notificationData: any = {
     app_id: ONESIGNAL_APP_ID,
     headings: {
       "en": title,
       "id": title
     },
     contents: {
       "en": message,
       "id": message
     },
     data: {
       url: url || process.env.NEXT_PUBLIC_APP_URL || ''
     }
   };
   // Add large image if provided
   if (imageUrl) {
     notificationData.big_picture = imageUrl;
     notificationData.chrome_web_image = imageUrl;
     notificationData.adm_big_picture = imageUrl;
   }
   // Add action buttons if provided
   if (actionButtons.length > 0) {
     notificationData.web_buttons = actionButtons.map((button: any, index: number) => ({
       id: `btn_${index}`,
       text: button.text,
       url: button.url
     }));
 notificationData.buttons = actionButtons.map((button: any, index: number) => ({
   id: `btn_${index}`,
   text: button.text,
   url: button.url
 }));

}
// Set target audience based on segment
switch (targetSegment) {
case 'All':
notificationData.included_segments = ["Subscribed Users"];
break;
case 'Active Users':
notificationData.filters = [
{ field: "last_session", relation: ">", hours_ago: 24 }
];
break;
case 'Engaged Users':
notificationData.filters = [
{ field: "session_count", relation: ">", value: 5 }
];
break;
case 'Inactive Users':
notificationData.filters = [
{ field: "last_session", relation: ">", hours_ago: 168 } // 7 days
];
break;
default:
notificationData.included_segments = ["Subscribed Users"];
}
// Schedule notification if time is provided
if (scheduledTime) {
const sendTime = new Date(scheduledTime);
if (sendTime > new Date()) {
notificationData.send_after = sendTime.toISOString();
}
}
// Send notification via OneSignal API
const response = await fetch('https://onesignal.com/api/v1/notifications', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'Authorization': Basic ${ONESIGNAL_API_KEY}
},
body: JSON.stringify(notificationData)
});
const result = await response.json();
if (response.ok) {
return NextResponse.json({
success: true,
id: result.id,
recipients: result.recipients || 0,
message: 'Notification sent successfully'
});
} else {
console.error('OneSignal API Error:', result);
return NextResponse.json({
success: false,
error: result.errors?.[0] || 'Failed to send notification'
}, { status: 400 });
}
} catch (error) {
console.error('Error sending notification:', error);
return NextResponse.json({
success: false,
error: 'Internal server error'
}, { status: 500 });
}
}

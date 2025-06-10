
import { NextRequest, NextResponse } from 'next/server';
const ONESIGNAL_APP_ID = 'c8ac779e-241b-4903-8ed4-6766936a4fee';
const ONESIGNAL_API_KEY = 'os_v2_app_zc4yMDY3ZC1mMGZjLTRlYTktYmFiNC0xZTJlZWJhOWI2YjE2ZWRlYzdjMS1iNzExLTQwNDItYWY2My01ZDZjOGYwZDM2M2Yy2ui';
export async function POST(request: NextRequest) {
try {
const body = await request.json();
const { action, data } = body;
let url = '';
let method = 'POST';
let requestBody: any = {};
switch (action) {
case 'send_notification':
url = 'https://onesignal.com/api/v1/notifications';
requestBody = {
app_id: ONESIGNAL_APP_ID,
included_segments: ['All'],
headings: { en: data.title },
contents: { en: data.message },
...data
};
break;


 case 'get_app_stats':
   url = `https://onesignal.com/api/v1/apps/${ONESIGNAL_APP_ID}`;
   method = 'GET';
   break;

 case 'get_notifications':
   url = `https://onesignal.com/api/v1/notifications?app_id=${ONESIGNAL_APP_ID}&limit=50`;
   method = 'GET';
   break;

 default:
   return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

}
const options: RequestInit = {
method,
headers: {
'Content-Type': 'application/json',
'Authorization': Basic ${ONESIGNAL_API_KEY},
},
};
if (method !== 'GET') {
options.body = JSON.stringify(requestBody);
}
const response = await fetch(url, options);
const result = await response.json();
if (!response.ok) {
console.error('OneSignal API Error:', result);
return NextResponse.json({ error: result }, { status: response.status });
}
return NextResponse.json({ success: true, data: result });
} catch (error) {
console.error('OneSignal proxy error:', error);
return NextResponse.json(
{ error: 'Internal server error' },
{ status: 500 }
);
}
}
export async function GET(request: NextRequest) {
try {
const searchParams = request.nextUrl.searchParams;
const action = searchParams.get('action');
let url = '';
switch (action) {
case 'app_stats':
url = https://onesignal.com/api/v1/apps/${ONESIGNAL_APP_ID};
break;


 case 'notifications':
   url = `https://onesignal.com/api/v1/notifications?app_id=${ONESIGNAL_APP_ID}&limit=50`;
   break;

 default:
   return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

}
const response = await fetch(url, {
headers: {
'Authorization': Basic ${ONESIGNAL_API_KEY},
},
});
const result = await response.json();
if (!response.ok) {
console.error('OneSignal API Error:', result);
return NextResponse.json({ error: result }, { status: response.status });
}
return NextResponse.json({ success: true, data: result });
} catch (error) {
console.error('OneSignal proxy error:', error);
return NextResponse.json(
{ error: 'Internal server error' },
{ status: 500 }
);
}
}
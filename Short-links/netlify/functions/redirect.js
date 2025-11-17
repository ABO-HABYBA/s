const firebase = require('firebase-admin');

// تهيئة Firebase Admin SDK
// ملاحظة: نحن نقرأ معلومات الحساب من متغيرات البيئة (Environment Variables)
// هذه هي الطريقة الآمنة والصحيحة للإنتاج.
if (!firebase.apps.length) {
  firebase.initializeApp({
    credential: firebase.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // استبدل \n بأسطر حقيقية للمفتاح الخاص
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

const db = firebase.firestore();

exports.handler = async (event, context) => {
  const { queryStringParameters } = event;
  const shortCode = queryStringParameters ? queryStringParameters.s : null;

  // إذا لم يكن هناك كود اختصار، فهذا يعني أن المستخدم يزور الصفحة الرئيسية
  // قدم له ملف index.html
  if (!shortCode) {
    // في Netlify Functions، لا يمكننا قراءة الملفات مباشرة بهذه الطريقة
    // الحل الأسهل هو إعادة توجيه الطلبات التي لا تحتوي على ?s= إلى index.html
    // سنقوم بتعديل ملف _redirects لاحقاً لتحقيق ذلك
    // لكن كبديل، يمكننا إرجاع صفحة بسيطة تعيد التوجيه
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Redirecting...</title>
          <script>
            // إذا لم يكن هناك ?s=، أعد تحميل الصفحة بدون أي بارامترات
            if (window.location.search) {
              window.location.href = window.location.origin + window.location.pathname;
            }
          </script>
        </head>
        <body>
          <p>Loading...</p>
        </body>
        </html>
      `
    };
  }

  try {
    const docRef = db.collection('shortLinks').where('shortCode', '==', shortCode);
    const snapshot = await docRef.get();

    if (snapshot.empty) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Short URL not found' }),
      };
    }

    const doc = snapshot.docs[0];
    const urlEntry = doc.data();
    const originalUrl = urlEntry.originalUrl;

    // زيادة عدد النقرات
    await doc.ref.update({ clicks: firebase.firestore.FieldValue.increment(1) });

    // هنا السحر: إرجاع توجيه حقيقي من الخادم
    return {
      statusCode: 302, // 302 للتحويل المؤقت
      headers: {
        'Location': originalUrl,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    };

  } catch (error) {
    console.error('Redirect error:', error);
    return { statusCode: 500, body: 'Internal Server Error' };
  }
};
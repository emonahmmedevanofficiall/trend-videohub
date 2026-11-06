const { Telegraf, Markup } = require('telegraf');
const admin = require('firebase-admin');
const http = require('http');

// ==========================================
// ১. আপনার সেটিংস ও কনফিগারেশন দিন
// ==========================================
const BOT_TOKEN = process.env.BOT_TOKEN || '8880831345:AAErp3Fjvv1pEzZ49y4TJP4jni40k0nEJuQ'; // BotFather থেকে পাওয়া টোকেন
const BOT_USERNAME = process.env.BOT_USERNAME || '@BDViralTubeBot'; // আপনার বটের ইউজারনেম (@ ছাড়া)
const MINI_APP_URL = 'https://emonahmmedevanofficiall.github.io/trend-videohub/'; // GitHub Pages-এর লিংক
const ADMIN_GROUP_ID = process.env.ADMIN_GROUP_ID || '-1004416355782'; // এডমিন গ্রুপের আইডি

// ==========================================
// ২. ফায়ারবেস অ্যাডমিন ইনিশিয়ালাইজেশন
// ==========================================
let db;
try {
  const serviceAccount = require('./serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://trendingviralhubbot-default-rtdb.firebaseio.com"
  });
  db = admin.firestore();
  console.log('✅ Firebase Admin Connected Successfully!');
} catch (error) {
  console.warn('⚠️ serviceAccountKey.json ফাইল পাওয়া যায়নি। ডিটেলস চেক করুন।');
}

// ==========================================
// ৩. Render-এর জন্য HTTP সার্ভার (Port Binding)
// ==========================================
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Trend Video Hub Bot is Active and Running 24/7 on Render!');
}).listen(PORT, () => {
  console.log(`🌐 Web server is listening on port ${PORT}`);
});

// ==========================================
// ৪. টেলিগ্রাম বট লজিক
// ==========================================
const bot = new Telegraf(BOT_TOKEN);

// রেফারেল ও ডিপ-লিংকিং হ্যান্ডলার (/start)
bot.start(async (ctx) => {
  try {
    const startPayload = ctx.startPayload; // যেমন: "1" অথবা "ref_123_video_1"
    const user = ctx.from;

    if (db) {
      const userRef = db.collection('users').doc(String(user.id));
      const doc = await userRef.get();

      if (!doc.exists) {
        await userRef.set({
          userId: String(user.id),
          name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
          username: user.username || '',
          balance: 10,
          totalEarnings: 10,
          referralsCount: 0,
          referredBy: (startPayload && startPayload.startsWith('ref_')) ? startPayload.split('_')[1] : null,
          badges: ['Newbie'],
          isBanned: false,
          lastLogin: admin.firestore.FieldValue.serverTimestamp(),
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
      } else {
        await userRef.update({ lastLogin: admin.firestore.FieldValue.serverTimestamp() });
      }
    }

    let startParam = 'home';
    let buttonText = '🚀 ওপেন Trend Video Hub';

    if (startPayload) {
      if (!isNaN(startPayload)) {
        startParam = `ref_${user.id}_video_${startPayload}`;
        buttonText = `👀 ভিডিও দেখুন #${startPayload}`;
      } else {
        startParam = startPayload;
      }
    }

    const appDirectUrl = `https://t.me/${BOT_USERNAME}/app?startapp=${startParam}`;

    await ctx.reply(
      `👋 স্বাগতম ${user.first_name}!\n\n🔥 **Trend Video Hub** এ আপনাকে স্বাগতম। ভিডিও দেখুন, টাস্ক পূরণ করুন এবং bKash/Nagad এ টাকা উত্তোলন করুন!`,
      {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [Markup.button.webApp(buttonText, `${MINI_APP_URL}?tgWebAppStartParam=${startParam}`)],
          [Markup.button.url('⚡ Direct Launch Link', appDirectUrl)]
        ])
      }
    );
  } catch (err) {
    console.error('Start error:', err);
  }
});

// লাইভ সাপোর্ট কমান্ড (/support)
bot.command('support', async (ctx) => {
  try {
    const user = ctx.from;
    const message = ctx.message.text.replace('/support', '').trim();

    if (!message) {
      return ctx.reply('⚠️ সাপোর্টের জন্য লিখুন: `/support আপনার সমস্যার বিবরণ`', { parse_mode: 'Markdown' });
    }

    if (ADMIN_GROUP_ID && ADMIN_GROUP_ID !== '-100xxxxxxxxxx') {
      await bot.telegram.sendMessage(
        ADMIN_GROUP_ID,
        `📩 **New Support Ticket**\n👤 User: [${user.first_name}](tg://user?id=${user.id})\n🆔 ID: \`${user.id}\`\n💬 Message: ${message}`,
        { parse_mode: 'Markdown' }
      );
    }

    ctx.reply('✅ আপনার মেসেজটি অ্যাডমিনদের কাছে পাঠানো হয়েছে। শীঘ্রই রিপ্লাই পাবেন।');
  } catch (err) {
    console.error('Support error:', err);
  }
});

// অটো-ব্রডকাস্ট ফাংশন (দৈনিক সর্বোচ্চ ৩টি)
async function triggerAutoBroadcast(videoId) {
  if (!db) return false;
  try {
    const todayStr = new Date().toISOString().slice(0, 10);
    const settingsRef = db.collection('settings').doc('broadcast_control');
    const settingsDoc = await settingsRef.get();
    
    let broadcastCount = 0;
    if (settingsDoc.exists && settingsDoc.data().lastDate === todayStr) {
      broadcastCount = settingsDoc.data().count || 0;
    }

    if (broadcastCount >= 3) {
      console.log('⚠️ আজকের ৩টি ব্রডকাস্টের লিমিট শেষ।');
      return false;
    }

    const videoRef = db.collection('videos').doc(videoId);
    const videoSnap = await videoRef.get();
    if (!videoSnap.exists) return false;
    const videoData = videoSnap.data();

    const caption = `🎁 প্রিয় বন্ধু, ভিডিওটি মিস করবেন না! / Watch Now!\n📍 Title: ${videoData.title || 'Exclusive Video'}\n🚀 ভিডিওটি দেখুন এবং প্রচুর ইনকাম করুন!`;

    const inlineKeyboard = Markup.inlineKeyboard([
      [Markup.button.url('👀 ডেমো দেখুন (Demo)', videoData.demoUrl || 'https://google.com')],
      [Markup.button.url('🚀 ফুল ভিডিও দেখুন (Watch Now)', `https://t.me/${BOT_USERNAME}/app?startapp=watch_${videoId}`)],
      [Markup.button.url('💡 কীভাবে ভিডিও দেখতে হয়? (Tutorial)', 'https://t.me/YourBotTutorialChannel')]
    ]);

    const usersSnap = await db.collection('users').where('isBanned', '==', false).get();
    for (const doc of usersSnap.docs) {
      try {
        if (videoData.thumbnailUrl) {
          await bot.telegram.sendPhoto(doc.id, videoData.thumbnailUrl, { caption, ...inlineKeyboard });
        } else {
          await bot.telegram.sendMessage(doc.id, caption, inlineKeyboard);
        }
      } catch (err) {
        // ব্লক করা ইউজারদের মেসেজ স্কিপ
      }
    }

    await settingsRef.set({ lastDate: todayStr, count: broadcastCount + 1 }, { merge: true });
    return true;
  } catch (error) {
    console.error('Broadcast Error:', error);
    return false;
  }
}

// অ্যাডমিনের জন্য ম্যানুয়াল ব্রডকাস্ট কমান্ড: /broadcast VIDEO_ID
bot.command('broadcast', async (ctx) => {
  const videoId = ctx.message.text.split(' ')[1];
  if (!videoId) return ctx.reply('Use: /broadcast <video_id>');

  ctx.reply('⏳ ব্রডকাস্ট শুরু হচ্ছে...');
  const success = await triggerAutoBroadcast(videoId);
  if (success) {
    ctx.reply('✅ ব্রডকাস্ট সফল হয়েছে!');
  } else {
    ctx.reply('❌ ব্রডকাস্ট সম্পন্ন করা যায়নি।');
  }
});

// বট চালু করা
bot.launch().then(() => {
  console.log('🚀 Telegram Bot is live and running!');
}).catch((err) => {
  console.error('Bot launch failed:', err.message);
});

// প্রসেস হ্যান্ডলার
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

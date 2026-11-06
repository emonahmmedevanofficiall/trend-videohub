<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Trend Video Hub</title>
  
  <!-- Telegram WebApp SDK -->
  <script src="https://telegram.org/js/telegram-web-app.js"></script>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Font Awesome Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            gold: '#F59E0B',
            darkBg: '#0F172A',
            cardBg: '#1E293B',
            borderDark: '#334155'
          }
        }
      }
    }
  </script>

  <style>
    /* Blogger এর ডিফল্ট স্টাইল হাইড করা এবং অ্যাপ লুক দেওয়া */
    html, body {
      background-color: #0F172A !important;
      color: #F8FAFC !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      margin: 0 !important;
      padding: 0 !important;
      overflow-x: hidden;
    }
    .custom-scroll::-webkit-scrollbar { display: none; }
    .custom-scroll { -ms-overflow-style: none; scrollbar-width: none; }
  </style>
</head>
<body class="custom-scroll pb-24">

  <!-- টপ নেভিগেশন ও ইউজার প্রফাইল সেকশন -->
  <header class="sticky top-0 z-40 bg-cardBg/95 backdrop-blur-md border-b border-borderDark px-4 py-3 flex items-center justify-between">
    <div class="flex items-center space-x-3">
      <img id="user-avatar" src="https://i.ibb.co/mJR3QxG/user.png" class="w-10 h-10 rounded-full border-2 border-gold object-cover" />
      <div>
        <div class="flex items-center space-x-1.5">
          <h2 id="user-name" class="font-bold text-sm leading-tight text-white">লোড হচ্ছে...</h2>
          <span id="badge-container" class="flex space-x-1"></span>
        </div>
        <p class="text-xs text-gray-400">ব্যালেন্স: <span id="user-balance" class="text-gold font-extrabold text-sm">0</span> Coins</p>
      </div>
    </div>
    <button onclick="switchTab('profile')" class="bg-indigo-600 hover:bg-indigo-700 active:scale-95 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center shadow-lg transition">
      <i class="fa-solid fa-wallet mr-1.5 text-gold"></i> ওয়ালেট
    </button>
  </header>

  <!-- নিউজ টিকার -->
  <div class="bg-indigo-950/70 border-b border-indigo-800/40 px-3 py-1.5 flex items-center text-xs text-indigo-200">
    <i class="fa-solid fa-bullhorn text-gold mr-2 animate-bounce"></i>
    <marquee class="font-medium">ভিডিও দেখে ও টাস্ক সম্পন্ন করে সরাসরি bKash এবং Nagad এ পেমেন্ট নিন! রেফার করে পান ৫০ কয়েন!</marquee>
  </div>

  <!-- মূল কনটেন্ট কন্টেইনার -->
  <main class="p-4 max-w-lg mx-auto">
    
    <!-- ট্যাব ১: ভিডিও সেকশন -->
    <section id="tab-videos" class="tab-content space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-bold text-white flex items-center">
          <i class="fa-solid fa-play-circle text-gold mr-2"></i> ট্রেন্ডিং ভিডিও
        </h3>
        <span class="text-[11px] text-gray-400">প্রতি ভিউ = ৫ কয়েন</span>
      </div>
      <div id="videos-grid" class="grid grid-cols-1 gap-4">
        <div class="animate-pulse bg-cardBg h-48 rounded-xl border border-borderDark flex items-center justify-center text-xs text-gray-500">
          ভিডিও লোড হচ্ছে...
        </div>
      </div>
    </section>

    <!-- ট্যাব ২: টাস্ক মার্কেটপ্লেস -->
    <section id="tab-tasks" class="tab-content hidden space-y-4">
      <div class="flex justify-between items-center">
        <h3 class="text-sm font-bold text-white flex items-center">
          <i class="fa-solid fa-list-check text-gold mr-2"></i> টাস্ক মার্কেটপ্লেস
        </h3>
        <button onclick="openModal('create-task-modal')" class="bg-gold hover:bg-amber-500 text-darkBg font-bold text-xs px-3 py-1.5 rounded-md transition shadow">
          + নতুন টাস্ক দিন
        </button>
      </div>
      <div id="tasks-list" class="space-y-3">
        <!-- টাস্ক লোড হবে -->
      </div>
    </section>

    <!-- ট্যাব ৩: লিডারবোর্ড -->
    <section id="tab-leaderboard" class="tab-content hidden space-y-4">
      <div class="text-center py-3 bg-gradient-to-r from-indigo-900 to-purple-900 rounded-xl border border-indigo-700/50">
        <h3 class="text-sm font-bold text-gold"><i class="fa-solid fa-trophy mr-1"></i> টপ আর্নার লিডারবোর্ড</h3>
        <p class="text-[11px] text-gray-300">সবচেয়ে বেশি ইনকামকারী সেরা ১০ জন সদস্য</p>
      </div>
      <div id="leaderboard-list" class="bg-cardBg rounded-xl border border-borderDark divide-y divide-borderDark">
        <!-- লিডারবোর্ড লোড হবে -->
      </div>
    </section>

    <!-- ট্যাব ৪: প্রোফাইল ও উইথড্র -->
    <section id="tab-profile" class="tab-content hidden space-y-4">
      <div class="bg-cardBg p-4 rounded-xl border border-borderDark text-center">
        <div class="text-3xl font-black text-gold mb-1" id="profile-balance">0</div>
        <p class="text-xs text-gray-400 mb-3">মোট কয়েন ব্যালেন্স</p>
        <div class="grid grid-cols-2 gap-2 text-xs border-t border-borderDark pt-3">
          <div>
            <span class="text-gray-400 block">মোট লাইফটাইম আয়</span>
            <span class="font-bold text-white text-sm" id="profile-total-earnings">0</span>
          </div>
          <div>
            <span class="text-gray-400 block">রেফারেল সংখ্যা</span>
            <span class="font-bold text-white text-sm" id="profile-referrals">0</span>
          </div>
        </div>
      </div>

      <!-- রেফার লিংক বক্স -->
      <div class="bg-cardBg p-3 rounded-xl border border-borderDark space-y-2">
        <h4 class="text-xs font-bold text-gray-200">আপনার রেফারেল লিংক (প্রতি রেফারে ৫০ কয়েন)</h4>
        <div class="flex items-center space-x-2">
          <input type="text" id="ref-link-input" readonly class="w-full bg-darkBg text-xs text-gray-300 px-3 py-2 rounded border border-borderDark focus:outline-none" />
          <button onclick="copyRefLink()" class="bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded text-xs font-bold text-white transition">Copy</button>
        </div>
      </div>

      <!-- উইথড্র ফরম -->
      <div class="bg-cardBg p-4 rounded-xl border border-borderDark space-y-3">
        <h4 class="text-sm font-bold text-white flex items-center">
          <i class="fa-solid fa-money-bill-transfer text-gold mr-2"></i> টাকা তুলুন (Withdraw)
        </h4>
        <p class="text-[11px] text-gray-400">সর্বনিম্ন উইথড্র: ৫০০ Coins = ৫০ টাকা</p>
        
        <div>
          <label class="text-xs text-gray-300 block mb-1">পেমেন্ট মেথড সিলেক্ট করুন</label>
          <select id="withdraw-method" class="w-full bg-darkBg border border-borderDark rounded p-2 text-xs text-white focus:outline-none">
            <option value="bKash">bKash (Personal)</option>
            <option value="Nagad">Nagad (Personal)</option>
          </select>
        </div>

        <div>
          <label class="text-xs text-gray-300 block mb-1">একাউন্ট নাম্বার</label>
          <input type="tel" id="withdraw-account" placeholder="017xxxxxxxx" class="w-full bg-darkBg border border-borderDark rounded p-2 text-xs text-white focus:outline-none" />
        </div>

        <div>
          <label class="text-xs text-gray-300 block mb-1">কয়েন পরিমাণ</label>
          <input type="number" id="withdraw-amount" placeholder="Min 500" class="w-full bg-darkBg border border-borderDark rounded p-2 text-xs text-white focus:outline-none" />
        </div>

        <button onclick="requestWithdrawal()" id="withdraw-btn" class="w-full bg-gold hover:bg-amber-600 active:scale-95 text-darkBg font-bold text-xs py-2.5 rounded shadow transition">
          উইথড্র রিকোয়েস্ট পাঠান
        </button>
      </div>
    </section>

  </main>

  <!-- ফ্লোটিং লাইভ সাপোর্ট বাটন -->
  <a href="https://t.me/trendingviralhubbot?start=support" target="_blank" class="fixed bottom-20 right-4 bg-indigo-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-2xl border-2 border-indigo-400 z-40 hover:scale-105 active:scale-95 transition">
    <i class="fa-solid fa-headset text-lg"></i>
  </a>

  <!-- বটম ফিক্সড নেভিগেশন বার -->
  <nav class="fixed bottom-0 left-0 right-0 bg-cardBg/95 backdrop-blur-lg border-t border-borderDark px-4 py-2 flex justify-around items-center z-40">
    <button onclick="switchTab('videos')" id="nav-videos" class="flex flex-col items-center text-gold text-xs">
      <i class="fa-solid fa-video text-base mb-1"></i> ভিডিও
    </button>
    <button onclick="switchTab('tasks')" id="nav-tasks" class="flex flex-col items-center text-gray-400 text-xs">
      <i class="fa-solid fa-tasks text-base mb-1"></i> টাস্ক
    </button>
    <button onclick="switchTab('leaderboard')" id="nav-leaderboard" class="flex flex-col items-center text-gray-400 text-xs">
      <i class="fa-solid fa-trophy text-base mb-1"></i> লিডারবোর্ড
    </button>
    <button onclick="switchTab('profile')" id="nav-profile" class="flex flex-col items-center text-gray-400 text-xs">
      <i class="fa-solid fa-user text-base mb-1"></i> ওয়ালেট
    </button>
  </nav>

  <!-- ১. ভিডিও প্লেয়ার ও কমেন্ট মডাল -->
  <div id="video-modal" class="fixed inset-0 bg-black/95 z-50 hidden flex flex-col justify-between overflow-y-auto">
    <div class="p-3 flex justify-between items-center border-b border-borderDark bg-cardBg">
      <h3 id="modal-video-title" class="text-xs font-bold truncate pr-4 text-white">ভিডিও</h3>
      <button onclick="closeVideoModal()" class="text-gray-400 hover:text-white text-lg"><i class="fa-solid fa-xmark"></i></button>
    </div>

    <div class="relative bg-black w-full aspect-video flex items-center justify-center">
      <video id="native-player" controls class="w-full h-full" playsinline></video>
    </div>

    <!-- কমেন্ট সেকশন -->
    <div class="flex-1 p-4 bg-cardBg space-y-3">
      <div class="flex justify-between items-center">
        <h4 class="text-xs font-bold text-gray-300">মন্তব্য (কমেন্ট করতে ১ কয়েন কাটা হবে)</h4>
        <button id="modal-share-btn" class="bg-indigo-600 px-3 py-1 rounded text-xs text-white"><i class="fa-solid fa-share-nodes mr-1"></i> শেয়ার</button>
      </div>
      
      <div class="flex space-x-2">
        <input type="text" id="comment-input" placeholder="আপনার মন্তব্য লিখুন..." class="flex-1 bg-darkBg border border-borderDark rounded px-3 py-1.5 text-xs text-white focus:outline-none" />
        <button onclick="postComment()" class="bg-gold text-darkBg font-bold px-3 py-1.5 rounded text-xs">সেন্ড</button>
      </div>

      <div id="comments-container" class="space-y-2 max-h-48 overflow-y-auto pr-1">
        <!-- কমেন্ট লোড হবে -->
      </div>
    </div>
  </div>

  <!-- ২. টাস্ক তৈরি করার মডাল -->
  <div id="create-task-modal" class="fixed inset-0 bg-black/85 z-50 hidden flex items-center justify-center p-4">
    <div class="bg-cardBg border border-borderDark p-4 rounded-xl w-full max-w-sm space-y-3">
      <div class="flex justify-between items-center">
        <h4 class="text-sm font-bold text-white">নতুন টাস্ক দিন</h4>
        <button onclick="closeModal('create-task-modal')" class="text-gray-400 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <input type="text" id="task-title" placeholder="কাজের শিরোনাম (যেমন: চ্যানেল সাবস্ক্রাইব)" class="w-full bg-darkBg border border-borderDark rounded p-2 text-xs text-white focus:outline-none" />
      <input type="url" id="task-link" placeholder="কাজের লিংক (URL)" class="w-full bg-darkBg border border-borderDark rounded p-2 text-xs text-white focus:outline-none" />
      <div class="grid grid-cols-2 gap-2">
        <input type="number" id="task-users" placeholder="মোট মেম্বার সংখ্যা" class="bg-darkBg border border-borderDark rounded p-2 text-xs text-white focus:outline-none" />
        <input type="number" id="task-reward" placeholder="প্রতি রিওয়ার্ড (Coins)" class="bg-darkBg border border-borderDark rounded p-2 text-xs text-white focus:outline-none" />
      </div>
      <button onclick="submitNewTask()" class="w-full bg-gold hover:bg-amber-600 text-darkBg font-bold py-2 rounded text-xs transition">পাবলিশ করুন</button>
    </div>
  </div>

  <!-- ৩. টাস্ক স্ক্রিনশট প্রুফ সাবমিট মডাল -->
  <div id="proof-modal" class="fixed inset-0 bg-black/85 z-50 hidden flex items-center justify-center p-4">
    <div class="bg-cardBg border border-borderDark p-4 rounded-xl w-full max-w-sm space-y-3">
      <div class="flex justify-between items-center">
        <h4 class="text-sm font-bold text-white">কাজের প্রমাণ জমা দিন</h4>
        <button onclick="closeModal('proof-modal')" class="text-gray-400 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <p class="text-xs text-gray-400">কাজের স্ক্রিনশট সিলেক্ট করে সাবমিট করুন:</p>
      <input type="file" id="proof-file" accept="image/*" class="w-full text-xs text-gray-400 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-indigo-600 file:text-white" />
      <button onclick="submitProofAction()" id="proof-submit-btn" class="w-full bg-gold hover:bg-amber-600 text-darkBg font-bold py-2 rounded text-xs transition">সাবমিট প্রুফ</button>
    </div>
  </div>

  <!-- ৪. অ্যাড-গেট ওভারলে (৮ সেকেন্ড ফালব্যাক) -->
  <div id="ad-gate-overlay" class="fixed inset-0 bg-black/95 z-[99] hidden flex flex-col items-center justify-center p-6 text-center">
    <div class="animate-spin text-gold text-4xl mb-3"><i class="fa-solid fa-circle-notch"></i></div>
    <h3 class="text-sm font-bold text-white mb-1">বিজ্ঞাপন লোড হচ্ছে...</h3>
    <p class="text-xs text-gray-400 mb-4">ভিডিও চালু হতে কয়েক সেকেন্ড অপেক্ষা করুন।</p>
    <div class="text-xs bg-cardBg px-4 py-2 rounded border border-borderDark text-gold font-bold">
      স্কিপ হবে: <span id="ad-timer">8</span> সেকেন্ডে
    </div>
  </div>

  <!-- Firebase SDK ও অ্যাপ লজিক -->
  <script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
    import { 
      getFirestore, doc, getDoc, setDoc, updateDoc, collection, 
      query, orderBy, limit, onSnapshot, addDoc, serverTimestamp, 
      increment, getDocs, where 
    } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

    // আপনার Firebase কনফিগারেশন
    const firebaseConfig = {
      apiKey: "AIzaSyBNSeiIyKhPdorvq8DPAJZMlCsS3a77J88",
      authDomain: "trendingviralhubbot.firebaseapp.com",
      databaseURL: "https://trendingviralhubbot-default-rtdb.firebaseio.com",
      projectId: "trendingviralhubbot",
      storageBucket: "trendingviralhubbot.firebasestorage.app",
      messagingSenderId: "939338453765",
      appId: "1:939338453765:web:c572e70e3f981ae2555d6c"
    };

    // আপনার দেওয়া ImgBB API Key
    const IMGBB_API_KEY = "e264dbbe63b933222d3ffcfe0b599747";

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // Telegram WebApp ডাটা
    const tg = window.Telegram?.WebApp;
    if (tg) { 
      tg.expand();
      tg.ready();
    }

    // টেলিগ্রাম থেকে ইউজার তথ্য নেওয়া (না থাকলে টেস্ট ইউজার)
    const tgUser = tg?.initDataUnsafe?.user || {
      id: 99887766,
      first_name: "Demo",
      last_name: "User",
      username: "demouser",
      photo_url: "https://i.ibb.co/mJR3QxG/user.png"
    };

    let currentUserDoc = null;
    let activeVideoId = null;
    let selectedTaskId = null;

    // ১. ইউজার ডাটা ইনিশিয়ালাইজেশন
    async function initUser() {
      const userRef = doc(db, "users", tgUser.id.toString());
      const snap = await getDoc(userRef);

      const startParam = tg?.initDataUnsafe?.start_param || "";

      if (!snap.exists()) {
        let referredBy = null;
        let autoOpenVideoId = null;

        if (startParam.startsWith("ref_")) {
          const parts = startParam.split("_");
          referredBy = parts[1] !== "none" ? parts[1] : null;
          if (parts[3]) autoOpenVideoId = parts[3];
        }

        const newUser = {
          name: `${tgUser.first_name || ''} ${tgUser.last_name || ''}`.trim() || 'Anonymous',
          username: tgUser.username || "Anonymous",
          photoUrl: tgUser.photo_url || "https://i.ibb.co/mJR3QxG/user.png",
          balance: 10,
          totalEarnings: 10,
          referralsCount: 0,
          referredBy: referredBy,
          badges: ["Newbie"],
          isBanned: false,
          lastLogin: serverTimestamp()
        };

        await setDoc(userRef, newUser);

        // রেফারেল বোনাস প্রদান
        if (referredBy) {
          try {
            const refUserRef = doc(db, "users", referredBy);
            await updateDoc(refUserRef, {
              balance: increment(50),
              totalEarnings: increment(50),
              referralsCount: increment(1)
            });
          } catch (e) {
            console.error("Referral update error:", e);
          }
        }

        if (autoOpenVideoId) {
          setTimeout(() => triggerPlayVideo(autoOpenVideoId), 1200);
        }
      }

      // রিয়েলটাইম প্রোফাইল সিঙ্ক
      onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          currentUserDoc = docSnap.data();
          renderUserProfile();
        }
      });
    }

    function renderUserProfile() {
      if (!currentUserDoc) return;
      document.getElementById('user-name').innerText = currentUserDoc.name;
      document.getElementById('user-avatar').src = currentUserDoc.photoUrl;
      document.getElementById('user-balance').innerText = currentUserDoc.balance;
      document.getElementById('profile-balance').innerText = currentUserDoc.balance;
      document.getElementById('profile-total-earnings').innerText = currentUserDoc.totalEarnings;
      document.getElementById('profile-referrals').innerText = currentUserDoc.referralsCount;

      const botUser = "trendingviralhubbot";
      document.getElementById('ref-link-input').value = `https://t.me/${botUser}?start=${tgUser.id}`;

      // ব্যাজ প্রদর্শন
      const badgeContainer = document.getElementById('badge-container');
      badgeContainer.innerHTML = '';
      (currentUserDoc.badges || []).forEach(b => {
        const badgeSpan = document.createElement('span');
        badgeSpan.className = "text-[9px] bg-indigo-900 border border-indigo-500 text-indigo-200 px-1 rounded";
        badgeSpan.innerText = b;
        badgeContainer.appendChild(badgeSpan);
      });
    }

    // ২. অ্যাড-গেট ফাংশন (৮ সেকেন্ড ফালব্যাক টাইমার)
    window.adGate = function(callback) {
      const overlay = document.getElementById('ad-gate-overlay');
      const timerEl = document.getElementById('ad-timer');
      overlay.classList.remove('hidden');

      let timeLeft = 8;
      timerEl.innerText = timeLeft;

      const interval = setInterval(() => {
        timeLeft--;
        timerEl.innerText = timeLeft;
        if (timeLeft <= 0) {
          clearInterval(interval);
          overlay.classList.add('hidden');
          if (callback) callback();
        }
      }, 1000);
    };

    // ৩. ভিডিও লোড করা
    function loadVideos() {
      const q = query(collection(db, "videos"), orderBy("createdAt", "desc"), limit(20));
      onSnapshot(q, (snapshot) => {
        const grid = document.getElementById('videos-grid');
        grid.innerHTML = '';

        if (snapshot.empty) {
          grid.innerHTML = `<div class='text-center py-8 text-gray-500 text-xs'>বর্তমানে কোনো ভিডিও পাওয়া যায়নি। Firebase থেকে ভিডিও যোগ করুন।</div>`;
          return;
        }

        snapshot.forEach((docSnap) => {
          const v = docSnap.data();
          const vId = docSnap.id;
          const isExpired = v.expiryDate && new Date(v.expiryDate.toDate ? v.expiryDate.toDate() : v.expiryDate) < new Date();

          const card = document.createElement('div');
          card.className = "bg-cardBg border border-borderDark rounded-xl overflow-hidden shadow-md flex flex-col";
          card.innerHTML = `
            <div class="relative aspect-video bg-black">
              <img src="${v.thumbnailUrl || 'https://i.ibb.co/vz44m7P/banner.jpg'}" class="w-full h-full object-cover" />
              ${isExpired ? `
                <div class="absolute inset-0 bg-black/80 flex items-center justify-center">
                  <span class="text-red-500 font-bold text-xs bg-red-950/80 px-2.5 py-1 rounded border border-red-800">Content Expired</span>
                </div>
              ` : `
                <button onclick="triggerPlayVideo('${vId}')" class="absolute inset-0 m-auto w-12 h-12 bg-gold text-darkBg rounded-full flex items-center justify-center text-lg shadow-lg active:scale-95 transition">
                  <i class="fa-solid fa-play ml-0.5"></i>
                </button>
              `}
            </div>
            <div class="p-3 flex justify-between items-center">
              <div>
                <h4 class="font-bold text-xs text-white line-clamp-1">${v.title}</h4>
                <p class="text-[10px] text-gray-400 mt-0.5"><i class="fa-solid fa-eye text-gold"></i> ${v.views || 0} ভিউস</p>
              </div>
              <a href="https://t.me/share/url?url=https://t.me/trendingviralhubbot?start=${vId}&text=${encodeURIComponent(v.title)}" target="_blank" class="bg-darkBg border border-borderDark p-2 rounded-lg text-gray-300 hover:text-gold text-xs">
                <i class="fa-solid fa-share-nodes"></i>
              </a>
            </div>
          `;
          grid.appendChild(card);
        });
      });
    }

    // ৪. ভিডিও প্লে ও পয়েন্ট যোগ
    window.triggerPlayVideo = async function(videoId) {
      adGate(async () => {
        activeVideoId = videoId;
        const vRef = doc(db, "videos", videoId);
        const vSnap = await getDoc(vRef);
        if (!vSnap.exists()) return alert("ভিডিও পাওয়া যায়নি!");

        const vData = vSnap.data();

        // ভিউ ও পয়েন্ট আপডেট
        await updateDoc(vRef, { views: increment(1) });
        await updateDoc(doc(db, "users", tgUser.id.toString()), {
          balance: increment(5),
          totalEarnings: increment(5)
        });

        // ভিডিও প্লেয়ারে ডাটা সেট
        document.getElementById('modal-video-title').innerText = vData.title;
        const player = document.getElementById('native-player');
        player.src = (vData.urls && vData.urls[0]) || '';
        player.play();

        document.getElementById('modal-share-btn').onclick = () => {
          window.open(`https://t.me/share/url?url=https://t.me/trendingviralhubbot?start=${videoId}&text=${encodeURIComponent(vData.title)}`);
        };

        loadComments(videoId);
        document.getElementById('video-modal').classList.remove('hidden');
      });
    };

    window.closeVideoModal = function() {
      const player = document.getElementById('native-player');
      player.pause();
      player.src = '';
      document.getElementById('video-modal').classList.add('hidden');
    };

    // ৫. কমেন্ট সিস্টেম (১ কয়েন স্প্যাম প্রতিরোধ)
    function loadComments(videoId) {
      const q = query(collection(db, "comments"), where("videoId", "==", videoId), orderBy("createdAt", "desc"), limit(30));
      onSnapshot(q, (snapshot) => {
        const cContainer = document.getElementById('comments-container');
        cContainer.innerHTML = '';
        snapshot.forEach((snap) => {
          const c = snap.data();
          const commentDiv = document.createElement('div');
          commentDiv.className = "bg-darkBg p-2 rounded border border-borderDark text-xs";
          commentDiv.innerHTML = `
            <span class="font-bold text-gold">${c.userName}:</span>
            <span class="text-gray-300 ml-1">${c.text}</span>
          `;
          cContainer.appendChild(commentDiv);
        });
      });
    }

    window.postComment = async function() {
      const input = document.getElementById('comment-input');
      const text = input.value.trim();
      if (!text || !activeVideoId) return;

      if ((currentUserDoc?.balance || 0) < 1) {
        return alert("কমেন্ট করতে ১ কয়েন লাগবে!");
      }

      await updateDoc(doc(db, "users", tgUser.id.toString()), {
        balance: increment(-1)
      });

      await addDoc(collection(db, "comments"), {
        videoId: activeVideoId,
        userId: tgUser.id.toString(),
        userName: currentUserDoc.name,
        text: text,
        createdAt: serverTimestamp()
      });

      input.value = '';
    };

    // ৬. উইথড্র সিস্টেম
    window.requestWithdrawal = async function() {
      const method = document.getElementById('withdraw-method').value;
      const account = document.getElementById('withdraw-account').value.trim();
      const amount = parseInt(document.getElementById('withdraw-amount').value, 10);

      if (!account || isNaN(amount)) return alert("সঠিক তথ্য পূরণ করুন!");
      if (amount < 500) return alert("সর্বনিম্ন উইথড্র ৫০০ Coins!");
      if ((currentUserDoc?.balance || 0) < amount) return alert("পর্যাপ্ত ব্যালেন্স নেই!");

      const btn = document.getElementById('withdraw-btn');
      btn.disabled = true;
      btn.innerText = "প্রসেসিং হচ্ছে...";

      try {
        await updateDoc(doc(db, "users", tgUser.id.toString()), {
          balance: increment(-amount)
        });

        await addDoc(collection(db, "withdrawals"), {
          userId: tgUser.id.toString(),
          name: currentUserDoc.name,
          method: method,
          accountNumber: account,
          amount: amount,
          status: "pending",
          createdAt: serverTimestamp()
        });

        alert("উইথড্র রিকোয়েস্ট সফল হয়েছে! অ্যাডমিন চেক করে টাকা পাঠিয়ে দেবে।");
        document.getElementById('withdraw-account').value = '';
        document.getElementById('withdraw-amount').value = '';
      } catch (err) {
        alert("ত্রুটি হয়েছে: " + err.message);
      } finally {
        btn.disabled = false;
        btn.innerText = "উইথড্র রিকোয়েস্ট পাঠান";
      }
    };

    // ৭. টাস্ক মার্কেটপ্লেস ও ImgBB আপলোড
    function loadTasks() {
      const q = query(collection(db, "tasks"), where("status", "==", "active"), limit(20));
      onSnapshot(q, (snapshot) => {
        const tList = document.getElementById('tasks-list');
        tList.innerHTML = '';
        
        if (snapshot.empty) {
          tList.innerHTML = `<div class='text-center py-6 text-gray-500 text-xs'>কোনো সক্রিয় টাস্ক নেই।</div>`;
          return;
        }

        snapshot.forEach((snap) => {
          const t = snap.data();
          const tId = snap.id;
          const card = document.createElement('div');
          card.className = "bg-cardBg border border-borderDark p-3 rounded-xl flex items-center justify-between";
          card.innerHTML = `
            <div>
              <h4 class="text-xs font-bold text-white">${t.title}</h4>
              <p class="text-[10px] text-gray-400 mt-1">রিওয়ার্ড: <span class="text-gold font-bold">+${t.reward} Coins</span> | কমপ্লিট: ${t.completedCount || 0}/${t.maxUsers}</p>
            </div>
            <div class="flex space-x-1.5">
              <a href="${t.link}" target="_blank" class="bg-darkBg border border-borderDark text-xs px-2.5 py-1 rounded text-indigo-400 font-bold">গো লিংক</a>
              <button onclick="openSubmitProof('${tId}')" class="bg-gold text-darkBg text-xs px-2.5 py-1 rounded font-bold">প্রুফ দিন</button>
            </div>
          `;
          tList.appendChild(card);
        });
      });
    }

    window.openSubmitProof = function(taskId) {
      selectedTaskId = taskId;
      openModal('proof-modal');
    };

    // স্ক্রিনশট আপলোড (আপনার ImgBB API দিয়ে সরাসরি কাজ করবে)
    window.submitProofAction = async function() {
      const fileInput = document.getElementById('proof-file');
      if (!fileInput.files[0] || !selectedTaskId) return alert("স্ক্রিনশট সিলেক্ট করুন!");

      const btn = document.getElementById('proof-submit-btn');
      btn.disabled = true;
      btn.innerText = "আপলোড হচ্ছে...";

      try {
        const formData = new FormData();
        formData.append("image", fileInput.files[0]);

        const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
          method: "POST",
          body: formData
        });

        const json = await res.json();
        const imageUrl = json.data?.url || "https://i.ibb.co/vz44m7P/banner.jpg";

        await addDoc(collection(db, "task_proofs"), {
          taskId: selectedTaskId,
          userId: tgUser.id.toString(),
          imageUrl: imageUrl,
          status: "pending",
          createdAt: serverTimestamp()
        });

        alert("প্রমাণ সফলভাবে জমা হয়েছে!");
        closeModal('proof-modal');
        fileInput.value = '';
      } catch (e) {
        alert("আপলোড সমস্যা হয়েছে: " + e.message);
      } finally {
        btn.disabled = false;
        btn.innerText = "সাবমিট প্রুফ";
      }
    };

    window.submitNewTask = async function() {
      const title = document.getElementById('task-title').value.trim();
      const link = document.getElementById('task-link').value.trim();
      const users = parseInt(document.getElementById('task-users').value, 10);
      const reward = parseInt(document.getElementById('task-reward').value, 10);

      const totalCost = users * reward;
      if (!title || !link || isNaN(users) || isNaN(reward)) return alert("সব ঘর পূরণ করুন!");
      if ((currentUserDoc?.balance || 0) < totalCost) return alert(`পর্যাপ্ত ব্যালেন্স নেই! প্রয়োজন ${totalCost} কয়েন।`);

      await updateDoc(doc(db, "users", tgUser.id.toString()), {
        balance: increment(-totalCost)
      });

      await addDoc(collection(db, "tasks"), {
        title: title,
        link: link,
        maxUsers: users,
        reward: reward,
        completedCount: 0,
        status: "active",
        createdBy: tgUser.id.toString(),
        createdAt: serverTimestamp()
      });

      alert("টাস্ক সফলভাবে পাবলিশ হয়েছে!");
      closeModal('create-task-modal');
      document.getElementById('task-title').value = '';
      document.getElementById('task-link').value = '';
      document.getElementById('task-users').value = '';
      document.getElementById('task-reward').value = '';
    };

    // ৮. লিডারবোর্ড লোড
    function loadLeaderboard() {
      const q = query(collection(db, "users"), orderBy("totalEarnings", "desc"), limit(10));
      onSnapshot(q, (snapshot) => {
        const lList = document.getElementById('leaderboard-list');
        lList.innerHTML = '';
        let rank = 1;

        snapshot.forEach((snap) => {
          const u = snap.data();
          let medal = `<span class="text-xs font-bold text-gray-400 w-5 text-center">${rank}</span>`;
          if (rank === 1) medal = `<i class="fa-solid fa-medal text-yellow-400 text-sm w-5 text-center"></i>`;
          if (rank === 2) medal = `<i class="fa-solid fa-medal text-gray-300 text-sm w-5 text-center"></i>`;
          if (rank === 3) medal = `<i class="fa-solid fa-medal text-amber-600 text-sm w-5 text-center"></i>`;

          const row = document.createElement('div');
          row.className = "flex items-center justify-between p-3 text-xs";
          row.innerHTML = `
            <div class="flex items-center space-x-2">
              ${medal}
              <span class="font-bold text-white truncate max-w-[120px]">${u.name}</span>
            </div>
            <span class="font-extrabold text-gold">${u.totalEarnings || 0} Coins</span>
          `;
          lList.appendChild(row);
          rank++;
        });
      });
    }

    // ৯. অটো অ্যাপ্রুভ (২৪ ঘণ্টার পেন্ডিং প্রুফ থাকলে অটো পাস হবে)
    async function checkPendingTaskProofs() {
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const q = query(collection(db, "task_proofs"), where("status", "==", "pending"));
      const snaps = await getDocs(q);
      
      snaps.forEach(async (pDoc) => {
        const data = pDoc.data();
        if (data.createdAt && data.createdAt.toDate() < dayAgo) {
          await updateDoc(doc(db, "task_proofs", pDoc.id), { status: "approved" });
          await updateDoc(doc(db, "users", data.userId), {
            balance: increment(10),
            totalEarnings: increment(10)
          });
        }
      });
    }

    // ১০. ইউটিলিটি ও ট্যাব সুইচ
    window.switchTab = function(tabName) {
      document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
      document.getElementById(`tab-${tabName}`).classList.remove('hidden');

      ['videos', 'tasks', 'leaderboard', 'profile'].forEach(t => {
        const nav = document.getElementById(`nav-${t}`);
        if (t === tabName) {
          nav.classList.add('text-gold');
          nav.classList.remove('text-gray-400');
        } else {
          nav.classList.remove('text-gold');
          nav.classList.add('text-gray-400');
        }
      });
    };

    window.openModal = function(id) { document.getElementById(id).classList.remove('hidden'); };
    window.closeModal = function(id) { document.getElementById(id).classList.add('hidden'); };
    window.copyRefLink = function() {
      const copyText = document.getElementById("ref-link-input");
      copyText.select();
      navigator.clipboard.writeText(copyText.value);
      alert("রেফারেল লিংক কপি হয়েছে!");
    };

    // স্টার্টআপ
    window.addEventListener('DOMContentLoaded', () => {
      initUser();
      loadVideos();
      loadTasks();
      loadLeaderboard();
      checkPendingTaskProofs();
    });
  </script>
</body>
</html>

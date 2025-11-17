/* Frontend logic.
   Two modes:
   - If BACKEND_URL is provided, we call your backend API for creation/stats.
   - Otherwise we fallback to TinyURL API (fast) and basic local counter.
*/

// ----- CONFIG -----
const BACKEND_URL = ""; // ضع رابط السيرفر هنا إذا انتهيت من نشر backend (مثال: "https://short.example.com/api")
const useBackend = Boolean(BACKEND_URL && BACKEND_URL.length);

// ----- UI -----
const inputUrl = document.getElementById("inputUrl");
const shortenBtn = document.getElementById("shortenBtn");
const copyBtn = document.getElementById("copyBtn");
const result = document.getElementById("result");
const shortLink = document.getElementById("shortLink");
const totalCount = document.getElementById("totalCount");
const countLabel = document.getElementById("countLabel");
const createdLabel = document.getElementById("createdLabel");

function setTotal(n){
  totalCount.textContent = n;
}

// load total from localStorage as fallback
setTotal(localStorage.getItem("global_count") || 0);

// ----- helpers -----
async function createShort(url){
  if(useBackend){
    const res = await fetch(`${BACKEND_URL}/create`, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({url})
    });
    if(!res.ok) throw new Error("خطأ من السيرفر");
    return res.json(); // { short: "...", id:"abc123", created:"..." , visits:0 }
  } else {
    // fallback: call tinyurl API (public), returns full short URL
    const r = await fetch("https://tinyurl.com/api-create.php?url=" + encodeURIComponent(url));
    if(!r.ok) throw new Error("فشل الاتصال");
    const short = await r.text();
    // update local counter
    const g = Number(localStorage.getItem("global_count")||0) + 1;
    localStorage.setItem("global_count", g);
    setTotal(g);
    return { short, id: null, created: new Date().toLocaleString(), visits: "-" };
  }
}

shortenBtn.addEventListener("click", async ()=>{
  const url = inputUrl.value.trim();
  if(!url) return alert("من فضلك أدخل رابطًا صحيحًا");
  shortenBtn.disabled = true;
  shortenBtn.textContent = "جارٍ الاختصار...";
  try{
    const data = await createShort(url);
    const shortUrl = data.short || (location.origin + "/?r=" + data.id);
    shortLink.href = shortUrl;
    shortLink.textContent = shortUrl;
    result.classList.remove("hidden");
    copyBtn.disabled = false;
    countLabel.textContent = "الزيارات: " + (data.visits ?? "-");
    createdLabel.textContent = "أنشئت: " + (data.created ?? "-");
  }catch(err){
    alert("حدث خطأ: " + err.message);
  }finally{
    shortenBtn.disabled = false;
    shortenBtn.textContent = "اختصار الآن";
  }
});

copyBtn.addEventListener("click", ()=>{
  const txt = shortLink.href;
  if(!txt) return;
  navigator.clipboard.writeText(txt).then(()=>{
    copyBtn.textContent = "تم النسخ";
    setTimeout(()=>copyBtn.textContent="نسخ", 1200);
  });
});

// Redirect handler for local fallback (if using static mode)
(function(){
  const params = new URLSearchParams(location.search);
  const r = params.get("r");
  if(r && !useBackend){
    // read mapping from localStorage
    const original = localStorage.getItem("short:" + r);
    if(original){
      location.href = original;
    } else {
      // no mapping -> show message
      alert("الرابط غير موجود في هذا المتصفح (خاص بالنسخة المحلية). استخدم النسخة المشتركة مع سيرفر للروابط العامة.");
    }
  }
})();

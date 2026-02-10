#!/bin/bash
DIR="/Users/vince/Documents/sishijian-site/public/assets/logos/brands"
mkdir -p "$DIR"

create_text_logo() {
  local filename="$1"
  local text="$2"
  local bg_color="${3:-#1a1a1a}"
  local text_color="${4:-#ffffff}"
  local font_size="${5:-16}"
  
  cat > "$DIR/$filename" << EOF
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 60" width="160" height="60">
  <rect width="160" height="60" rx="8" fill="$bg_color"/>
  <text x="80" y="35" text-anchor="middle" dominant-baseline="middle" font-family="'SF Pro Display','PingFang SC','Noto Sans SC',system-ui,sans-serif" font-size="$font_size" font-weight="600" fill="$text_color">$text</text>
</svg>
EOF
}

create_icon_logo() {
  local filename="$1"
  local svg_content="$2"
  echo "$svg_content" > "$DIR/$filename"
}

# === 跨媒體平台 ===
# WhatsApp
create_icon_logo "whatsapp.svg" '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 60" width="160" height="60">
  <rect width="160" height="60" rx="8" fill="#25D366"/>
  <g transform="translate(30,10) scale(0.8)">
    <path d="M25 2C12.3 2 2 12.3 2 25c0 4.1 1.1 7.9 3 11.2L2 48l12.2-3.2C17.3 46.3 21 47.5 25 47.5c12.7 0 23-10.3 23-23S37.7 2 25 2zm0 42c-3.5 0-6.8-1-9.6-2.7l-.7-.4-7.2 1.9 1.9-7-.4-.7C7.2 32.5 6 29 6 25 6 14.5 14.5 6 25 6s19 8.5 19 19-8.5 19-19 19z" fill="#fff"/>
    <path d="M36.6 30.1c-.6-.3-3.6-1.8-4.2-2-.6-.2-1-.3-1.4.3s-1.6 2-2 2.4c-.4.4-.7.5-1.3.2-.6-.3-2.6-1-4.9-3-1.8-1.6-3-3.6-3.4-4.2-.4-.6 0-.9.3-1.2.3-.3.6-.7.9-1 .3-.4.4-.6.6-1 .2-.4.1-.8 0-1.1-.1-.3-1.4-3.4-1.9-4.6-.5-1.2-1-1-1.4-1h-1.2c-.4 0-1 .2-1.6.8-.6.6-2 2-2 4.8s2.1 5.6 2.4 6c.3.4 4.1 6.3 10 8.8 1.4.6 2.5.9 3.3 1.2 1.4.4 2.7.4 3.7.2 1.1-.2 3.4-1.4 3.9-2.7.5-1.3.5-2.5.3-2.7-.2-.2-.6-.4-1.2-.6z" fill="#fff"/>
  </g>
  <text x="105" y="35" text-anchor="middle" dominant-baseline="middle" font-family="system-ui,sans-serif" font-size="13" font-weight="700" fill="#fff">WhatsApp</text>
</svg>'

# Instagram
create_icon_logo "instagram.svg" '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 60" width="160" height="60">
  <defs>
    <linearGradient id="ig" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#feda75"/>
      <stop offset="25%" stop-color="#fa7e1e"/>
      <stop offset="50%" stop-color="#d62976"/>
      <stop offset="75%" stop-color="#962fbf"/>
      <stop offset="100%" stop-color="#4f5bd5"/>
    </linearGradient>
  </defs>
  <rect width="160" height="60" rx="8" fill="url(#ig)"/>
  <g transform="translate(24,12) scale(0.75)">
    <rect x="2" y="2" width="44" height="44" rx="12" fill="none" stroke="#fff" stroke-width="4"/>
    <circle cx="24" cy="24" r="10" fill="none" stroke="#fff" stroke-width="3.5"/>
    <circle cx="37" cy="11" r="3" fill="#fff"/>
  </g>
  <text x="105" y="35" text-anchor="middle" dominant-baseline="middle" font-family="system-ui,sans-serif" font-size="13" font-weight="600" fill="#fff">Instagram</text>
</svg>'

# Facebook
create_icon_logo "facebook.svg" '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 60" width="160" height="60">
  <rect width="160" height="60" rx="8" fill="#1877F2"/>
  <g transform="translate(24,8)">
    <path d="M32 22h-6v-5c0-1.7 1.3-2 2-2h4V8h-6c-5.5 0-8 4-8 8v6H12v8h6v20h8V30h5l1-8z" fill="#fff"/>
  </g>
  <text x="105" y="35" text-anchor="middle" dominant-baseline="middle" font-family="system-ui,sans-serif" font-size="13" font-weight="700" fill="#fff">Facebook</text>
</svg>'

# Google Reviews
create_icon_logo "googlereviews.svg" '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 60" width="160" height="60">
  <rect width="160" height="60" rx="8" fill="#ffffff" stroke="#e5e5e5" stroke-width="1"/>
  <g transform="translate(18,14) scale(0.7)">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.09-1.92 3.29-4.76 3.29-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </g>
  <text x="98" y="28" text-anchor="middle" dominant-baseline="middle" font-family="system-ui,sans-serif" font-size="11" font-weight="600" fill="#333">Google</text>
  <text x="98" y="42" text-anchor="middle" dominant-baseline="middle" font-family="system-ui,sans-serif" font-size="10" fill="#666">Reviews</text>
</svg>'

# 小紅書
create_icon_logo "xiaohongshu.svg" '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 60" width="160" height="60">
  <rect width="160" height="60" rx="8" fill="#FF2442"/>
  <text x="80" y="35" text-anchor="middle" dominant-baseline="middle" font-family="PingFang SC,Noto Sans SC,system-ui,sans-serif" font-size="18" font-weight="700" fill="#fff">小紅書</text>
</svg>'

# 大眾點評
create_icon_logo "dianping.svg" '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 60" width="160" height="60">
  <rect width="160" height="60" rx="8" fill="#FF6633"/>
  <text x="80" y="35" text-anchor="middle" dominant-baseline="middle" font-family="PingFang SC,Noto Sans SC,system-ui,sans-serif" font-size="16" font-weight="700" fill="#fff">大眾點評</text>
</svg>'

# TripAdvisor
create_icon_logo "tripadvisor.svg" '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 60" width="160" height="60">
  <rect width="160" height="60" rx="8" fill="#00AF87"/>
  <text x="80" y="35" text-anchor="middle" dominant-baseline="middle" font-family="system-ui,sans-serif" font-size="13" font-weight="700" fill="#fff">TripAdvisor</text>
</svg>'

# === 傳統媒體 ===
create_text_logo "mingpao.svg" "明報" "#1a1a1a" "#ffffff" "20"
create_text_logo "singdaily.svg" "星島日報" "#003366" "#ffffff" "16"
create_text_logo "oncc.svg" "on.cc" "#E31937" "#ffffff" "18"
create_text_logo "epochtimes.svg" "大紀元" "#1A3A6B" "#FFD700" "18"
create_text_logo "hket.svg" "hket" "#003D7A" "#ffffff" "20"
create_text_logo "singdaily2.svg" "星島日報" "#003366" "#ffffff" "16"
create_text_logo "skypost.svg" "晴報" "#FF6B00" "#ffffff" "22"
create_text_logo "eastweek.svg" "東周刊" "#8B0000" "#FFD700" "18"
create_text_logo "am730.svg" "am730" "#E60012" "#ffffff" "20"
create_text_logo "wenweipo.svg" "文匯報" "#CC0000" "#ffffff" "18"
create_text_logo "orientaldaily.svg" "東方日報" "#1a1a1a" "#ffffff" "16"
create_text_logo "headline.svg" "頭條日報" "#002B5C" "#ffffff" "16"
create_text_logo "730.svg" "730" "#E60012" "#ffffff" "24"
create_text_logo "hkej.svg" "信報" "#333333" "#FFD700" "22"
create_text_logo "hk01.svg" "香港01" "#FF4500" "#ffffff" "18"

# === 飲食 / 生活品味 ===
create_text_logo "openrice.svg" "OpenRice" "#FF6600" "#ffffff" "15"
create_text_logo "lemon.svg" "LEMON" "#FFE100" "#1a1a1a" "18"
create_text_logo "eatdrink.svg" "飲食男女" "#D4A94B" "#1a1a1a" "16"
create_text_logo "umagazine.svg" "U Magazine" "#6C2DC7" "#ffffff" "13"
create_text_logo "metro.svg" "Metro" "#004B87" "#ffffff" "20"
create_text_logo "mingpaoweekly.svg" "明周" "#1a1a1a" "#D4A94B" "22"
create_text_logo "weekend.svg" "新假期" "#E91E63" "#ffffff" "18"
create_text_logo "topao.svg" "土炮" "#8B4513" "#ffffff" "22"
create_text_logo "line.svg" "LINE" "#06C755" "#ffffff" "20"
create_text_logo "like.svg" "Like" "#E91E63" "#ffffff" "22"
create_text_logo "sauce.svg" "SAUCE" "#FF3D00" "#ffffff" "18"
create_text_logo "meet.svg" "MEET" "#2196F3" "#ffffff" "20"
create_text_logo "timable.svg" "Timable" "#FF5722" "#ffffff" "16"
create_text_logo "cookery.svg" "Cookery" "#4CAF50" "#ffffff" "16"
create_text_logo "timeout.svg" "TimeOut" "#E31937" "#ffffff" "16"
create_text_logo "playeasy.svg" "Play Easy" "#9C27B0" "#ffffff" "14"
create_text_logo "lifestyle.svg" "Lifestyle" "#607D8B" "#ffffff" "14"
create_text_logo "eso.svg" "ESO" "#1565C0" "#ffffff" "22"
create_text_logo "yahoo.svg" "Yahoo" "#6001D2" "#ffffff" "20"
create_text_logo "ztylez.svg" "ZTYLEZ" "#1a1a1a" "#FF6B6B" "16"

echo "Created $(ls -1 $DIR/*.svg | wc -l) SVG logos"

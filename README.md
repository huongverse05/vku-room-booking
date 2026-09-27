# 🏫 VKU Room Booking App — Mini-Project 2
> **Môn học:** Phát triển Ứng dụng Di động Đa nền tảng (Cross-Platform Mobile App Development)  
> **Giảng viên hướng dẫn:** TS. Nguyễn Thanh Tuấn  
> **Khoa:** Khoa học Máy tính — Trường Đại học Công nghệ Thông tin & Truyền thông Việt - Hàn (VKU)  
> **Họ và tên SV:** Nguyễn Văn An — **MSSV:** 22IT089 — **Lớp:** 22IT  

---

## 📱 Giới thiệu Dự án

**VKU Room Booking** là ứng dụng di động đa nền tảng được phát triển bằng **React Native (Expo) & TypeScript**, giải quyết bài toán mượn phòng học nhóm, phòng Lab máy tính thực hành (Khu V), phòng hội thảo thông minh (Khu A), không gian nghiên cứu sáng tạo Maker Space (Khu K) và Thư viện số tại khuôn viên VKU.

Ứng dụng được thiết kế và hiện thực hóa dựa trên **100% chuẩn kiến trúc từ Slide Tuần 6 của TS. Nguyễn Thanh Tuấn**:
- 🧭 **React Navigation**: Kết hợp phân tầng Root Native Stack và Bottom Tab Navigator với Type-Safe Route Parameters (`RootStackParamList`, `TabParamList`).
- ⚡ **Zustand Persistent Store**: Quản lý Client State với middleware `persist` và `AsyncStorage`, lưu trữ dữ liệu ngoại tuyến (`vku-booking-storage`).
- 🌐 **TanStack Query (React Query)**: Quản lý Server State, cơ chế tự động cache dữ liệu phòng (`staleTime: 5 phút`, `gcTime: 10 phút`, `retry: 2`), hỗ trợ Pull-to-refresh mượt mà.
- 🎨 **React Native Reanimated 3**: Hiệu ứng chuyển động mượt mà 60/120fps chạy trên UI Thread (Layout animations `FadeInDown`, `FadeOutUp`, và `withSpring` interaction trên nút bấm).
- 👆 **React Native Gesture Handler**: Xử lý cử chỉ vuốt thẻ sang trái (`Gesture.Pan()`) để hủy đặt phòng nhanh (`SwipeToCancel`).

---

## 🏗️ Kiến trúc Ứng dụng (Navigation & Data Flow)

### 1. Phân tầng Navigation (Slide 4, 7, 8, 9)
```text
NavigationContainer
└── Stack.Navigator (RootStack) [headerStyle: #1E3A5F, headerTintColor: #fff]
    ├── Screen "MainTabs" ──► Tab.Navigator [tabBarActiveTintColor: #3B82F6]
    │   ├── "BrowseRooms" ──► BrowseRoomsScreen (Khám phá & Tìm kiếm)
    │   ├── "MyBookings"  ──► MyBookingsScreen (Lịch đặt phòng của tôi)
    │   └── "Profile"     ──► ProfileScreen (Hồ sơ sinh viên VKU)
    │
    ├── Screen "RoomDetails"
    │   (Pushed on top — tabs hidden, params: { roomId, roomName })
    │
    └── Screen "BookingConfirmation"
        (Presented as Modal — slides up from bottom, params: { bookingId })
```

### 2. Phân tách State: Client State vs Server State (Slide 15 & 19)
```text
┌─────────────────────────────────────────────────────────────┐
│                      React Component                        │
│                                                             │
│   useBookingStore(s => s.bookings)      useRooms('Khu V')   │
│            (Client State)                    (Server State) │
└───────────────┬─────────────────────────────────────┬───────┘
                ▼                                     ▼
     ┌────────────────────┐               ┌─────────────────────┐
     │   Zustand Store    │               │   TanStack Query    │
     │ • bookings[]       │               │ • ['rooms', { bld }]│
     │ • cancelBooking()  │               │ • staleTime: 5 mins │
     │ • AsyncStorage     │               │ • pull-to-refresh   │
     └────────────────────┘               └─────────────────────┘
```

---

## 🌟 Tính năng Nổi bật (Đối chiếu Bảng điểm Rubric)

| Tiêu chí | Trọng số | Hiện thực hóa trong dự án |
| :--- | :---: | :--- |
| **UI/UX** | **25%** | Giao diện chuẩn thương hiệu VKU (Navy `#1E3A5F`, Electric Blue `#3B82F6`, Red `#E02424`). Thẻ phòng hiện đại, thẻ E-Ticket Boarding Pass có mã vạch/QR code, hiệu ứng Reanimated 3 staggered entry. |
| **Features** | **30%** | Tìm kiếm phòng học theo từ khóa, lọc theo tòa nhà (Khu A, Khu V, Khu K, Thư viện), phân loại theo mục đích (Lab, Hội thảo, Tự học), form đặt phòng chọn ngày/ca học, quản lý vé và hủy vé. |
| **Navigation** | **15%** | Native Stack lồng Bottom Tabs, 100% Type-Safe TypeScript Route Params không bao giờ xảy ra lỗi runtime màn hình. |
| **State** | **15%** | Tách bạch rõ rệt giữa Zustand (AsyncStorage persist) và TanStack Query (caching & refetch). Consuming bằng Single Selectors chống re-render thừa. |
| **Code Quality** | **15%** | TypeScript Strict Mode (`tsc --noEmit` 0 lỗi), kiến trúc module phân tách rõ ràng (`components`, `screens`, `hooks`, `store`, `types`, `constants`). |

---

## 🚀 Hướng dẫn Chạy Ứng dụng & Demo trên Điện thoại

### 1. Cài đặt môi trường
Đảm bảo máy đã cài đặt **Node.js (>= 18)** và ứng dụng **Expo Go** trên điện thoại (tải từ Google Play Store hoặc Apple App Store).

```bash
# Di chuyển vào thư mục dự án
cd vku-room-booking

# Cài đặt dependencies (nếu chưa cài)
npm install
```

### 2. Khởi chạy dự án Expo
```bash
# Khởi động Expo Metro Bundler
npx expo start
```

### 3. Trải nghiệm trên điện thoại thật
1. Mở ứng dụng **Expo Go** trên điện thoại Android hoặc mở ứng dụng **Camera** trên iPhone.
2. Quét **mã QR** hiển thị trên terminal hoặc trên trình duyệt Metro Bundler.
3. Ứng dụng sẽ nạp mã nguồn JavaScript trực tiếp vào điện thoại và sẵn sàng trải nghiệm!

*(Tùy chọn: Chạy trên Web browser bằng lệnh `npx expo start --web` hoặc nhấn phím `w` trong terminal).*

---

## 📹 Kịch bản Quay Video Demo (2–3 Phút)

Khi quay video nộp bài theo yêu cầu của Thầy (Slide 28):
1. **0:00 - 0:30 (Màn hình Browse & Search):**
   - Giới thiệu màn hình chính "Khám phá phòng VKU".
   - Kéo vuốt xuống để kích hoạt **Pull-to-refresh** (TanStack Query refetch).
   - Bấm chuyển các chip lọc: **Khu A**, **Khu V**, **Khu K**, **Thư viện**.
   - Thao tác thanh tìm kiếm: nhập "Lab", "4K", "AI".
2. **0:30 - 1:15 (Chi tiết phòng & Đặt lịch):**
   - Bấm vào một phòng (ví dụ: *Phòng Lab AI & Data Science V204*).
   - Quan sát hiệu ứng chuyển màn hình **Stack Push**.
   - Chọn ngày, chọn ca học trống (Tiết 4-6), nhập mục đích.
   - Nhấn giữ nút **"Xác nhận Đặt phòng"** để thể hiện hiệu ứng lò xo **Reanimated withSpring**.
3. **1:15 - 1:50 (Màn hình Modal Thẻ ra vào phòng):**
   - Màn hình **Booking Confirmation** trượt lên từ dưới dạng **Modal Presentation**.
   - Show chi tiết E-Ticket chuẩn thương hiệu VKU, mã thẻ và QR Code.
   - Bấm nút "Chia sẻ thẻ" hoặc "Xem danh sách đặt".
4. **1:50 - 2:45 (Cử chỉ Swipe-to-Cancel & Zustand Persist):**
   - Chuyển sang Tab **"Lịch đặt phòng"**.
   - Giải thích dữ liệu lấy từ **Zustand Store (AsyncStorage)**.
   - Thực hiện cử chỉ vuốt thẻ sang trái (**React Native Gesture Handler**) để kích hoạt tính năng **Hủy phòng**.
   - Chuyển sang Tab "Đã hủy / Lịch sử" để kiểm tra trạng thái cập nhật tức thì.
5. **2:45 - 3:00 (Tab Hồ sơ & Kết thúc):**
   - Chuyển sang Tab **Cá nhân** hiển thị thông tin sinh viên và nút Khôi phục dữ liệu demo.

---

## 📁 Cấu trúc Thư mục Dự án

```text
vku-room-booking/
├── src/
│   ├── api/
│   │   └── roomsApi.ts              # API kết nối & Fallback dữ liệu phòng VKU
│   ├── components/
│   │   ├── BookButton.tsx           # Custom Animated Button (withSpring - Slide 23)
│   │   ├── BookingCard.tsx          # Card hiển thị vé đặt & tích hợp swipe
│   │   ├── EmptyState.tsx           # Component trạng thái trống (Slide 13)
│   │   ├── ErrorBanner.tsx          # Banner lỗi kết nối có nút Retry (Slide 18)
│   │   ├── FilterChip.tsx           # Chip chọn tòa nhà & danh mục
│   │   ├── LoadingSpinner.tsx       # Loading indicator (Slide 18)
│   │   ├── RoomCard.tsx             # Card phòng với Reanimated entering (Slide 22)
│   │   └── SwipeToCancel.tsx        # Cử chỉ Pan Gesture Handler (Slide 26)
│   ├── constants/
│   │   ├── mockData.ts              # Dữ liệu phòng thực tế các khu A, V, K, Thư viện
│   │   └── theme.ts                 # Màu sắc & thiết kế chuẩn VKU
│   ├── hooks/
│   │   └── useRooms.ts              # Custom Hook TanStack Query (Slide 17)
│   ├── navigation/
│   │   ├── MainTabNavigator.tsx     # Bottom Tabs: Browse, Bookings, Profile (Slide 8)
│   │   ├── RootStackNavigator.tsx   # Native Stack + Modal Presentation (Slide 7, 9)
│   │   └── types.ts                 # Type-Safe Route Parameters (Slide 6)
│   ├── screens/
│   │   ├── BookingConfirmationScreen.tsx # Modal E-Ticket thẻ vào phòng
│   │   ├── BrowseRoomsScreen.tsx    # Màn hình tìm kiếm & lọc phòng
│   │   ├── MyBookingsScreen.tsx     # Màn hình quản lý vé đặt (Zustand selectors)
│   │   ├── ProfileScreen.tsx        # Màn hình sinh viên & quy định VKU
│   │   └── RoomDetailsScreen.tsx    # Màn hình chi tiết & form đặt phòng
│   ├── store/
│   │   └── bookingStore.ts          # Zustand store với persist AsyncStorage (Slide 12)
│   └── types/
│       └── index.ts                 # Interface Room, Booking, UserProfile
├── App.tsx                          # Root Component (NavigationContainer + QueryProvider)
├── TECHNICAL_REPORT.md              # Báo cáo kỹ thuật 2-4 trang nộp giảng viên
└── package.json
```

---
*Dự án hoàn thành phục vụ đánh giá Mini-Project 2 môn Phát triển Ứng dụng Di động Đa nền tảng tại VKU.*

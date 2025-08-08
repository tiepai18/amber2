import {
  LucideProps,
  Moon,
  SunMedium,
  ChevronLeft,
  ChevronRight,
  Laptop,
  Twitter,
  Check,
  User,
  Package,
  Heart,
  Settings,
  LogOut,
  CheckCircle,
  Mail,
  Loader2, // Thường dùng cho spinner
  Book,
  Calendar,
} from 'lucide-react'

export const Icons = {
  calendar: Calendar,
  book: Book,
  sun: SunMedium,
  moon: Moon,
  laptop: Laptop,
  twitter: Twitter,
  logo: ChevronRight, // Thay bằng icon logo của bạn
  close: ChevronLeft,
  check: Check,
  spinner: Loader2,
  user: User,
  package: Package,
  heart: Heart,
  settings: Settings,
  logOut: LogOut,
  checkCircle: CheckCircle,
  mail: Mail,
  google: (
    props: LucideProps // Ví dụ về icon tùy chỉnh nếu cần
  ) => (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Google</title>
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.9-4.82 1.9-5.78 0-10.42-4.64-10.42-10.42s4.64-10.42 10.42-10.42c3.22 0 5.43 1.28 6.75 2.52l2.7-2.7C19.5 1.14 16.38 0 12.48 0 5.6 0 0 5.6 0 12.5s5.6 12.5 12.48 12.5c7.22 0 11.98-4.92 11.98-12.22 0-.76-.08-1.48-.2-2.18h-11.5z" />
    </svg>
  ),
}

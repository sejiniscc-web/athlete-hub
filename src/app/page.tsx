import Link from 'next/link'
import { Activity, Users, Shield, BarChart3, Clock, Globe } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-black" dir="rtl">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Tiger Stripes Background */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              background: `repeating-linear-gradient(
                90deg,
                #000 0px,
                #000 40px,
                #FFD700 40px,
                #FFD700 80px
              )`,
            }}
          />
        </div>

        <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#FFD700] rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-xl">1</span>
            </div>
            <div>
              <h1 className="text-[#FFD700] font-bold text-xl">نادي الاتحاد</h1>
              <p className="text-gray-400 text-xs">نظام إدارة الأداء</p>
            </div>
          </div>
          <Link
            href="/login"
            className="px-6 py-2 bg-[#FFD700] text-black font-semibold rounded-lg hover:bg-[#D4AF00] transition-colors"
          >
            تسجيل الدخول
          </Link>
        </nav>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="w-32 h-32 bg-[#FFD700] rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-[#FFD700]/20">
            <span className="text-black font-bold text-6xl">1</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            نظام إدارة أداء <span className="text-[#FFD700]">الرياضيين</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            منصة متكاملة لتتبع وتقييم أداء رياضيي نادي الاتحاد السعودي - العميد منذ 1927
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/login"
              className="px-8 py-4 bg-[#FFD700] text-black font-bold rounded-lg hover:bg-[#D4AF00] transition-all hover:scale-105 shadow-lg shadow-[#FFD700]/30"
            >
              ابدأ الآن
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 border-2 border-[#FFD700] text-[#FFD700] font-bold rounded-lg hover:bg-[#FFD700] hover:text-black transition-all"
            >
              اعرف المزيد
            </Link>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">مميزات النظام</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              نظام شامل لإدارة جميع جوانب أداء الرياضيين
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-black/50 border border-gray-800 rounded-xl p-8 hover:border-[#FFD700] transition-colors group">
              <div className="w-14 h-14 bg-[#FFD700]/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#FFD700]/20 transition-colors">
                <Users className="text-[#FFD700]" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">إدارة الرياضيين</h3>
              <p className="text-gray-400">
                ملفات شاملة لكل رياضي تتضمن البيانات الشخصية والجسمية والرياضية
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-black/50 border border-gray-800 rounded-xl p-8 hover:border-[#FFD700] transition-colors group">
              <div className="w-14 h-14 bg-[#FFD700]/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#FFD700]/20 transition-colors">
                <Activity className="text-[#FFD700]" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">تقييم اللياقة</h3>
              <p className="text-gray-400">
                اختبارات لياقة بدنية شاملة مع متابعة التطور عبر الوقت
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-black/50 border border-gray-800 rounded-xl p-8 hover:border-[#FFD700] transition-colors group">
              <div className="w-14 h-14 bg-[#FFD700]/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#FFD700]/20 transition-colors">
                <Shield className="text-[#FFD700]" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">السجلات الطبية</h3>
              <p className="text-gray-400">
                متابعة الحالة الصحية والإصابات والعلاجات لكل رياضي
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-black/50 border border-gray-800 rounded-xl p-8 hover:border-[#FFD700] transition-colors group">
              <div className="w-14 h-14 bg-[#FFD700]/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#FFD700]/20 transition-colors">
                <BarChart3 className="text-[#FFD700]" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">التحليل والتقارير</h3>
              <p className="text-gray-400">
                تقارير تفصيلية وإحصائيات شاملة لاتخاذ قرارات مبنية على البيانات
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-black/50 border border-gray-800 rounded-xl p-8 hover:border-[#FFD700] transition-colors group">
              <div className="w-14 h-14 bg-[#FFD700]/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#FFD700]/20 transition-colors">
                <Clock className="text-[#FFD700]" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">متابعة فورية</h3>
              <p className="text-gray-400">
                تحديثات لحظية وإشعارات فورية لجميع الأنشطة والتغييرات
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-black/50 border border-gray-800 rounded-xl p-8 hover:border-[#FFD700] transition-colors group">
              <div className="w-14 h-14 bg-[#FFD700]/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#FFD700]/20 transition-colors">
                <Globe className="text-[#FFD700]" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">وصول متعدد</h3>
              <p className="text-gray-400">
                صلاحيات مخصصة للأطباء والمدربين والإداريين والرياضيين
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-5xl font-bold text-[#FFD700] mb-2">1927</p>
              <p className="text-gray-400">سنة التأسيس</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-[#FFD700] mb-2">+50</p>
              <p className="text-gray-400">رياضي نشط</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-[#FFD700] mb-2">+100</p>
              <p className="text-gray-400">تقييم شهري</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-[#FFD700] mb-2">24/7</p>
              <p className="text-gray-400">متابعة مستمرة</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#FFD700]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-black mb-6">
            ابدأ في تطوير أداء رياضييك اليوم
          </h2>
          <p className="text-black/70 text-xl mb-8">
            انضم إلى منظومة نادي الاتحاد لإدارة الأداء الرياضي
          </p>
          <Link
            href="/login"
            className="inline-block px-10 py-4 bg-black text-[#FFD700] font-bold rounded-lg hover:bg-gray-900 transition-all hover:scale-105 shadow-lg"
          >
            تسجيل الدخول
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FFD700] rounded-full flex items-center justify-center">
                <span className="text-black font-bold">1</span>
              </div>
              <div>
                <p className="text-[#FFD700] font-bold">نادي الاتحاد السعودي</p>
                <p className="text-gray-500 text-sm">العميد - نادي الوطن</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm">
              جميع الحقوق محفوظة © 2024 نادي الاتحاد السعودي
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

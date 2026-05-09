// app/page.tsx
import { FloatingLogo } from "@/components/FloatingLogo/FloatingLogo";
import { TextSwitcher } from "@/components/TextSwitcher/TextSwitcher";
import LoadingScreen from "@/components/loading/LoadingScreen";
import MultipleItemsOffer from "@/components/react-slick/react-slickOffer";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Tag, Shield, Truck, Headphones, Star, ArrowLeft } from "lucide-react";

const sections = [
  { 
    name: "لابتوبات", 
    href: "/laptops", 
    img: "/Design27.jpeg",
    description: "أسعار جملة وكفالة حقيقية وهدايا مميزة",
    color: "from-blue-600 to-indigo-600"
  },
  { 
    name: "كومبيوتر", 
    href: "/computer", 
    img: "/Design28.jpeg",
    description: "جميع قطع الكومبيوتر مع أحدث الشاشات",
    color: "from-purple-600 to-pink-600"
  },
  { 
    name: "اكسسوارات", 
    href: "/accessories", 
    img: "/Design29.jpeg",
    description: "اكسسوارات مميزة لجميع الأجهزة",
    color: "from-emerald-600 to-teal-600"
  },
];

export const metadata = {
  title: "سبيس نت ستور سوريا بحصة",
  description:
    "اسعار اللابتوبات والاكسسوارات وقطع الكومبيوتر في دمشق - سوق البحصة",
  keywords:
    "اسعار الابتوبات في سوريا, اسعار الاكسسوارات في دمشق, اسعار قطع الكومبيوتر في سوريا, سوق البحصة, لابتوبات البحصه",
};

export default function HomePage() {
  return (
    <>
      <LoadingScreen />
      
      <main className="pt-[80px]">
        
        {/* Hero Section */}
        <FloatingLogo />
        
        {/* Welcome Section */}
        <section className="py-16 px-4 flex items-center justify-center">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl p-8 text-center max-w-2xl w-full border border-blue-100">
            <div className="inline-block p-3 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 mb-4">
              <Sparkles className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              مرحباً بكم في سبيس نت ستور
            </h1>
            <TextSwitcher />
          </div>
        </section>

        {/* Offers Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20">
              <Tag className="w-7 h-7 md:w-9 md:h-9 text-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                عروض الأسبوع
              </h2>
              <p className="text-gray-500 mt-1">عروض كل أسبوع شكل</p>
            </div>
          </div>
          <MultipleItemsOffer productModule="LAPTOP" />
        </div>

        {/* Categories Grid */}
        <section className="py-16 px-6">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                أقسامنا
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                اكتشف أفضل العروض والمنتجات في أقسامنا المتنوعة
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {sections.map((section) => (
                <Link
                  key={section.name}
                  href={section.href}
                  className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br ">
                    <Image
                      src={section.img}
                      alt={section.name}
                      fill
                      className="object-contain p-6 group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Overlay Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${section.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 text-center">
                    <h3 className={`text-2xl font-bold bg-gradient-to-r ${section.color} bg-clip-text text-transparent mb-2`}>
                      {section.name}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {section.description}
                    </p>
                    
                    {/* Features */}
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                      <div className="flex items-center gap-1 bg-gray-100 rounded-full px-2 py-1">
                        <Truck className="w-3 h-3 text-blue-600" />
                        <span className="text-xs text-gray-600">توصيل</span>
                      </div>
                      <div className="flex items-center gap-1 bg-gray-100 rounded-full px-2 py-1">
                        <Shield className="w-3 h-3 text-purple-600" />
                        <span className="text-xs text-gray-600">كفالة</span>
                      </div>
                      <div className="flex items-center gap-1 bg-gray-100 rounded-full px-2 py-1">
                        <Headphones className="w-3 h-3 text-green-600" />
                        <span className="text-xs text-gray-600">دعم</span>
                      </div>
                    </div>
                    
                    <span className={`inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${section.color} bg-clip-text text-transparent group-hover:gap-3 transition-all duration-300`}>
                      تسوق الآن
                      <ArrowLeft className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Why Us Section */}
        <section className="py-20 px-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="inline-block p-3 rounded-full bg-white/20 backdrop-blur-sm mb-6">
              <Star className="w-8 h-8 text-yellow-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              لماذا نحن؟
            </h2>
            <p className="text-lg md:text-xl text-blue-200 mb-12 leading-relaxed">
              لأننا نقدم لك أحدث وأدق الأسعار في سوق البحصة بدمشق، حيث تجد أفضل الصفقات وجودة الإلكترونيات العالية وأسعار منافسة مع كفالة ذهبية ودعم فني مستمر.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-3xl md:text-4xl font-bold text-yellow-400">500+</div>
                <p className="text-gray-200 mt-2">عميل سعيد</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-3xl md:text-4xl font-bold text-yellow-400">100%</div>
                <p className="text-gray-200 mt-2">ضمان الجودة</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-3xl md:text-4xl font-bold text-yellow-400">24/7</div>
                <p className="text-gray-200 mt-2">دعم فني</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-3xl md:text-4xl font-bold text-yellow-400">30</div>
                <p className="text-gray-200 mt-2">أيام استبدال</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
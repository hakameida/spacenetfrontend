// pages/index.tsx
import { FloatingLogo } from "@/components/FloatingLogo/FloatingLogo";
import { TextSwitcher } from "@/components/TextSwitcher/TextSwitcher";
import Image from "next/image";
import Link from "next/link";

const sections = [
    { name: "لابتوبات", href: "/laptops", img: "/111.jpg" },
  { name: "كومبيوتر", href: "/computer", img: "/al.jpg" },
    { name: "اكسسوارات", href: "/accessories", img: "/1234.jpg" },
  { name: "موبايلات", href: "/mobiles", img: "/s25.jpg" },
  
  { name: "بطاريات", href: "/batteries", img: "/bat.jpg" },
  { name: "برامج", href: "/programms", img: "/images.png" },
  { name: "بلايستيشن", href: "/playstation", img: "/pla.jpg" },
  { name: "طابعات", href: "/printers", img: "/b.jpg" },
];

// 🧠 Centralized descriptions
const sectionDescriptions: { [key: string]: string } = {
  "كومبيوتر": "جميع قطع الكومبيوتر مع احدث الشاشات ",
  "موبايلات": "احدث الموديلات وافضل الاسعار",
  "اكسسوارات": "اكسسوارات مميزة لجميع الأجهزة.",
  "لابتوبات": "أسعار جملة وكفالة حقيقية وهدايا مميزة",
  "بلايستيشن": "سعر مميز و تخديم كامل",
  "طابعات": "متوفر قريبا",
  "بطاريات": "بطاريات أصلية تدوم طويلاً.",
  "برامج": "جميع اصدار البرامج مع الكراكات.",
};

export const metadata = {
  title: "سبيس نت ستور سوريا بحصة",
  description:
    "اسعار اللابتوبات والموبايلات والاكسسوارات وقطع الكومبيوتر في دمشق - سوق البحصة",
  keywords:
    "اسعار الابتوبات في سوريا , اسعار الموبايلات في دمشق, اسعار الاكسسوارات في دمشق, اسعار قطع الكومبيتر في سوريا , سوق البحصة, لابتوبات البحصه ",
};

export default function HomePage() {
  return (
    <>
      <main>
        {/* 🎯 Hero Section */}
        <FloatingLogo />
        <section className="py-16 px-4 flex items-center justify-center">
          <div className="bg-white border border-blue-300 rounded-xl shadow-md p-6 text-center max-w-2xl w-full">
            <h1 className="text-4xl font-bold text-blue-800 mb-4">
              مرحباً بكم في سبيس نت ستور
            </h1>
            <TextSwitcher />
          </div>
        </section>

        {/* 🔲 Section Grid */}
        <section
          className="py-20 px-6"
          style={{
            backgroundImage: "url('/image.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-8">
            {sections.map((section) => (
              <Link
                key={section.name}
                href={section.href}
                className="group bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300"
              >
                <Image
                  src={section.img}
                  alt={section.name}
                  width={100}
                  height={100}
                  className="mb-4 object-contain"
                />
                <h2 className="text-xl font-bold text-blue-800 group-hover:underline">
                  {section.name}
                </h2>
                <p className="text-gray-600 text-center mt-2">
                  {sectionDescriptions[section.name] ||
                    `أفضل الأسعار لـ ${section.name} في سوق البحصة.`}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* 💬 Why Us Section */}
        <section className="py-16 px-4 flex items-center justify-center">
          <div className="bg-white border border-gray-300 rounded-xl shadow-lg p-8 max-w-xl text-center"
  >
          <h2 className="text-2xl font-bold text-blue-800 mb-4">لماذا نحن؟</h2>
          <p className="text-gray-700 max-w-xl mx-auto">
            لأننا نقدم لك أحدث وأدق الأسعار في سوق البحصة بدمشق، حيث تجد أفضل الصفقات وجودة الإلكترونيات  عالية وأسعار منافسة.
          </p>
          </div>
        </section>
      </main>
    </>
  );
}

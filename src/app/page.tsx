"use client";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const sections = [
  { name: "كومبيوتر", href: "/computer", img: "/logo.png" },
  { name: "موبايلات", href: "/mobiles", img: "/logo.png" },
  { name: "اكسسوارات", href: "/accessories", img: "/logo.png" },
  { name: "لابتوبات", href: "/laptops", img: "/logo.png" },
  { name: "بلايستيشن", href: "/playstation", img: "/logo.png" },
  { name: "طابعات", href: "/printers", img: "/logo.png" },
  { name: "بطاريات", href: "/batteries", img: "/logo.png" },
  { name: "برامج", href: "/programms", img: "/logo.png" },
];

export default function HomePage() {
  return (
    <>
      <Head>
        <title>سوق البحصة - اسعار الالكترونيات في دمشق</title>
        <meta
          name="description"
          content="اسعار اللابتوبات والموبايلات والاكسسوارات وقطع الكومبيوتر في دمشق - سوق البحصة"
        />
        <meta
          name="keywords"
          content="اسعار الابتوبات في دمشق, اسعار الموبايلات في دمشق, اسعار الاكسسوارات في دمشق, اسعار قطع الكومبيتر في دمشق, سوق البحصة, لابتوبات البحصه "
        />
      </Head>

      <main className="bg-white font-sans overflow-x-hidden">
        <section className="text-center py-16 px-4">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">مرحباً بكم في سبيس نت ستور</h1>
          <p className="text-lg text-gray-700">
            المكان الأفضل للحصول على افضل اسعار الالكترونيات في دمشق
          </p>
        </section>

        {sections.map((section, index) => (
          <section
            key={section.name}
            className={`py-12 px-4 flex flex-col md:flex-row items-center justify-between gap-8 ${
              index % 2 === 0 ? "bg-white" : "bg-gray-50"
            }`}
          >
            {index % 2 === 0 ? (
              <>
                <div className="md:w-1/2">
                  <Image
                    src={section.img}
                    alt={section.name}
                    width={400}
                    height={300}
                    className="rounded-xl shadow rotate-[-3deg]"
                  />
                </div>
                <div className="md:w-1/2 text-right">
                  <Link href={section.href}>
                    <h2 className="text-2xl font-bold text-blue-800 mb-2 cursor-pointer hover:underline">
                      {section.name}
                    </h2>
                  </Link>
                  <p className="text-gray-600">تعرف على أفضل أسعار {section.name} في سوق البحصة.</p>
                </div>
              </>
            ) : (
              <>
                <div className="md:w-1/2 text-right">
                  <Link href={section.href}>
                    <h2 className="text-2xl font-bold text-blue-800 mb-2 cursor-pointer hover:underline">
                      {section.name}
                    </h2>
                  </Link>
                  <p className="text-gray-600">استعرض أسعار {section.name} المحدثة يومياً.</p>
                </div>
                <div className="md:w-1/2">
                  <Image
                    src={section.img}
                    alt={section.name}
                    width={400}
                    height={300}
                    className="rounded-xl shadow rotate-[3deg]"
                  />
                </div>
              </>
            )}
          </section>
        ))}

        <section className="bg-blue-50 py-16 px-4 text-center">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">لماذا نحن؟</h2>
          <p className="text-gray-700 max-w-xl mx-auto">
            لأننا نقدم لك أحدث وأدق معلومات الأسعار في سوق البحصة بدمشق، حيث تجد أفضل الصفقات والإلكترونيات بجودة عالية وأسعار منافسة.
          </p>
        </section>

     
      </main>
    </>
  );
}

'use client'
import React, { useState } from "react";
import type { Viewport } from "next";

// ✅ Viewport configuration (modern & correct)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: true,
};
// export const metadata = {
//   title: "بطاريات لابتوب  سبيس نت ستور",
//   description:
//     "بطاريات بارخص الاسعار وافضل الانواع في سبيس ستور  ",
//   keywords:
//     "بيع بطاريات بحصه  , بطاريات جودة عالية بحصه , بطاريات بارخص الاسعار بحصه ",
// };
export default function Home() {
  const [phone, setPhone] = useState("");
  const [model, setModel] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const message = `📞 رقم الهاتف: ${phone}\n🔋 موديل البطارية: ${model}`;

    // Replace these with your actual bot token and chat ID
    const BOT_TOKEN = '7899813819:AAEbzndOkH6dA0qiwYd-BckHA7PZu-17w14';
    const CHAT_ID = '773627573';

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    try {
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
        }),
      });
      alert("تم الإرسال بنجاح ✅");
      setPhone("");
      setModel("");
    } catch (error) {
      alert("حدث خطأ! حاول مرة أخرى.");
    }
  };

  return (
    <div className="container mx-auto w-[90%] my-8 mb-16 flex flex-col items-center gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full">
        <h2 className="text-center text-xl font-bold mb-4 text-gray-800">
          فقط ضع رقمك و موديل البطارية وسوف نرد برساله
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="رقم الهاتف"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-right"
            required
          />
          <input
            type="text"
            placeholder="موديل البطارية"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-right"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition"
          >
            ارسال
          </button>
        </form>
      </div>
    </div>
  );
}

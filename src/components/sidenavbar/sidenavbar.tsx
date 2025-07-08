// "use client";

// import { useState } from "react";
// import { usePathname } from "next/navigation";

// const navLinks = [
//   { name: "كومبيوتر", href: "/computer" },
//   { name: "موبايلات", href: "/mobiles" },
//   { name: "اكسسوارات", href: "/accessories" },
//   { name: "لابتوبات", href: "/" },
//   { name: "بلايستيشن", href: "/playstation" },
//   { name: "طابعات", href: "/printers" },
//   { name: "بطاريات", href: "/batteries" },
// ];

// const SideNav = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const pathname = usePathname();

//   return (
//     <>
//       {/* Glowing "أقسام" Button */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         title="القائمة"
//         className={`fixed top-[90px] z-50 bg-gradient-to-r from-red-600 to-blue-600 text-white text-sm font-bold rounded-full shadow-xl px-5 py-2 hover:scale-110 transition-all duration-300 animate-glow-button
//           ${isOpen ? "left-56" : "left-4"}
//         `}
//       >
//         أقسام
//       </button>

//       {/* Sidebar */}
//       <aside
//         className={`fixed top-[80px] left-0 h-[calc(100vh-80px)] w-56 z-40 transition-transform duration-300 transform
//           ${isOpen ? "translate-x-0" : "-translate-x-full"}
//         `}
//       >
//         <div className="h-full w-full p-4 bg-white/10 backdrop-blur-md border-r border-white/20 shadow-xl flex flex-col gap-4">
//           {navLinks.map((link) => (
//             <a
//               key={link.name}
//               href={link.href}
//               className={`relative px-4 py-3 rounded-md text-Blue font-bold text-base text-right hover:scale-105 transition duration-300
//                 ${pathname === link.href ? "bg-gradient-to-r from-red-500 to-blue-500 ring-2 ring-white" : "bg-white/5"}
//                 animate-glow-modern
//               `}
//             >
//               {link.name}
//             </a>
//           ))}
//         </div>
//       </aside>
//     </>
//   );
// };

// export default SideNav;

// import React from 'react';
// import { useTheme } from '../utils/hooks';
// import { Sun, Moon, Palette } from 'lucide-react';

// export const ThemeSwitcher = () => {
//   const { theme, setTheme, customTheme, updateCustomTheme } = useTheme();
//   const [showCustom, setShowCustom] = React.useState(false);

//   return (
//     <div className="relative group">
//       <button
//         className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
//         title="Theme"
//       >
//         {theme === 'dark' ? (
//           <Moon size={20} />
//         ) : theme === 'light' ? (
//           <Sun size={20} />
//         ) : (
//           <Palette size={20} />
//         )}
//       </button>

//       <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 hidden group-hover:block z-50">
//         <div className="space-y-2">
//           <button
//             onClick={() => setTheme('light')}
//             className={`w-full px-3 py-2 rounded text-left text-sm ${
//               theme === 'light'
//                 ? 'bg-emerald-500 text-white'
//                 : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
//             }`}
//           >
//             ☀️ Light Mode
//           </button>
//           <button
//             onClick={() => setTheme('dark')}
//             className={`w-full px-3 py-2 rounded text-left text-sm ${
//               theme === 'dark'
//                 ? 'bg-emerald-500 text-white'
//                 : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
//             }`}
//           >
//             🌙 Dark Mode
//           </button>
//           <button
//             onClick={() => setShowCustom(!showCustom)}
//             className={`w-full px-3 py-2 rounded text-left text-sm ${
//               theme === 'custom'
//                 ? 'bg-emerald-500 text-white'
//                 : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
//             }`}
//           >
//             🎨 Custom Mode
//           </button>

//           {showCustom && (
//             <div className="border-t pt-2 mt-2 space-y-2">
//               <div>
//                 <label className="text-xs text-gray-600 dark:text-gray-400">Primary</label>
//                 <div className="flex gap-2">
//                   <input
//                     type="color"
//                     value={customTheme.primary}
//                     onChange={(e) => {
//                       updateCustomTheme(e.target.value, customTheme.accent);
//                       setTheme('custom');
//                     }}
//                     className="w-8 h-8 rounded cursor-pointer"
//                   />
//                   <span className="text-xs break-all">{customTheme.primary}</span>
//                 </div>
//               </div>
//               <div>
//                 <label className="text-xs text-gray-600 dark:text-gray-400">Accent</label>
//                 <div className="flex gap-2">
//                   <input
//                     type="color"
//                     value={customTheme.accent}
//                     onChange={(e) => {
//                       updateCustomTheme(customTheme.primary, e.target.value);
//                       setTheme('custom');
//                     }}
//                     className="w-8 h-8 rounded cursor-pointer"
//                   />
//                   <span className="text-xs break-all">{customTheme.accent}</span>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };


import React from 'react';
import { useTheme } from '../utils/hooks';
import { Sun, Moon } from 'lucide-react';

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
      title="Toggle Theme"
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};
// import React, { useEffect, useState } from "react";

// const Rough = () => {
//   const [active, setActive] = useState(false);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setActive((prev) => !prev);
//     }, 2000);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="ai-section">
//       <img src="@/Downloads/line.webp" alt="" />
//       {/* Toggle */}
//       <div className="toggle-box">
//         <span>AI Powered Escalation</span>

//         <div className={`toggle ${active ? "active" : ""}`}>
//           <div className="circle"></div>
//         </div>
//       </div>

//       <div className="w-full h-full">
//         <div className="pipemain">
//           {/* PIPE SVG */}
//           <svg
//             className="pipe"
//             xmlns="http://www.w3.org/2000/svg"
//             width="279"
//             height="217"
//             viewBox="0 0 279 217"
//             fill="none"
//           >
//             <defs>
//               <linearGradient id="pipeGradient" gradientUnits="userSpaceOnUse">
//                 <stop offset="0%" stopColor="#7B4DFF" />
//                 <stop offset="100%" stopColor="#FF2BD6" />
//               </linearGradient>
//             </defs>

//             {/* horizontal line */}
//             <path
//               className="gridCards_line"
//               d="M0 56H169"
//               stroke={active ? "url(#pipeGradient)" : "#ddd"}
//               strokeLinecap="round"
//               strokeWidth="10"
//             />

//             {/* curved pipe */}
//             <path
//               className="gridCards_line"
//               d="M36.5 217V192.5C36.5 176.484 49.4837 163.5 65.5 163.5H195.5C211.516 163.5 224.5 150.516 224.5 134.5V108.5"
//               stroke={active ? "url(#pipeGradient)" : "#ddd"}
//               strokeWidth="10"
//               fill="none"
//             />

//             {/* avatar circle */}
//             <rect
//               className="gridCards_box"
//               x="167"
//               y="0"
//               width="112"
//               height="112"
//               rx="56"
//               fill="#f6f4ff"
//               stroke="#fff"
//             />
//           </svg>
//         </div>
//       </div>

//       {/* Avatar */}
//       <div className={`avatar ${active ? "active" : ""}`}>
//         <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="" />
//         <div className="badge">1</div>
//       </div>

//       {/* Chat Card */}
//       <div className={`chat-card ${active ? "on" : "off"}`}>
//         <div className="message">
//           Hi, this is John. I totally understood your issue. Give me 2 minutes
//           for this.
//           <span className="time">05:41 pm</span>
//         </div>

//         <div className="mini-avatar">
//           <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Rough;

import React from 'react'

const rough = () => {
  return (
    <div>
      rough
    </div>
  )
}

export default rough


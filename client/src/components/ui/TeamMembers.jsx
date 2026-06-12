// const teamMembers = [
//   {
//     initials: "LM",
//     name: "Lalit Mehra",
//     title: "Full Stack Developer",
//     badge: "Backend · Frontend · Database",
//     badgeIcon: "💻",
//     colorKey: "purple",
//     responsibilities: [
//       "Backend API development & frontend integration",
//       "Authentication & CRUD operations",
//       "Database management & cloud deployment",
//     ],
//   },
//   {
//     initials: "RM",
//     name: "Rohan Mehra",
//     title: "Systems Analyst",
//     badge: "Design · Architecture · Scheduling",
//     badgeIcon: "🗂️",
//     colorKey: "teal",
//     responsibilities: [
//       "System & data architecture design",
//       "DFD, I/O design & project scheduling",
//       "Planning and structuring project workflow",
//     ],
//   },
//   {
//     initials: "RS",
//     name: "Rudra Singh",
//     title: "QA & Documentation Lead",
//     badge: "Documentation · Testing · Feasibility",
//     badgeIcon: "📄",
//     colorKey: "amber",
//     responsibilities: [
//       "Project documentation & report organization",
//       "Software testing & feasibility analysis",
//       "Multi-level testing for system functionality",
//     ],
//   },
//   {
//     initials: "RR",
//     name: "Ritesh Rawat",
//     title: "Implementation Coordinator",
//     badge: "Analysis · Implementation · Reports",
//     badgeIcon: "📋",
//     colorKey: "coral",
//     responsibilities: [
//       "Existing system analysis & study",
//       "Implementation details & team coordination",
//       "Reports on functionality & future improvements",
//     ],
//   },
// ];

// const colorMap = {
//   purple: {
//     avatar: "bg-purple-100 text-purple-800",
//     badge: "bg-purple-100 text-purple-800",
//     dot: "bg-purple-500",
//   },
//   teal: {
//     avatar: "bg-teal-100 text-teal-800",
//     badge: "bg-teal-100 text-teal-800",
//     dot: "bg-teal-500",
//   },
//   amber: {
//     avatar: "bg-amber-100 text-amber-800",
//     badge: "bg-amber-100 text-amber-800",
//     dot: "bg-amber-500",
//   },
//   coral: {
//     avatar: "bg-orange-100 text-orange-800",
//     badge: "bg-orange-100 text-orange-800",
//     dot: "bg-orange-500",
//   },
// };

// export default function TeamCards() {
//   return (
//     <div className="py-6">
//       <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-5">
//         Our Team
//       </p>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//         {teamMembers.map((member) => {
//           const colors = colorMap[member.colorKey];
//           return (
//             <div
//               key={member.initials}
//               className="glass-card flex flex-col gap-4 hover:border-white/30 transition-colors"
//             >
//               {/* Avatar + Name */}
//               <div className="flex items-center gap-3">
//                 <div
//                   className={`w-12 h-12 rounded-full flex items-center justify-center font-medium text-base flex-shrink-0 ${colors.avatar}`}
//                 >
//                   {member.initials}
//                 </div>
//                 <div>
//                   <p className="font-semibold text-sm">{member.name}</p>
//                   <p className="text-xs opacity-60">{member.title}</p>
//                 </div>
//               </div>

//               {/* Badge */}
//               <span
//                 className={`text-xs font-medium px-3 py-1 rounded-full w-fit ${colors.badge}`}
//               >
//                 {member.badge}
//               </span>

//               <hr className="border-white/10" />

//               {/* Responsibilities */}
//               <ul className="flex flex-col gap-2">
//                 {member.responsibilities.map((r) => (
//                   <li key={r} className="flex items-start gap-2 text-xs opacity-70 leading-relaxed">
//                     <span
//                       className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${colors.dot}`}
//                     />
//                     {r}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
const teamMembers = [
  {
    initials: "LM",
    name: "Lalit Mehra",
    photo: "/images/lalit.jpg",   // ← add your photo path here
    title: "Full Stack Developer",
    badge: "Backend · Frontend · Database",
    colorKey: "purple",
    responsibilities: [
      "Backend API development & frontend integration",
      "Authentication & CRUD operations",
      "Database management & cloud deployment",
    ],
  },
  {
    initials: "RM",
    name: "Rohan Mehra",
    photo: "/images/rohan.jpg",   // ← add your photo path here
    title: "Systems Analyst",
    badge: "Design · Architecture · Scheduling",
    colorKey: "teal",
    responsibilities: [
      "System & data architecture design",
      "DFD, I/O design & project scheduling",
      "Planning and structuring project workflow",
    ],
  },
  {
    initials: "RS",
    name: "Rudra Singh",
    photo: "/images/rudra.jpg",   // ← add your photo path here
    title: "QA & Documentation Lead",
    badge: "Documentation · Testing · Feasibility",
    colorKey: "amber",
    responsibilities: [
      "Project documentation & report organization",
      "Software testing & feasibility analysis",
      "Multi-level testing for system functionality",
    ],
  },
  {
    initials: "RR",
    name: "Ritesh Rawat",
    photo: "/images/ritesh.jpg",  // ← add your photo path here
    title: "Implementation Coordinator",
    badge: "Analysis · Implementation · Reports",
    colorKey: "coral",
    responsibilities: [
      "Existing system analysis & study",
      "Implementation details & team coordination",
      "Reports on functionality & future improvements",
    ],
  },
];

const colorMap = {
  purple: {
    avatar: "bg-purple-100 text-purple-800",
    badge: "bg-purple-100 text-purple-800",
    dot: "bg-purple-500",
    ring: "ring-purple-300",
  },
  teal: {
    avatar: "bg-teal-100 text-teal-800",
    badge: "bg-teal-100 text-teal-800",
    dot: "bg-teal-500",
    ring: "ring-teal-300",
  },
  amber: {
    avatar: "bg-amber-100 text-amber-800",
    badge: "bg-amber-100 text-amber-800",
    dot: "bg-amber-500",
    ring: "ring-amber-300",
  },
  coral: {
    avatar: "bg-orange-100 text-orange-800",
    badge: "bg-orange-100 text-orange-800",
    dot: "bg-orange-500",
    ring: "ring-orange-300",
  },
};

function MemberAvatar({ member, colors }) {
  const [imgError, setImgError] = useState(false);

  if (member.photo && !imgError) {
    return (
      <img
        src={member.photo}
        alt={member.name}
        onError={() => setImgError(true)}
        className={`w-40 h-40 rounded-full object-cover object-top flex-shrink-0 ring-2 ${colors.ring}`}
      />
    );
  }

  return (
    <div
      className={`w-40 h-40 rounded-full flex items-center justify-center font-medium text-base flex-shrink-0 ring-2 ${colors.ring} ${colors.avatar}`}
    >
      {member.initials}
    </div>
  );
}

export default function TeamCards() {
  return (
    <div className="py-6">
      <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-5">
        Our Team
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {teamMembers.map((member) => {
          const colors = colorMap[member.colorKey];
          return (
            <div
              key={member.initials}
              className="glass-card flex flex-col gap-4 hover:border-white/30 transition-colors"
            >
              {/* Avatar + Name */}
              <div className="flex items-center gap-3">
                <MemberAvatar member={member} colors={colors} />
                <div>
                  <p className="font-semibold text-sm">{member.name}</p>
                  <p className="text-xs opacity-60">{member.title}</p>
                </div>
              </div>

              {/* Badge */}
              <span className={`text-xs font-medium px-3 py-1 rounded-full w-fit ${colors.badge}`}>
                {member.badge}
              </span>

              <hr className="border-white/10" />

              {/* Responsibilities */}
              <ul className="flex flex-col gap-2">
                {member.responsibilities.map((r) => (
                  <li key={r} className="flex items-start gap-2 text-xs opacity-70 leading-relaxed">
                    <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${colors.dot}`} />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
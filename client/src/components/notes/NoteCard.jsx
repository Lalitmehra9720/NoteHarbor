import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaThumbtack, FaArrowRight, FaEdit, FaTrash } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
import { jsPDF } from "jspdf";

const NoteCard = ({ note, onEdit, onDelete, onPin, search }) => {
  const navigate = useNavigate();

  // 🔥 Highlight function
  const highlightText = (text, query) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");

    return text.split(regex).map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="bg-yellow-400 text-black px-1 rounded">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

//   const handleShare = async (e) => {
//   // e.stopPropagation prevents the card's "onClick" (like opening the modal) from firing
//   e.stopPropagation(); 

//   const shareData = {
//     title: note.title,
//     text: `📌 *${note.title}*\n\n${note.content}\n\n_Shared via Note-Harbor_`,
//   };

//   try {
//     // Check if the browser supports the native Share API (works on Mobile & Safari)
//     if (navigator.share) {
//       await navigator.share(shareData);
//     } else {
//       // Fallback: Direct WhatsApp Link for Desktop/Unsupported browsers
//       const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
//         shareData.text
//       )}`;
//       window.open(whatsappUrl, "_blank");
//     }
//   } catch (err) {
//     console.error("Error sharing:", err);
//   }
// };

const handleShare = async (e) => {
  e.stopPropagation();

  try {
    // 1. Create PDF
    const doc = new jsPDF();
    
    // Styling the PDF
    doc.setFontSize(20);
    doc.text(note.title, 10, 20); // Title at top
    
    doc.setFontSize(12);
    const splitContent = doc.splitTextToSize(note.content, 180); // Wrap text
    doc.text(splitContent, 10, 30);
    
    // 2. Generate PDF as a Blob
    const pdfBlob = doc.output("blob");
    
    // 3. Create a File object from the Blob
    const file = new File([pdfBlob], `${note.title}.pdf`, { type: "application/pdf" });

    // 4. Check if the browser can share files
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: note.title,
        text: `Check out this note: ${note.title}`,
      });
    } else {
      // Fallback: If sharing files isn't supported, just download it
      doc.save(`${note.title}.pdf`);
      toast.success("Sharing not supported, PDF downloaded instead!");
    }
  } catch (err) {
    console.error("PDF Share Error:", err);
    toast.error("Could not share PDF");
  }
};
  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      className="
        relative p-6 rounded-2xl cursor-pointer
        flex flex-col h-[220px]
        overflow-hidden group
        transition-all duration-300
      "
      style={{
        background: "var(--glass)",
        backdropFilter: "blur(12px)",
        border: "1px solid var(--border)",
      }}
      onClick={() => navigate(`/note/${note._id}`)}
    >
      {/* 🔥 Glow Effect (fixed layering) */}
      <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 via-transparent to-purple-500/30 blur-2xl"></div>
      </div>

      {/* 🔥 Buttons */}

      <div
        className="absolute top-3 right-3 flex gap-2 items-center z-30"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 📌 PIN */}
        <button
          title="pin"
          onClick={() => onPin(note._id)}
          className={`
      w-9 h-9 flex items-center justify-center rounded-lg
      backdrop-blur-md border transition
      ${
        note.isPinned
          ? "bg-yellow-400/20 text-yellow-400 border-yellow-400/40"
          : "bg-white/5 text-gray-400 border-transparent hover:text-yellow-400 hover:bg-yellow-400/10"
      }
    `}
        >
          <FaThumbtack size={14} />
        </button>

        {/* ✏️ EDIT */}
        <button
          onClick={(e) => e.stopPropagation() || onEdit(note)}
          className="
      w-9 h-9 flex items-center justify-center rounded-lg
      bg-white/5 text-blue-400
      hover:bg-blue-400/10 hover:text-blue-500
      backdrop-blur-md transition border border-transparent
    "
          title="edit"
        >
          <FaEdit size={14} />
        </button>

        {/* 🗑️ DELETE */}
        <button
          onClick={() => onDelete(note._id)}
          className="
      w-9 h-9 flex items-center justify-center rounded-lg
      bg-white/5 text-red-400
      hover:bg-red-400/10 hover:text-red-500
      backdrop-blur-md transition border border-transparent
    "
          title="delete"
        >
          <FaTrash size={14} />
        </button>
      </div>

      {/* 🔥 Title */}
      <h2 className="font-semibold text-lg mb-2 line-clamp-1 z-10">
        {highlightText(note.title, search)}
      </h2>

      {/* 🔥 Content */}
      <p
        className="line-clamp-4 break-words flex-1 z-10"
        style={{ opacity: 0.7 }}
      >
        {highlightText(note.content, search)}
      </p>

      {/* 🔥 Hover Overlay (FIXED) */}
      <div
        className="
    absolute inset-0 z-20
    flex items-center justify-center
    opacity-0 group-hover:opacity-100
    transition duration-300
    bg-gradient-to-br from-black/20 via-black/10 to-black/20 backdrop-blur-sm
  "
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/note/${note._id}`);
          }}
          className="
      flex items-center gap-2
      px-5 py-2.5 rounded-xl
      bg-indigo-600 text-white
      hover:bg-indigo-700
      transition
      shadow-xl
    "
        >
          Read More <FaArrowRight />
        </button>
        <button
  onClick={handleShare}
  className="p-2 rounded-full hover:bg-white/20 transition-all duration-200 group"
  title="Share Note"
>
  <FiShare2 className="text-lg opacity-60 group-hover:opacity-100 group-hover:scale-110" />
</button>
      </div>
    </motion.div>
  );
};

export default NoteCard;

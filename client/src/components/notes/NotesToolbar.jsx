// const NotesToolbar = ({ search, setSearch, sort, setSort }) => {
//   return (
//     <div className="flex flex-col md:flex-row gap-4 mb-6">
//       <input
//         type="text"
//         placeholder="Search notes..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="flex-1 p-3 border rounded-lg"
//       />

//       <select
//         value={sort}
//         onChange={(e) => setSort(e.target.value)}
//         className="p-3 border rounded-lg"
//       >
//         <option value="newest">Newest</option>
//         <option value="oldest">Oldest</option>
//         <option value="az">A-Z</option>
//       </select>
//     </div>
//   );
// };

// export default NotesToolbar;


const NotesToolbar = ({ search, setSearch, sort, setSort }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="
          flex-1 p-3 rounded-xl 
          border border-gray-300 
          bg-white text-gray-800 
          placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-indigo-500 
          focus:border-indigo-500
          transition-all duration-200
          dark:bg-slate-800 
          dark:border-slate-700 
          dark:text-white 
          dark:placeholder-gray-400
        "
      />

      {/* Sort Select */}
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="
          p-3 rounded-xl 
          border border-gray-300 
          bg-white text-gray-800
          focus:outline-none focus:ring-2 focus:ring-indigo-500 
          focus:border-indigo-500
          transition-all duration-200
          dark:bg-slate-800 
          dark:border-slate-700 
          dark:text-white
        "
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="az">A-Z</option>
      </select>

    </div>
  );
};

export default NotesToolbar;
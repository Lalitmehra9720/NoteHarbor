

const NotesToolbar = ({ search, setSearch, sort, setSort }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">

      {/* 🔍 Search Input */}
      <input
        type="text"
        placeholder="Search notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="
          flex-1 p-3 rounded-xl
          focus:outline-none focus:ring-2 focus:ring-indigo-500
          transition-all duration-200
        "
        style={{
          background: "var(--card)",
          color: "var(--text)",
          border: "1px solid var(--border)",
        }}
      />

      {/* 🔽 Sort Select */}
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="
          p-3 rounded-xl
          focus:outline-none focus:ring-2 focus:ring-indigo-500
          transition-all duration-200
        "
        style={{
          background: "var(--card)",
          color: "var(--text)",
          border: "1px solid var(--border)",
        }}
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="az">A-Z</option>
      </select>

    </div>
  );
};

export default NotesToolbar;
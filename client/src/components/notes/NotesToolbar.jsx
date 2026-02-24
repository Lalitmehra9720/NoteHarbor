const NotesToolbar = ({ search, setSearch, sort, setSort }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <input
        type="text"
        placeholder="Search notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 p-3 border rounded-lg"
      />

      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="p-3 border rounded-lg"
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="az">A-Z</option>
      </select>
    </div>
  );
};

export default NotesToolbar;
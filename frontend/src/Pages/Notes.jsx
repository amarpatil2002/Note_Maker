import { useContext, useState } from "react";
import { NoteContext } from "../Context/NoteContext";
import { toast } from "react-toastify";

const Notes = () => {
  const [singleNote, setSingleNote] = useState({
    title: "",
    description: "",
  });
  const [editId, setEditId] = useState(null);
  const [btn , setBtn] = useState(true)

  const { allNotes, createNote, updateNote, deleteNote } =
    useContext(NoteContext);

  const handleChange = (e) => {
    setSingleNote((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
        updateNote(editId , singleNote)
        setBtn(true)
    } else {
      createNote(singleNote);
    }
    setSingleNote({ title: "", description: "" });
  };

  const updateNoteHandler = (item) => {
    // console.log(item.title);
    setSingleNote({ title: item.title, description: item.description });
    setEditId(item._id);
    setBtn(false)
  };

  const deleleNoteHandler = (item) => {
    deleteNote(item._id)
  }

return (
  <div className="min-h-screen bg-gray-100 p-4">
    <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">
      Notes
    </h1>

    {/* Form Card */}
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md mb-10">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Enter title"
          value={singleNote.title}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          name="description"
          placeholder="Enter description"
          value={singleNote.description}
          onChange={handleChange}
          rows="4"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
        >
          {btn ? "Add Note":"Update Note"}
        </button>
      </form>
    </div>

    {/* Notes List */}
    <div className="max-w-3xl mx-auto grid gap-4 sm:grid-cols-2
                max-h-[40vh] overflow-y-auto">
      {allNotes.map((item) => (
        <div
          key={item._id}
          className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {item.title}
          </h3>

          <div className="flex justify-between mt-4">
            <button
              onClick={() => updateNoteHandler(item)}
              className="px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Edit
            </button>

            <button onClick={() => deleleNoteHandler(item)}
              className="px-4 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

};

export default Notes;

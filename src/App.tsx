import { useState, useEffect } from 'react';
import { db, ref, set, get, update, remove } from './firebase.js';

interface AppProps {
  name?: string
}

const App = ({ name }: AppProps) => {
  const [data, setData] = useState<any[]>([]);
  const [newItem, setNewItem] = useState<string>('');
  const [editItem, setEditItem] = useState<{ id: string, name: string } | null>(null);

  // Fetch data from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dbRef = ref(db, 'items');
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setData(Object.entries(data).map(([id, value]) => ({ id, ...value })));
        }
      } catch (error) {
        console.error("Error getting data: ", error);
      }
    };
    fetchData();
  }, []);

  // Create new item
  const handleAddItem = async () => {
    if (newItem.trim() === '') return;
    const newId = Date.now().toString();
    try {
      await set(ref(db, 'items/' + newId), {
        name: newItem,
      });
      setNewItem('');
      setData(prevData => [...prevData, { id: newId, name: newItem }]);
    } catch (error) {
      console.error("Error adding item: ", error);
    }
  };

  // Update item
  const handleEditItem = async () => {
    if (!editItem) return;
    try {
      await update(ref(db, 'items/' + editItem.id), {
        name: editItem.name,
      });
      setData(prevData => prevData.map(item =>
        item.id === editItem.id ? { ...item, name: editItem.name } : item
      ));
      setEditItem(null);
    } catch (error) {
      console.error("Error updating item: ", error);
    }
  };

  // Delete item
  const handleDeleteItem = async (id: string) => {
    try {
      await remove(ref(db, 'items/' + id));
      setData(prevData => prevData.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting item: ", error);
    }
  };

  return (
    <div className='bg-zinc-950 p-2 rounded-md border border-zinc-900'>
      <h1>{name ? name : "fodasse sem nome"}</h1>
      <div className='flex flex-col items-center justify-center gap-1'>
        {/* Add New Item */}
        <div
          className='border rounded-md border-zinc-900 flex flex-col items-center justify-center gap-1 p-2'
        >
          <form onSubmit={(e) => e.preventDefault()} className='flex flex-row gap-2'>
          <input
            type="text"
            className='border border-zinc-900   px-[4px] rounded-md'
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add a new item"
          />
          <button
            className='border px-[2px] border-zinc-900 rounded-md'
            onClick={handleAddItem}>Add Item</button>
          </form>

        </div>

        {/* Edit Item */}
        {editItem && (
          <div >
            <form onSubmit={(e) => e.preventDefault()} className='flex flex-row gap-1'>
            <input
              type="text"
                       className='border  px-[2px] border-zinc-900 rounded-md'
              value={editItem.name}
              onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
              placeholder="Edit item"
            />
            <button         className='border  px-[2px] border-zinc-900 rounded-md'

              onClick={handleEditItem}>Save Changes</button>
              </form>
          </div>
        )}

        {/* Display Items */}
        <ul className='flex flex-col gap-1'>
          {data.map(item => (
            <li key={item.id} className='flex flex-row gap-1'>
              {item.name}
              <button
                className='border  px-[2px] border-zinc-900 rounded-md'
                onClick={() => setEditItem(item)}>Edit</button>
              <button
                className='border border-zinc-900 rounded-md'
                onClick={() => handleDeleteItem(item.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;

import { useState, useRef, useEffect } from "react";
import {
  EllipsisVerticalIcon,
  PencilSquareIcon,
  DocumentTextIcon,
  TrashIcon
} from "@heroicons/react/24/outline";

export default function ChartActionsMenu({ chart, onEdit, onRename, onDelete }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Fecha menu ao clicar fora
  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Ícone do menu */}
      <button
        onClick={() => setOpen(!open)}
        className="p-2 hover:bg-gray-100 rounded-lg transition"
      >
        <EllipsisVerticalIcon className="w-5 h-5 text-gray-600" />
      </button>

      {/* Menu Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 animate-fadeIn">
          <button
            onClick={() => {
              onEdit?.(chart);
              setOpen(false);
            }}
            className="flex items-center gap-3 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition rounded-t-lg"
          >
            <PencilSquareIcon className="w-4 h-4" />
            Editar
          </button>

          <button
            onClick={() => {
              onRename?.(chart);
              setOpen(false);
            }}
            className="flex items-center gap-3 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition"
          >
            <DocumentTextIcon className="w-4 h-4" />
            Renomear
          </button>

          <button
            onClick={() => {
              onDelete?.(chart);
              setOpen(false);
            }}
            className="flex items-center gap-3 w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition rounded-b-lg"
          >
            <TrashIcon className="w-4 h-4" />
            Deletar
          </button>
        </div>
      )}
    </div>
  );
}

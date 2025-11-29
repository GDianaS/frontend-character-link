import { useNavigate } from "react-router-dom";
import CategoryTag from "./CategoryTag";

function WorkCard({ data }) {
  const navigate = useNavigate();

  const { _id, title, category } = data;

  return (
    <div
      className="flex flex-col gap-2 cursor-pointer hover:opacity-90 transition"
      onClick={() => navigate(`/works/${_id}`)}
    >
      {/* Imagem */}
      <div className="bg-myown-bg-50 w-[120px] h-[150px] rounded-md shadow-sm" />

      <span className="text-sm font-medium">{title}</span>

      <CategoryTag category={category} />
    </div>
  );
}

export default WorkCard;

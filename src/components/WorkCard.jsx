import { useNavigate } from "react-router-dom";
import CategoryTag from "./CategoryTag";

function WorkCard({ data }) {
  const navigate = useNavigate();

  const { _id, title, category, imageCover } = data;

  return (
    <div
      onClick={() => navigate(`/works/${_id}`)}
      className="
        flex flex-col gap-3 cursor-pointer
        bg-white 
        p-3 rounded-xl shadow-md 
        hover:shadow-xl hover:-translate-y-1
        transition-all duration-300
        min-h-[320px]
      "
    >
      {/* Imagem */}
      <div className="w-full h-50 overflow-hidden rounded-lg bg-neutral-200">
        <img
          src={imageCover}
          alt={title}
          className="
            w-full h-full object-cover
            transition-transform duration-500
            hover:scale-105
          "
        />
      </div>

      {/* Categoria */}
      <div>
        <CategoryTag category={category} />
      </div>

      {/* Título */}
      <h3 className="text-base font-semibold text-neutral-900 leading-snug line-clamp-2">
        {title}
      </h3>
    </div>
  );
}

export default WorkCard;

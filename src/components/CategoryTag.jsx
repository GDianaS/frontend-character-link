function CategoryTag({ category }) {

    const colorMap = {
        book: "bg-[var(--color-myown-category-book)]",
        movie: "bg-[var(--color-myown-category-movie)]",
        manga: "bg-[var(--color-myown-category-manga)]",
        ebook: "bg-[var(--color-myown-category-ebook)]",
        novel: "bg-[var(--color-myown-category-novel)]",
        comic: "bg-[var(--color-myown-category-comic)]",
        series: "bg-[var(--color-myown-category-series)]",
        theater: "bg-[var(--color-myown-category-theater)]",
        audiobook: "bg-[var(--color-myown-category-audiobook)]",
        fanfic: "bg-[var(--color-myown-category-fanfic)]",
    };

    const bgColor = colorMap[category] || "bg-[var(--color-myown-primary-200)]";

    return (
        <span
            className={`
                ${bgColor}
                bg-opacity-40
                backdrop-blur-sm
                text-black
                text-xs
                px-3
                py-1
                rounded-full
                font-medium
                inline-block
                whitespace-nowrap
                capitalize
                shadow-sm
            `}
        >
            {category}
        </span>
    );
}

export default CategoryTag;

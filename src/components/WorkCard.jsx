import CategoryTag from "./CategoryTag";

function WorkCard({category}){
    return(
       <div className="flex flex-col gap-2">
        {/* Image */}
            <div className="bg-myown-bg-50 w-[120px] h-[150px]"/>
            <span className="text-sm">Name of the work</span>
            <CategoryTag category={category} />


       </div>
    )
}

export default WorkCard;
import React, { FC } from "react";
import Badge from "@/components/Badge/Badge";

export interface CategoryBadgeListProps {
  className?: string;
  itemClass?: string;
  categories: any;
}

const SubCategoryBadgeList: FC<CategoryBadgeListProps> = ({
  className = "flex flex-wrap space-x-2",
  itemClass,
  categories,
}) => {
    
  return (
    <div
      className={`nc-CategoryBadgeList ${className}`}
      data-nc-id="CategoryBadgeList"
    >
        {
          categories.id === "255d4855-644e-43ab-829b-16adc417df97" ? <Badge
            className={itemClass}
            name={categories.name}
            color={'primary'}
          /> : <Badge
          className={itemClass}
          name={categories.name}
          href={categories.href}
          color={'primary'} 
          />
        }
    </div>
  );
};

export default SubCategoryBadgeList;

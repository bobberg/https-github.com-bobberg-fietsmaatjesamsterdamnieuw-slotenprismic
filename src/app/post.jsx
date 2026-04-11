import { PrismicImage, PrismicRichText } from "@prismicio/react";
import { dateResolver } from "@/utils/helpers";

// Post component to display a news item
const Post = ({ data }) => {
  // Resolve the publication date
  const resolvedDate = dateResolver(data.date);

  return (
    <div className="
      flex flex-col gap-2
      px-4
      text-justify
    ">
      {/* Display the image */}
      <div className="flex flex-col items-center">
        <PrismicImage
          field={data.image}
          className="
          w-full h-[350px]
          object-cover object-center
        " />
        {data.image.copyright && (
          <h6
            className=" 
            relative max-w-[200px]
            mt-[-24px] p-1 rounded-t-lg
            font-bold
            text-white text-center
            bg-primary
          ">&copy; {data.image.copyright}</h6>
        )}
      </div>

      {/* Display the title */}
      <h1 className="mt-2">{data.title[0].text}</h1>

      {/* Display the publication date */}
      <h4 className="
        pb-2
        border-b border-primary
      ">
        {`${resolvedDate.day} ${resolvedDate.month} ${resolvedDate.year}`}
      </h4>

      {/* Display the body content */}
      <PrismicRichText field={data.body} />
    </div>
  );
};

export default Post;

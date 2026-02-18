import Image from "next/image";
import { GuideImage as GuideImageType } from "@/data/guides";

interface Props {
  image: GuideImageType;
  priority?: boolean;
}

export default function GuideImage({ image, priority = false }: Props) {
  return (
    <figure className="my-6">
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        priority={priority}
        sizes="(max-width: 768px) 100vw, 768px"
        className="w-full rounded-lg object-cover"
      />
      {image.credit && (
        <figcaption className="mt-2 text-center text-xs text-gray-400">
          {image.credit}
        </figcaption>
      )}
    </figure>
  );
}

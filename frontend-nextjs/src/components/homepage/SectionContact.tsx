import imageContact from "@/assets/image/contact/contact-image.webp";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
const SectionContact = () => {
  return (
    <div className="body-section-contact flex justify-around items-start px-20 py-16 ">
      <div className="content-section-contact flex justify-center items-center gap-10 ">
        <div>
          <Image src={imageContact} alt="image-section-contact" />
        </div>
        <div className=" w-1/2 flex flex-col gap-4 items-start justify-center">
          <span className="text-4xl font-bold">Liên hệ OPENLAB</span>
          <p>
            Hãy liên hệ với chúng tôi bất cứ khi nào bạn cần. Chúng tôi sẽ phản
            hồi trong thời gian sớm nhất!
          </p>
          <Link href="/contact">
            <Button
              effect="expandIcon"
              icon={ArrowRightIcon}
              iconPlacement="right"
              className="py-2 text-white px-6 bg-[#D32F2F] hover:transition-colors hover:duration-200 hover:ease-out hover:bg-[#1513be] cursor-pointer rounded"
            >
              Liên hệ
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SectionContact;

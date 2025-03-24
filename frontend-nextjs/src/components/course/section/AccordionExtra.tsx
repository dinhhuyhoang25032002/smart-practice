import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
type AccordionExtraProps = {
  content: string;
  description?: string[];
};
export default function AccordionExtra({
  content,
  description,
}: AccordionExtraProps) {
  return (
    <div>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="font-semibold cursor-pointer">
            {content}
          </AccordionTrigger>
          <AccordionContent>
            {description?.map((item, index) => {
              return <span key={index}>{item}</span>;
            })}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

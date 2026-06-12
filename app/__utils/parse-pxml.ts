import * as fs from "node:fs";
import path from "path";
import { XMLParser } from "fast-xml-parser";
import { Order, Product, PXMLDocument, RawPXML } from "@/app/__utils/pxml";

const parsePxml = (xml: string): RawPXML => {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
  });
  return parser.parse(xml);
};

const adaptPxml = (xml: PXMLDocument): Product[] | undefined => {
  if (Array.isArray(xml?.Order)) {
    return xml?.Order?.[0]?.Product;
  } else {
    if (xml?.Order) return (xml?.Order as Order)?.Product;
  }
};

export const retrieveFiles = () => {
  const folderPath = path.join(process.cwd(), "PXML", "21-0482", "PRM-001");
  const files = fs.readdirSync(folderPath);
  const results = [];
  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const parsedContent = parsePxml(fileContent);
    const data = adaptPxml(parsedContent?.PXML_Document);
    if (data) results.push(data);
  }
  return results?.flat();
};

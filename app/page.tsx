import Scene from "@/app/__components/scene";
import { retrieveFiles } from "@/app/__utils/parse-pxml";

export default function Home() {
  const files = retrieveFiles();

  return (
    <div className="w-dvw h-dvh">
      <Scene files={files} />
    </div>
  );
}

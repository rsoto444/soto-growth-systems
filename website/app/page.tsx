import WpPageView, { wpMetadata } from "./_components/WpPageView";
import { wpPage } from "@/lib/pages";

const home = wpPage("/")!;
export const metadata = wpMetadata(home);

export default function Home() {
  return <WpPageView page={home} />;
}

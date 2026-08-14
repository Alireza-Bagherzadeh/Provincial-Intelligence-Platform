import { CommandCenter } from "../../dashboard/components/command-center";
import { getCommandCenterData } from "../../dashboard/features/overview/data/overview";

export default async function CommandOverview() {
  const data = await getCommandCenterData();
  return <CommandCenter data={data} />;
}

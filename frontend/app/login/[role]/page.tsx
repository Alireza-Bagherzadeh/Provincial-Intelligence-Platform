import { notFound } from "next/navigation";

import { RoleLoginForm } from "../../../components/auth/role-login";
import { getLoginRole, loginRoles } from "../../../dashboard/features/executive/data/login-roles";

export function generateStaticParams() {
  return loginRoles.map((role) => ({ role: role.slug }));
}

export default async function ManagerLoginPage({ params }: { params: Promise<{ role: string }> }) {
  const { role: slug } = await params;
  const role = getLoginRole(slug);
  if (!role) notFound();
  return <RoleLoginForm role={role} />;
}

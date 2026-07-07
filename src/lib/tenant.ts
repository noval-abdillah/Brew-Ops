import { prisma, runWithDatabaseFallback } from './prisma';
import { mockTenant, mockUsers } from './mock-data';

export interface ResolvedTenant {
  id: string;
  slug: string;
  name: string;
  taxRate: number;
  currency: string;
  defaultUserId: string;
}

export async function resolveTenantBySlug(slug: string): Promise<ResolvedTenant | null> {
  return runWithDatabaseFallback(
    async () => {
      const tenant = await prisma.tenant.findUnique({ where: { slug } });
      if (!tenant) return null;

      const staff = await prisma.user.findFirst({
        where: { tenantId: tenant.id, active: true },
        orderBy: { role: 'asc' },
      });
      if (!staff) return null;

      return {
        id: tenant.id,
        slug: tenant.slug,
        name: tenant.name,
        taxRate: tenant.taxRate,
        currency: tenant.currency,
        defaultUserId: staff.id,
      };
    },
    async () => {
      if (slug === 'brewops') {
        return {
          id: mockTenant.id,
          slug: mockTenant.slug,
          name: mockTenant.name,
          taxRate: mockTenant.taxRate,
          currency: mockTenant.currency,
          defaultUserId: mockUsers[0].id,
        };
      }
      return null;
    }
  );
}

import { IClient } from '@/models/Client';

// simple helper functions to centralize plan logic
// these are used throughout the codebase to gate features or determine quotas

export type Plan = 'starter' | 'business' | 'pro';

/**
 * Return the default message allowance associated with a plan.
 * ``starter`` and ``business`` plans have hard caps; ``pro`` is unlimited.
 */
export function defaultMessageLimit(plan: Plan): number {
  switch (plan) {
    case 'starter':
      return 1000;
    case 'business':
      return 5000;
    case 'pro':
      // unlimited is represented by 0 in the schema, or you can simply
      // interpret this case specially everywhere the limit is checked.
      return 0;
    default:
      return 0;
  }
}

/**
 * Simple feature gating based on plan. Add additional flags as the product
 * evolves.
 */
export function hasFeature(
  client: IClient,
  feature: 'analytics' | 'advancedSupport' | 'aiInsights',
): boolean {
  switch (feature) {
    case 'analytics':
      // only business+ users get basic analytics
      return client.plan === 'business' || client.plan === 'pro';
    case 'advancedSupport':
      return client.plan === 'pro';
    case 'aiInsights':
      return client.plan === 'pro';
    default:
      return false;
  }
}

/**
 * Example usage
 *
 * ```ts
 * import Client from '@/models/Client';
 * import { hasFeature, resetMonthlyUsage } from '@/utils/plan';
 *
 * const client = await Client.findById(id);
 * if (client && hasFeature(client, 'analytics')) {
 *   // show analytics dashboard
 * }
 *
 * // at the top of each month (cron/worker job):
 * await resetMonthlyUsage();
 * ```
 */

/**
 * Reset usage counters for all non-pro clients at the beginning of a new billing
 * period. In a real system this would be kicked off by a scheduled job or
 * cloud function; here we simply export the helper for manual invocation or
 * mocking during tests.
 */
export async function resetMonthlyUsage(): Promise<void> {
  // zero out usageCount and optionally adjust messageLimit based on plan
  await import('@/models/Client')
    .then((mod) => {
      const ClientModel = mod.default;
      return ClientModel.updateMany(
        { plan: { $in: ['starter', 'business'] } },
        { $set: { usageCount: 0 } },
      ).exec();
    })
    .catch((err) => {
      console.error('monthly reset job failed', err);
    });
}

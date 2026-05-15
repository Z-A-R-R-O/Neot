import { getUser } from "@/lib/auth";

export async function createClient() {
  const user = await getUser();
  return {
    auth: {
      getUser: async () => ({ data: { user }, error: null }),
    },
  };
}

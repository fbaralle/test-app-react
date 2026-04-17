import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Favorite {
  id: number;
  user_id: string;
  coin_id: string;
  coin_name: string | null;
  coin_symbol: string | null;
  coin_image: string | null;
  created_at: number;
}

interface FavoritesResponse {
  favorites: Favorite[];
}

interface AddFavoriteParams {
  coin_id: string;
  coin_name?: string;
  coin_symbol?: string;
  coin_image?: string;
}

const basePath = import.meta.env.APP_PUBLIC_API_PATH || "";

async function fetchFavorites(): Promise<Favorite[]> {
    const res = await fetch(`${basePath}/api/favorites`);
  if (!res.ok) {
    throw new Error(`Failed to fetch favorites: ${res.status}`);
  }
  const data: FavoritesResponse = await res.json();
  return data.favorites;
}

async function addFavorite(params: AddFavoriteParams): Promise<void> {
    const res = await fetch(`${basePath}/api/favorites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error(`Failed to add favorite: ${res.status}`);
  }
}

async function removeFavorite(coinId: string): Promise<void> {
    const res = await fetch(`${basePath}/api/favorites?coin_id=${encodeURIComponent(coinId)}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error(`Failed to remove favorite: ${res.status}`);
  }
}

export function useFavorites() {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: fetchFavorites,
    retry: false,
  });
}

export function useAddFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addFavorite,
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeFavorite,
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

export default function FavoritesSection() {
  const { data: favorites = [], isLoading, error } = useFavorites();
  const removeFavoriteMutation = useRemoveFavorite();

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto mb-8">
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Favorite Coins
          </h2>
          <div className="animate-pulse flex gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto mb-8">
        <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Favorite Coins
          </h2>
          <p className="text-red-600 dark:text-red-400 text-sm">
            Failed to load favorites: {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto mb-8">
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Favorite Coins
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No favorites yet. Click the star icon on a coin to add it to your favorites.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto mb-8">
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Favorite Coins
        </h2>
        <div className="flex flex-wrap gap-3">
          {favorites.map((favorite) => (
            <div
              key={favorite.id}
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
            >
              {favorite.coin_image && (
                <img
                  src={favorite.coin_image}
                  alt={favorite.coin_name || favorite.coin_id}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
              <div className="flex flex-col">
                <span className="font-medium text-gray-900 dark:text-white text-sm">
                  {favorite.coin_name || favorite.coin_id}
                </span>
                {favorite.coin_symbol && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                    {favorite.coin_symbol}
                  </span>
                )}
              </div>
              <button
                onClick={() => removeFavoriteMutation.mutate(favorite.coin_id)}
                disabled={removeFavoriteMutation.isPending}
                className="ml-2 p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                aria-label={`Remove ${favorite.coin_name || favorite.coin_id} from favorites`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const TRIVIA_URL = `${import.meta.env.VITE_API_URL}/dashboard/trivia`;

export async function fetchTrivia() {
  try {
    const response = await fetch(TRIVIA_URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch trivia: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in fetchTrivia:', error);
    throw error;
  }
}

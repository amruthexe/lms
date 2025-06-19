// adminClient.js or sanityAdminClient.js
import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '../env'; // Ensure these values are correctly imported
import baseUrl from '@/lib/baseUrl';

console.log("Initializing Sanity Admin Client...");
console.log("Project ID:", projectId);
console.log("Dataset:", dataset);
console.log("API Version:", apiVersion);

export const adminClient = createClient({
  projectId,      // Sanity project ID from .env
  dataset,        // Sanity dataset from .env (e.g., "production", "final")
  apiVersion,     // Sanity API version (e.g., '2023-01-01')
  useCdn: false,  // Set to false to avoid using cached data (use fresh data)
  stega: {
    studioUrl: `${baseUrl}/studio`, // URL for Sanity Studio (make sure `baseUrl` is correct)
  },
  token: process.env.SANITY_API_ADMIN_TOKEN, // Admin token from .env for full access
});

console.log("Sanity Admin Client Initialized");

// Example usage: test a basic fetch with admin client
adminClient.fetch('*[_type == "post"]')
  .then(posts => {
    console.log("Fetched Posts (Admin):", posts);
  })
  .catch(error => {
    console.error("Error fetching posts (Admin):", error);
  });

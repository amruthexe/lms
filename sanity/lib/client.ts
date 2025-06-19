// client.js or sanityClient.js
import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '../env'; // Ensure these values are correctly imported
import baseUrl from '@/lib/baseUrl';

console.log("Initializing Sanity Client...");
console.log("Project ID:", projectId);
console.log("Dataset:", dataset);
console.log("API Version:", apiVersion);

export const client = createClient({
  projectId,      // Sanity project ID from .env
  dataset,        // Sanity dataset from .env (e.g., "production", "final")
  apiVersion,     // Sanity API version (e.g., '2023-01-01')
  useCdn: true,   // Set to true for caching, false for fresh data
  stega: {
    studioUrl: `${baseUrl}/studio`, // URL for Sanity Studio (make sure `baseUrl` is correct)
  },
});

console.log("Sanity Client Initialized");

// Example usage: test a basic fetch
client.fetch('*[_type == "post"]')
  .then(posts => {
    console.log("Fetched Posts:", posts);
  })
  .catch(error => {
    console.error("Error fetching posts:", error);
  });
